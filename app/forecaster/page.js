'use client';
import { useState, useEffect } from 'react';
import { Search, Save, Trash2, Settings, TrendingUp, MapPin, Phone, Globe, Star, Clock, ArrowLeft, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ForecasterPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [savedProspects, setSavedProspects] = useState([]);
  const [calibration, setCalibration] = useState({
    venueName: '',
    reviews: '',
    actualWeeklyTraffic: '',
    monthlyVendingRevenue: '',
    conversionRate: 2.0,
    avgTransactionValue: 12,
  });
  const [calibrationHistory, setCalibrationHistory] = useState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('forecasterProspects');
    if (saved) setSavedProspects(JSON.parse(saved));
    
    const savedCal = localStorage.getItem('forecasterCalibration');
    if (savedCal) {
      const cal = JSON.parse(savedCal);
      setCalibration(prev => ({ ...prev, ...cal.current }));
      setCalibrationHistory(cal.history || []);
    }
  }, []);

  // Save prospects to localStorage
  useEffect(() => {
    if (savedProspects.length > 0) {
      localStorage.setItem('forecasterProspects', JSON.stringify(savedProspects));
    }
  }, [savedProspects]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    
    try {
      const response = await fetch('/api/forecaster/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setSearchError(data.error);
        return;
      }
      
      // Apply calibration adjustments to results
      const adjustedResults = data.results.map(venue => applyCalibration(venue));
      setSearchResults(adjustedResults);
    } catch (error) {
      setSearchError('Search failed: ' + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const applyCalibration = (venue) => {
    // If we have calibration data, adjust the estimates
    if (calibrationHistory.length > 0) {
      const latestCal = calibrationHistory[calibrationHistory.length - 1];
      const ratio = latestCal.actualWeeklyTraffic / latestCal.reviews;
      
      const estimatedWeeklyTraffic = Math.round(venue.reviews * ratio);
      const conversionRate = calibration.conversionRate / 100;
      const avgSale = calibration.avgTransactionValue;
      
      const weeklyVendingSales = estimatedWeeklyTraffic * conversionRate;
      const weeklyRevenue = weeklyVendingSales * avgSale;
      const monthlyRevenue = weeklyRevenue * 4.33;
      
      return {
        ...venue,
        estimatedWeeklyTraffic,
        estimatedWeeklySales: Math.round(weeklyVendingSales),
        estimatedWeeklyRevenue: Math.round(weeklyRevenue),
        estimatedMonthlyRevenue: Math.round(monthlyRevenue)
      };
    }
    return venue;
  };

  const saveProspect = (venue) => {
    if (savedProspects.find(p => p.placeId === venue.placeId)) {
      alert('Already saved!');
      return;
    }
    setSavedProspects(prev => [...prev, { ...venue, savedAt: new Date().toISOString() }]);
  };

  const deleteProspect = (placeId) => {
    setSavedProspects(prev => prev.filter(p => p.placeId !== placeId));
  };

  const saveCalibration = () => {
    if (!calibration.venueName || !calibration.reviews || !calibration.actualWeeklyTraffic) {
      alert('Please fill in venue name, reviews count, and actual weekly traffic');
      return;
    }
    
    const newEntry = {
      venueName: calibration.venueName,
      reviews: parseInt(calibration.reviews),
      actualWeeklyTraffic: parseInt(calibration.actualWeeklyTraffic),
      monthlyVendingRevenue: calibration.monthlyVendingRevenue ? parseInt(calibration.monthlyVendingRevenue) : null,
      savedAt: new Date().toISOString()
    };
    
    const newHistory = [...calibrationHistory, newEntry];
    setCalibrationHistory(newHistory);
    
    localStorage.setItem('forecasterCalibration', JSON.stringify({
      current: {
        conversionRate: calibration.conversionRate,
        avgTransactionValue: calibration.avgTransactionValue
      },
      history: newHistory
    }));
    
    setCalibration(prev => ({
      ...prev,
      venueName: '',
      reviews: '',
      actualWeeklyTraffic: '',
      monthlyVendingRevenue: ''
    }));
    
    alert('Calibration saved! Future searches will use this data.');
  };

  const totalMonthlyRevenue = savedProspects.reduce((sum, p) => sum + (p.estimatedMonthlyRevenue || 0), 0);

  const formatHour = (hour) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const copyShareLink = (venue) => {
    navigator.clipboard.writeText(`${window.location.origin}/forecaster?place=${venue.placeId}`);
    alert('Link copied!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tracker
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">🚬 Revenue Forecaster</h1>
          <p className="text-white/80">Estimate vending machine revenue for any venue</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="search"><Search className="h-4 w-4 mr-2" />Search</TabsTrigger>
            <TabsTrigger value="prospects"><Save className="h-4 w-4 mr-2" />Saved ({savedProspects.length})</TabsTrigger>
            <TabsTrigger value="calibration"><Settings className="h-4 w-4 mr-2" />Calibrate</TabsTrigger>
          </TabsList>
          
          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter venue name and city (e.g., 'McKees Pub Lake Havasu City')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    className="flex-1"
                  />
                  <Button onClick={performSearch} disabled={isSearching}>
                    {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="ml-2">{isSearching ? 'Searching...' : 'Search'}</span>
                  </Button>
                </div>
                {isSearching && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Fetching venue data from Google Places... This may take 30-60 seconds.
                  </p>
                )}
              </CardContent>
            </Card>
            
            {searchError && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive">{searchError}</p>
                </CardContent>
              </Card>
            )}
            
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((venue, idx) => (
                  <VenueCard 
                    key={venue.placeId || idx} 
                    venue={venue} 
                    onSave={saveProspect}
                    onShare={copyShareLink}
                    formatHour={formatHour}
                  />
                ))}
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && !searchError && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Search for a bar, pub, or nightclub to see revenue estimates</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Saved Prospects Tab */}
          <TabsContent value="prospects" className="space-y-6">
            {savedProspects.length > 0 && (
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardContent className="py-6 text-center">
                  <p className="text-sm opacity-90">Total Estimated Monthly Revenue</p>
                  <p className="text-4xl font-bold">${totalMonthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm opacity-90">{savedProspects.length} locations</p>
                </CardContent>
              </Card>
            )}
            
            {savedProspects.length > 0 ? (
              <div className="space-y-4">
                {savedProspects.map((venue, idx) => (
                  <VenueCard 
                    key={venue.placeId || idx} 
                    venue={venue} 
                    onDelete={deleteProspect}
                    onShare={copyShareLink}
                    formatHour={formatHour}
                    saved
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Save className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No saved prospects yet. Search for venues to add them.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Calibration Tab */}
          <TabsContent value="calibration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Calibration Data</CardTitle>
                <CardDescription>
                  Enter actual data from known venues to improve forecast accuracy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Venue Name</label>
                    <Input
                      placeholder="e.g., Flying X Saloon"
                      value={calibration.venueName}
                      onChange={(e) => setCalibration(prev => ({ ...prev, venueName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Google Reviews Count</label>
                    <Input
                      type="number"
                      placeholder="e.g., 797"
                      value={calibration.reviews}
                      onChange={(e) => setCalibration(prev => ({ ...prev, reviews: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Actual Weekly Foot Traffic</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1200"
                      value={calibration.actualWeeklyTraffic}
                      onChange={(e) => setCalibration(prev => ({ ...prev, actualWeeklyTraffic: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Monthly Vending Revenue (if known)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 800"
                      value={calibration.monthlyVendingRevenue}
                      onChange={(e) => setCalibration(prev => ({ ...prev, monthlyVendingRevenue: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={saveCalibration}>Save Calibration Data</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Model Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Conversion Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={calibration.conversionRate}
                      onChange={(e) => setCalibration(prev => ({ ...prev, conversionRate: parseFloat(e.target.value) || 2 }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">% of foot traffic that buys from vending</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Average Transaction ($)</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={calibration.avgTransactionValue}
                      onChange={(e) => setCalibration(prev => ({ ...prev, avgTransactionValue: parseFloat(e.target.value) || 12 }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Average sale amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {calibrationHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Calibration History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {calibrationHistory.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <strong>{entry.venueName}</strong>: {entry.actualWeeklyTraffic.toLocaleString()} weekly visitors / {entry.reviews.toLocaleString()} reviews
                        {entry.monthlyVendingRevenue && ` / $${entry.monthlyVendingRevenue}/mo revenue`}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function VenueCard({ venue, onSave, onDelete, onShare, formatHour, saved = false }) {
  const peakTimesDisplay = venue.peakTimes?.slice(0, 3) || [];
  
  // Render popular times chart for Friday
  const renderChart = () => {
    const friday = venue.popularTimes?.Fr || venue.popularTimes?.Sa || Object.values(venue.popularTimes || {})[0];
    if (!friday || !Array.isArray(friday)) return null;
    
    return (
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">📊 Popular Times (Friday)</p>
        <div className="flex items-end gap-0.5 h-12">
          {friday.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-violet-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
              style={{ height: `${Math.max(4, h.occupancyPercent)}%` }}
              title={`${formatHour(h.hour)}: ${h.occupancyPercent}%`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p className="text-sm text-muted-foreground">{venue.category || 'Venue'}</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {venue.rating?.toFixed(1) || 'N/A'}
            <span className="text-muted-foreground">({venue.reviews?.toLocaleString() || 0})</span>
          </Badge>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-600">{venue.estimatedWeeklyTraffic?.toLocaleString() || '—'}</p>
            <p className="text-xs text-muted-foreground">Weekly Traffic</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-600">{venue.estimatedWeeklySales || '—'}</p>
            <p className="text-xs text-muted-foreground">Est. Weekly Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${venue.estimatedWeeklyRevenue?.toLocaleString() || '—'}</p>
            <p className="text-xs text-muted-foreground">Weekly Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${venue.estimatedMonthlyRevenue?.toLocaleString() || '—'}</p>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </div>
        </div>
        
        {renderChart()}
        
        {/* Peak Times */}
        {peakTimesDisplay.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm font-medium">Peak Times:</span>
            {peakTimesDisplay.map((p, i) => (
              <Badge key={i} className="bg-orange-500">
                {p.day} {formatHour(p.hour)} ({p.occupancy}%)
              </Badge>
            ))}
          </div>
        )}
        
        {/* Details */}
        <div className="mt-4 space-y-1 text-sm text-muted-foreground">
          {venue.address && (
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{venue.address}</p>
          )}
          {venue.phone && (
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{venue.phone}</p>
          )}
          {venue.website && (
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                {venue.website}
              </a>
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {saved ? (
            <Button variant="destructive" size="sm" onClick={() => onDelete(venue.placeId)}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => onSave(venue)}>
              <Save className="h-4 w-4 mr-2" />Save to Prospects
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onShare(venue)}>
            <Share2 className="h-4 w-4 mr-2" />Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
