import { NextResponse } from 'next/server';

export async function POST(request) {
  const { query } = await request.json();
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }
  
  const APIFY_TOKEN = process.env.APIFY_TOKEN;
  
  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: 'Apify token not configured. Add APIFY_TOKEN to Vercel environment variables.' }, { status: 500 });
  }
  
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchStringsArray: [query],
          maxCrawledPlacesPerSearch: 5,
          language: 'en'
        })
      }
    );
    
    const data = await response.json();
    
    // Process and return results
    const results = data.map(place => ({
      placeId: place.placeId,
      name: place.title,
      address: place.address,
      rating: place.totalScore,
      reviews: place.reviewsCount,
      category: place.categoryName,
      phone: place.phone,
      website: place.website,
      popularTimes: place.popularTimesHistogram,
      ...calculateEstimates(place)
    }));
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed', details: error.message }, { status: 500 });
  }
}

// Default calibration values
const defaultCalibration = {
  baseConversionRate: 0.02,  // 2% of foot traffic buys from vending
  avgTransactionValue: 12,    // $12 average sale
  reviewToTrafficRatio: 0.5,  // reviews per week ≈ reviews * 0.5
};

function calculateEstimates(place, calibration = defaultCalibration) {
  const reviews = place.reviewsCount || 0;
  const popularTimes = place.popularTimesHistogram || {};
  
  // Estimate weekly foot traffic based on reviews
  let estimatedWeeklyTraffic = Math.round(reviews * calibration.reviewToTrafficRatio);
  
  // Adjust based on popular times if available
  if (Object.keys(popularTimes).length > 0) {
    const avgPeakOccupancy = calculateAvgPeakOccupancy(popularTimes);
    estimatedWeeklyTraffic = Math.round(estimatedWeeklyTraffic * (avgPeakOccupancy / 50));
  }
  
  // Revenue calculation
  const weeklyVendingSales = estimatedWeeklyTraffic * calibration.baseConversionRate;
  const weeklyRevenue = weeklyVendingSales * calibration.avgTransactionValue;
  const monthlyRevenue = weeklyRevenue * 4.33;
  
  return {
    estimatedWeeklyTraffic,
    estimatedWeeklySales: Math.round(weeklyVendingSales),
    estimatedWeeklyRevenue: Math.round(weeklyRevenue),
    estimatedMonthlyRevenue: Math.round(monthlyRevenue),
    peakTimes: extractPeakTimes(popularTimes)
  };
}

function calculateAvgPeakOccupancy(popularTimes) {
  const days = Object.values(popularTimes);
  if (days.length === 0) return 50;
  
  const peaks = days.map(day => {
    if (!Array.isArray(day)) return 0;
    return Math.max(...day.map(h => h.occupancyPercent || 0));
  });
  
  return peaks.reduce((a, b) => a + b, 0) / peaks.length;
}

function extractPeakTimes(popularTimes) {
  const peaks = [];
  const dayNames = { Su: 'Sunday', Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday' };
  
  for (const [day, hours] of Object.entries(popularTimes)) {
    if (!Array.isArray(hours)) continue;
    const maxHour = hours.reduce((max, h) => h.occupancyPercent > (max?.occupancyPercent || 0) ? h : max, null);
    if (maxHour && maxHour.occupancyPercent >= 70) {
      peaks.push({ day: dayNames[day] || day, hour: maxHour.hour, occupancy: maxHour.occupancyPercent });
    }
  }
  
  return peaks.sort((a, b) => b.occupancy - a.occupancy);
}
