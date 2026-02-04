// VapeTM Machine Catalog
export const vapeTmMachines = [
  // Wall-Mounted
  { id: 'mini-wall', name: 'Mini Wall', type: 'wall', slots: 8, price: 2850, description: 'Most compact, ideal for small spaces' },
  { id: 'slim-wall', name: 'Slim Wall', type: 'wall', slots: 16, price: 3450, description: 'Sleek profile, good capacity' },
  { id: 'slim-wall-tin', name: 'Slim Wall Tin Lift', type: 'wall', slots: 12, price: 3500, description: 'Pouch-focused, tin lift mechanism' },
  { id: 'mega-wall', name: 'Mega Wall', type: 'wall', slots: 24, price: 3900, description: 'High capacity wall mount' },
  { id: 'mega-wall-2', name: 'Mega Wall 2.0', type: 'wall', slots: 24, price: 3950, description: 'Updated version, improved UI' },
  // Towers
  { id: 'slim-tower', name: 'Slim Tower', type: 'tower', slots: 32, price: 4500, description: 'Free-standing, good visibility' },
  { id: 'slim-tower-2', name: 'Slim Tower 2.0', type: 'tower', slots: 32, price: 5000, description: '43" touch screen - RECOMMENDED', recommended: true },
  { id: 'slim-pack-tower', name: 'Slim Pack Tower 2.0', type: 'tower', slots: 32, price: 5000, description: 'Pack-optimized layout' },
  { id: 'mega-tower', name: 'Mega Tower', type: 'tower', slots: 48, price: 6200, description: 'Large capacity, high traffic' },
  { id: 'mega-tower-smart', name: 'Mega Tower Smart', type: 'tower', slots: 48, price: 6200, description: '32" touch, smart inventory' },
];

export const accessories = [
  { id: 'id-scanner', name: 'ID Scanner', price: 300, required: true },
  { id: 'card-reader', name: 'Nayax VPOS Card Reader', price: 350, required: true },
  { id: 'pedestal', name: 'Pedestal Stand', price: 450, required: false },
  { id: 'led-sign', name: 'LED "Vapes Inside" Sign', price: 150, required: false },
];

// Product Catalog with margins
export const productCatalog = [
  { id: 1, name: "Geek Bar Pulse 15000", category: "Vape", wholesale: 9.50, retail: 32, supplier: "SmokeDirect", supplierUrl: "https://smokedirect.com", notes: "VapeTM recommended" },
  { id: 2, name: "RAZ TN9000", category: "Vape", wholesale: 10.00, retail: 35, supplier: "SmokeDirect", supplierUrl: "https://smokedirect.com", notes: "Popular" },
  { id: 3, name: "Lost Mary MO5000", category: "Vape", wholesale: 8.50, retail: 28, supplier: "SmokeDirect", supplierUrl: "https://smokedirect.com", notes: "" },
  { id: 4, name: "Elf Bar BC5000", category: "Vape", wholesale: 8.00, retail: 25, supplier: "SmokeDirect", supplierUrl: "https://smokedirect.com", notes: "" },
  { id: 5, name: "Zyn 6mg", category: "Pouch", wholesale: 3.80, retail: 15, supplier: "Nicokick", supplierUrl: "https://nicokick.com", notes: "Most popular" },
  { id: 6, name: "Zyn 3mg", category: "Pouch", wholesale: 3.80, retail: 15, supplier: "Nicokick", supplierUrl: "https://nicokick.com", notes: "" },
  { id: 7, name: "On! 4mg", category: "Pouch", wholesale: 3.50, retail: 12, supplier: "Nicokick", supplierUrl: "https://nicokick.com", notes: "" },
  { id: 8, name: "USB-C Charger", category: "Convenience", wholesale: 2.50, retail: 20, supplier: "Alibaba", supplierUrl: "https://alibaba.com", notes: "700% margin" },
  { id: 9, name: "Disposable Camera", category: "Convenience", wholesale: 6.00, retail: 25, supplier: "Alibaba", supplierUrl: "https://alibaba.com", notes: "Trendy" },
  { id: 10, name: "Power Bank", category: "Convenience", wholesale: 4.00, retail: 25, supplier: "Alibaba", supplierUrl: "https://alibaba.com", notes: "" },
  { id: 11, name: "Advil 2-pack", category: "Convenience", wholesale: 0.35, retail: 5, supplier: "Amazon", supplierUrl: "https://amazon.com", notes: "1300% margin!" },
  { id: 12, name: "Morning Recovery", category: "Convenience", wholesale: 3.50, retail: 12, supplier: "VapeTM", supplierUrl: "https://vapetm.com", notes: "" },
];

export const suppliers = [
  { name: "SmokeDirect", url: "https://smokedirect.com", phone: "888-537-8273", notes: "VapeTM recommended. Call to set up wholesale account." },
  { name: "Nicokick", url: "https://nicokick.com", phone: null, notes: "Zyn, On!, Velo, Rogue pouches" },
  { name: "Alibaba", url: "https://alibaba.com", phone: null, notes: "Cameras $5-8, chargers $2-4 bulk" },
  { name: "VapeTM", url: "https://vapetm.com", phone: "888-537-8273", notes: "Morning Recovery, machines, supplies" },
];

// Full Arizona Prospects - 39 bars with scoring methodology
// Hours Score: 2AM close = 10, Midnight = 7, Earlier = 5
// Traffic Score: Based on Google reviews (proxy for foot traffic)
// Demo Score: College/nightlife demographic bonus
export const initialProspects = [
  // Lake Havasu (8 bars) - Jack's home base
  { id: 1, name: "The Office Cocktail Lounge & Grill", address: "2180 W Acoma Blvd", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.6, reviews: 521, phone: "(928) 855-9583", website: "officebarhavasu.com", hoursScore: 10, trafficScore: 7, demoScore: 8, estMonthly: 1050, estAnnual: 12600, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 2, name: "BJ's Cabana Bar & Karaoke", address: "2122 McCulloch Blvd N", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.2, reviews: 982, phone: "(928) 854-2122", website: "bjscabanabar.com", hoursScore: 10, trafficScore: 9, demoScore: 8, estMonthly: 1350, estAnnual: 16200, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 3, name: "Flying X Saloon", address: "2030 McCulloch Blvd N", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.5, reviews: 797, phone: "(928) 854-3599", website: "flyingxsaloon.com", hoursScore: 10, trafficScore: 8, demoScore: 8, estMonthly: 1200, estAnnual: 14400, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 4, name: "McKee's Pub & Grill", address: "2112 McCulloch Blvd N", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.4, reviews: 711, phone: "(928) 453-8400", website: "mckeespubgrill.shop", hoursScore: 10, trafficScore: 8, demoScore: 8, estMonthly: 1150, estAnnual: 13800, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 5, name: "R Bar and Grill", address: "3185 Maricopa Ave", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.5, reviews: 510, phone: "(928) 453-3876", website: "facebook.com", hoursScore: 10, trafficScore: 7, demoScore: 8, estMonthly: 1000, estAnnual: 12000, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 6, name: "Desert Martini", address: "2120 McCulloch Blvd N", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.4, reviews: 228, phone: "", website: "facebook.com/desertmartini", hoursScore: 10, trafficScore: 5, demoScore: 8, estMonthly: 850, estAnnual: 10200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 7, name: "Glitch Barcadium", address: "44 Mulberry Ave", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.9, reviews: 158, phone: "(928) 302-1006", website: "glitchbarcadium.com", hoursScore: 7, trafficScore: 4, demoScore: 9, estMonthly: 700, estAnnual: 8400, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "Arcade bar - younger demo", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 8, name: "Martini Bay", address: "1477 Queens Bay", city: "Lake Havasu City", area: "Lake Havasu", rating: 4.3, reviews: 794, phone: "(928) 855-0888", website: "martinibay.com", hoursScore: 7, trafficScore: 8, demoScore: 7, estMonthly: 900, estAnnual: 10800, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  
  // ASU/Tempe (11 bars) - College hotspot
  { id: 9, name: "Fat Tuesday", address: "680 S Mill Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.2, reviews: 1378, phone: "(480) 967-3917", website: "fattuesdayaz.com", hoursScore: 10, trafficScore: 10, demoScore: 10, estMonthly: 1800, estAnnual: 21600, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "Top prospect - high traffic college bar", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 10, name: "Yucca Tap Room", address: "29 W Southern Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.5, reviews: 1711, phone: "(480) 967-4777", website: "yuccatap.com", hoursScore: 10, trafficScore: 10, demoScore: 10, estMonthly: 1700, estAnnual: 20400, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 11, name: "Pedal Haus Brewery", address: "730 S Mill Ave #102", city: "Tempe", area: "ASU/Tempe", rating: 4.5, reviews: 1934, phone: "(480) 314-2337", website: "pedalhausbrewery.com", hoursScore: 8, trafficScore: 10, demoScore: 10, estMonthly: 1650, estAnnual: 19800, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 12, name: "Mill's Modern Social", address: "83 E Broadway Rd", city: "Tempe", area: "ASU/Tempe", rating: 4.3, reviews: 1667, phone: "(602) 689-5361", website: "millsmodernsocial.com", hoursScore: 10, trafficScore: 10, demoScore: 10, estMonthly: 1650, estAnnual: 19800, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 13, name: "Low Key Piano Bar", address: "501 S Mill Ave b101", city: "Tempe", area: "ASU/Tempe", rating: 4.2, reviews: 1127, phone: "(480) 355-1705", website: "lowkeypianobar.com", hoursScore: 10, trafficScore: 9, demoScore: 10, estMonthly: 1450, estAnnual: 17400, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 14, name: "Final Round", address: "5030 S Mill Ave Suite D20", city: "Tempe", area: "ASU/Tempe", rating: 4.4, reviews: 1195, phone: "(480) 456-3663", website: "finalroundaz.com", hoursScore: 10, trafficScore: 9, demoScore: 10, estMonthly: 1500, estAnnual: 18000, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 15, name: "Tempe Tavern", address: "1810 E Apache Blvd", city: "Tempe", area: "ASU/Tempe", rating: 4.2, reviews: 1116, phone: "(480) 794-1706", website: "tempetavern.com", hoursScore: 10, trafficScore: 9, demoScore: 10, estMonthly: 1400, estAnnual: 16800, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 16, name: "Varsity Tavern", address: "501 S Mill Ave #200", city: "Tempe", area: "ASU/Tempe", rating: 3.7, reviews: 725, phone: "(480) 534-8620", website: "varsitytavern.com", hoursScore: 10, trafficScore: 8, demoScore: 10, estMonthly: 1300, estAnnual: 15600, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 17, name: "The Hudson Eatery & Bar", address: "1601 E Apache Blvd", city: "Tempe", area: "ASU/Tempe", rating: 4.7, reviews: 564, phone: "(480) 699-4173", website: "hudsontempe.com", hoursScore: 8, trafficScore: 7, demoScore: 9, estMonthly: 950, estAnnual: 11400, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 18, name: "Devil's Hideaway", address: "401 S Mill Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.1, reviews: 158, phone: "(480) 698-6646", website: "drinkatdevils.com", hoursScore: 10, trafficScore: 4, demoScore: 10, estMonthly: 850, estAnnual: 10200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 19, name: "Neon Spur", address: "680 S Mill Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.3, reviews: 156, phone: "(480) 209-1760", website: "neonspurdive.com", hoursScore: 10, trafficScore: 4, demoScore: 10, estMonthly: 850, estAnnual: 10200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },

  // Old Town Scottsdale (11 bars)
  { id: 20, name: "Pattie's First Avenue Lounge", address: "7220 E 1st Ave", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.3, reviews: 1763, phone: "(480) 990-0103", website: "pattiesfirstavenuelounge.cfd", hoursScore: 10, trafficScore: 10, demoScore: 9, estMonthly: 1600, estAnnual: 19200, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 21, name: "Boondocks Patio & Grill", address: "4341 N 75th St", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.3, reviews: 1750, phone: "(480) 949-8454", website: "patio.boondocksaz.com", hoursScore: 10, trafficScore: 10, demoScore: 9, estMonthly: 1550, estAnnual: 18600, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 22, name: "Rusty Spur Saloon", address: "7245 E Main St", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.5, reviews: 1647, phone: "(480) 425-7787", website: "rustyspursaloon.com", hoursScore: 10, trafficScore: 10, demoScore: 9, estMonthly: 1500, estAnnual: 18000, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 23, name: "Dierks Bentley's Whiskey Row", address: "4420 N Saddlebag Trail", city: "Scottsdale", area: "Old Town Scottsdale", rating: 3.8, reviews: 1468, phone: "(480) 945-4200", website: "dierkswhiskeyrow.com", hoursScore: 10, trafficScore: 10, demoScore: 9, estMonthly: 1600, estAnnual: 19200, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 24, name: "Wasted Grain", address: "7295 E Stetson Dr", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.3, reviews: 1324, phone: "(480) 970-0500", website: "wastedgrain.com", hoursScore: 10, trafficScore: 9, demoScore: 9, estMonthly: 1400, estAnnual: 16800, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 25, name: "Old Town Tavern", address: "7330 E Main St", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.5, reviews: 1188, phone: "(480) 306-7320", website: "oldtowntavernaz.com", hoursScore: 10, trafficScore: 9, demoScore: 9, estMonthly: 1350, estAnnual: 16200, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 26, name: "Coach House Entertainment", address: "7011 E Indian School Rd", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.5, reviews: 1088, phone: "(480) 990-3433", website: "coachhousescottsdale.com", hoursScore: 10, trafficScore: 9, demoScore: 9, estMonthly: 1300, estAnnual: 15600, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 27, name: "The Beverly on Main", address: "7018 E Main St", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.4, reviews: 955, phone: "(480) 889-5580", website: "beverlyonmain.com", hoursScore: 10, trafficScore: 8, demoScore: 9, estMonthly: 1200, estAnnual: 14400, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 28, name: "Rockbar Inc.", address: "4245 N Craftsman Ct", city: "Scottsdale", area: "Old Town Scottsdale", rating: 4.4, reviews: 907, phone: "(480) 331-9190", website: "rockbarscottsdale.com", hoursScore: 10, trafficScore: 8, demoScore: 9, estMonthly: 1150, estAnnual: 13800, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 29, name: "Riot House Scottsdale", address: "4425 N Saddlebag Trail", city: "Scottsdale", area: "Old Town Scottsdale", rating: 3.4, reviews: 646, phone: "(480) 935-5910", website: "riothouse.com", hoursScore: 10, trafficScore: 7, demoScore: 9, estMonthly: 1100, estAnnual: 13200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },

  // Flagstaff (9 bars)
  { id: 30, name: "Collins Irish Pub", address: "2 N Leroux St", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.0, reviews: 2184, phone: "(928) 214-7363", website: "collinsirishpub.com", hoursScore: 10, trafficScore: 10, demoScore: 9, estMonthly: 1500, estAnnual: 18000, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "Highest reviews in Flagstaff", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 31, name: "Dirty Birdies Sports Bar & Grill", address: "2285 E Butler Ave", city: "Flagstaff", area: "Flagstaff", rating: 4.2, reviews: 900, phone: "(928) 440-4502", website: "dirtybirdiesbargrill.com", hoursScore: 10, trafficScore: 8, demoScore: 8, estMonthly: 1100, estAnnual: 13200, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 32, name: "Uptown Pubhouse", address: "114 N Leroux St", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.5, reviews: 674, phone: "(928) 773-0551", website: "uptownpubhouse.com", hoursScore: 10, trafficScore: 7, demoScore: 9, estMonthly: 1050, estAnnual: 12600, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 33, name: "Historic Brewing Barrel House", address: "110 S San Francisco St", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.4, reviews: 598, phone: "(928) 774-0454", website: "historicbrewingcompany.com", hoursScore: 8, trafficScore: 7, demoScore: 8, estMonthly: 900, estAnnual: 10800, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 34, name: "Flagstaff Brewing Company", address: "16 Historic Rte 66", city: "Flagstaff", area: "Downtown Flagstaff", rating: 3.6, reviews: 560, phone: "(928) 773-1442", website: "flagbrew.com", hoursScore: 8, trafficScore: 7, demoScore: 8, estMonthly: 850, estAnnual: 10200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 35, name: "Sportsman's Bar & Grill", address: "1000 N Humphreys St", city: "Flagstaff", area: "Flagstaff", rating: 4.2, reviews: 542, phone: "(928) 774-4022", website: "", hoursScore: 10, trafficScore: 7, demoScore: 8, estMonthly: 950, estAnnual: 11400, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 36, name: "Hops On Birch", address: "22 E Birch Ave #2", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.6, reviews: 537, phone: "", website: "hopsonbirch.net", hoursScore: 8, trafficScore: 7, demoScore: 8, estMonthly: 900, estAnnual: 10800, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 37, name: "The Annex Cocktail Lounge", address: "50 S San Francisco St", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.6, reviews: 459, phone: "(928) 779-2811", website: "annexcocktaillounge.com", hoursScore: 8, trafficScore: 6, demoScore: 8, estMonthly: 850, estAnnual: 10200, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 38, name: "Monte Vista Cocktail Lounge", address: "100 N San Francisco St", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.2, reviews: 399, phone: "(928) 779-6971", website: "hotelmontevista.com", hoursScore: 8, trafficScore: 6, demoScore: 8, estMonthly: 800, estAnnual: 9600, priority: "B", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 39, name: "Mountain Top Tap Room", address: "10 E Rte 66", city: "Flagstaff", area: "Downtown Flagstaff", rating: 4.8, reviews: 209, phone: "(928) 686-7452", website: "mountaintoptaproom.squarespace.com", hoursScore: 8, trafficScore: 5, demoScore: 8, estMonthly: 750, estAnnual: 9000, priority: "C", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
];

export const statusOptions = [
  { value: 'not_contacted', label: 'Not Contacted', color: 'bg-gray-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'meeting', label: 'Meeting Set', color: 'bg-blue-500' },
  { value: 'negotiating', label: 'Negotiating', color: 'bg-purple-500' },
  { value: 'won', label: 'Won 🎉', color: 'bg-green-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export const profitSplitGuide = [
  { tier: 'Standard', split: '15-20%', description: 'Most locations - start here' },
  { tier: 'Good Traffic', split: '20-25%', description: 'Above average foot traffic' },
  { tier: 'Premium', split: '25-30%', description: 'High traffic, great demographics' },
  { tier: 'Top-Tier', split: '30-40%', description: 'Exceptional locations only' },
];

export const callScript = {
  opening: `Hey [NAME], this is Jack. I don't know if we've met yet—I've been putting nightlife vending machines in bars around [CITY]. I don't know if you've seen one yet?`,
  valueProps: [
    "When customers need nicotine, they LEAVE the bar—often taking their whole group.",
    "After 3 months, people know you have it. You'll attract NEW customers.",
    "We also stock chargers, cameras, recovery drinks—everything for 8PM-2AM."
  ],
  objections: {
    "How big?": "About the size of a TouchTunes jukebox. Sleek LED touchscreen, mounts on wall.",
    "Need a license?": "We handle ALL licenses. This is turnkey—we buy, stock, maintain. Zero cost to you.",
    "What's the split?": "I can't do 50% like ATM guys (real costs), but 15-25%, plus you keep customers IN the bar."
  },
  closeAttempt: `When do you usually come around? I'd love to swing by and show you how it looks in AR.`
};

// Scoring methodology reference
export const scoringMethodology = {
  hoursScore: {
    description: "Based on closing time (2AM bars = highest likelihood of vape sales)",
    values: { "2AM": 10, "Midnight": 7, "Earlier": 5 }
  },
  trafficScore: {
    description: "Google reviews as proxy for foot traffic (more reviews = more customers)",
    values: { "1500+": 10, "1000-1500": 9, "500-1000": 7, "200-500": 5, "<200": 4 }
  },
  demoScore: {
    description: "Demographic fit for vape/nicotine products",
    values: { "College/Nightclub": 10, "Sports Bar": 9, "Dive Bar": 8, "Upscale/Cocktail": 7 }
  },
  priorityCalculation: "A+ = 27+ total | A = 24-26 | B = 20-23 | C = <20"
};

// Machine status options
export const machineStatusOptions = [
  { value: 'planned', label: 'Planned', color: 'bg-gray-500', textColor: 'text-gray-400' },
  { value: 'ordered', label: 'Ordered', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  { value: 'installed', label: 'Installed', color: 'bg-blue-500', textColor: 'text-blue-400' },
  { value: 'active', label: 'Active', color: 'bg-green-500', textColor: 'text-green-400' },
  { value: 'underperforming', label: 'Under Review', color: 'bg-orange-500', textColor: 'text-orange-400' },
  { value: 'relocating', label: 'Relocating', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-red-500', textColor: 'text-red-400' },
];

// Performance health calculation
export const calculatePerformanceHealth = (machine, projectedMonthly) => {
  if (!machine.actualRevenue || machine.actualRevenue.length === 0) return { status: 'no_data', label: 'No Data', color: 'text-gray-400' };
  
  const recentMonths = machine.actualRevenue.slice(-3); // Last 3 months
  const avgActual = recentMonths.reduce((s, r) => s + r.amount, 0) / recentMonths.length;
  const ratio = avgActual / projectedMonthly;
  
  if (ratio >= 0.9) return { status: 'on_track', label: '🟢 On Track', color: 'text-green-400', ratio };
  if (ratio >= 0.7) return { status: 'below_target', label: '🟡 Below Target', color: 'text-yellow-400', ratio };
  return { status: 'at_risk', label: '🔴 At Risk', color: 'text-red-400', ratio };
};

// Trial period tracking
export const calculateTrialStatus = (machine, trialDays = 90) => {
  if (!machine.installDate) return null;
  const installed = new Date(machine.installDate);
  const now = new Date();
  const daysPassed = Math.floor((now - installed) / (1000 * 60 * 60 * 24));
  const daysRemaining = trialDays - daysPassed;
  
  return {
    daysPassed,
    daysRemaining: Math.max(0, daysRemaining),
    isInTrial: daysRemaining > 0,
    trialComplete: daysRemaining <= 0,
    percentComplete: Math.min(100, Math.round((daysPassed / trialDays) * 100))
  };
};

// Default inventory template for new machines - with slot positions and configurable thresholds
export const defaultInventoryTemplate = [
  { productId: 1, name: "Geek Bar Pulse 15000", slot: "A1", capacity: 20, current: 0, alertThreshold: 5, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 2, name: "RAZ TN9000", slot: "A2", capacity: 20, current: 0, alertThreshold: 5, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 3, name: "Lost Mary MO5000", slot: "A3", capacity: 15, current: 0, alertThreshold: 4, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 4, name: "Elf Bar BC5000", slot: "A4", capacity: 15, current: 0, alertThreshold: 4, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 5, name: "Zyn 6mg", slot: "B1", capacity: 20, current: 0, alertThreshold: 5, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 6, name: "Zyn 3mg", slot: "B2", capacity: 15, current: 0, alertThreshold: 4, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 8, name: "USB-C Charger", slot: "C1", capacity: 10, current: 0, alertThreshold: 3, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
  { productId: 11, name: "Advil 2-pack", slot: "C2", capacity: 10, current: 0, alertThreshold: 3, lastRestock: null, weeklyVelocity: 0, unitsSold: 0 },
];

// Helper to create a new machine object
export const createMachine = (machineType = 'slim-tower-2', index = 1) => ({
  id: `machine-${Date.now()}-${index}`,
  type: machineType,
  serialNumber: '',
  status: 'planned',
  installDate: '',
  placementNote: '', // e.g., "Near bathrooms", "Front entrance"
  inventory: defaultInventoryTemplate.map(item => ({ ...item })),
  restockHistory: [],
  // Operations tracking
  nextRestockDate: '',
  restockFrequency: 7, // days between restocks (auto-calculated over time)
  actualRevenue: [], // [{month: '2026-02', amount: 1234}, ...]
  totalRevenue: 0,
  notes: '',
});

// Route optimization helpers
export const calculateRestockPriority = (machine) => {
  if (!machine.inventory) return 0;
  const lowItems = machine.inventory.filter(inv => inv.current > 0 && inv.current <= inv.alertThreshold).length;
  const emptyItems = machine.inventory.filter(inv => inv.current === 0).length;
  return (emptyItems * 10) + (lowItems * 3); // Higher = more urgent
};

export const sortByRestockUrgency = (machines) => {
  return [...machines].sort((a, b) => calculateRestockPriority(b) - calculateRestockPriority(a));
};
