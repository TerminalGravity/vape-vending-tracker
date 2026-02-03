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

// Arizona Prospects
export const initialProspects = [
  { id: 1, name: "Fat Tuesday", address: "680 S Mill Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.2, reviews: 1378, phone: "(480) 967-3917", website: "fattuesdayaz.com", estMonthly: 1800, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 2, name: "Yucca Tap Room", address: "29 W Southern Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.5, reviews: 1711, phone: "(480) 967-4777", website: "yuccatap.com", estMonthly: 1700, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 3, name: "Pedal Haus Brewery", address: "730 S Mill Ave #102", city: "Tempe", area: "ASU/Tempe", rating: 4.5, reviews: 1934, phone: "(480) 314-2337", website: "pedalhausbrewery.com", estMonthly: 1650, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 4, name: "Mill's Modern Social", address: "83 E Broadway Rd", city: "Tempe", area: "ASU/Tempe", rating: 4.3, reviews: 1667, phone: "(602) 689-5361", website: "millsmodernsocial.com", estMonthly: 1650, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 5, name: "Pattie's First Avenue", address: "7220 E 1st Ave", city: "Scottsdale", area: "Old Town", rating: 4.3, reviews: 1763, phone: "(480) 990-0103", website: "pattiesfirstavenuelounge.cfd", estMonthly: 1600, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 6, name: "Dierks Whiskey Row", address: "4420 N Saddlebag Trail", city: "Scottsdale", area: "Old Town", rating: 3.8, reviews: 1468, phone: "(480) 945-4200", website: "dierkswhiskeyrow.com", estMonthly: 1600, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 7, name: "Boondocks Scottsdale", address: "4341 N 75th St", city: "Scottsdale", area: "Old Town", rating: 4.3, reviews: 1750, phone: "(480) 949-8454", website: "boondocksaz.com", estMonthly: 1550, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 8, name: "Collins Irish Pub", address: "2 N Leroux St", city: "Flagstaff", area: "Flagstaff", rating: 4.0, reviews: 2184, phone: "(928) 214-7363", website: "collinsirishpub.com", estMonthly: 1500, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 9, name: "Rusty Spur Saloon", address: "7245 E Main St", city: "Scottsdale", area: "Old Town", rating: 4.5, reviews: 1647, phone: "(480) 425-7787", website: "rustyspursaloon.com", estMonthly: 1500, priority: "A+", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 10, name: "Low Key Piano Bar", address: "501 S Mill Ave", city: "Tempe", area: "ASU/Tempe", rating: 4.2, reviews: 1127, phone: "(480) 355-1705", website: "lowkeypianobar.com", estMonthly: 1450, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 11, name: "BJ's Cabana Bar", address: "2122 McCulloch Blvd N", city: "Lake Havasu", area: "Lake Havasu", rating: 4.2, reviews: 982, phone: "(928) 854-2122", website: "bjscabanabar.com", estMonthly: 1350, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
  { id: 12, name: "Flying X Saloon", address: "2030 McCulloch Blvd N", city: "Lake Havasu", area: "Lake Havasu", rating: 4.5, reviews: 797, phone: "(928) 854-3599", website: "flyingxsaloon.com", estMonthly: 1200, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 13, name: "McKee's Pub & Grill", address: "2112 McCulloch Blvd N", city: "Lake Havasu", area: "Lake Havasu", rating: 4.4, reviews: 711, phone: "(928) 453-8400", website: "mckeespubgrill.shop", estMonthly: 1150, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "mini-wall", barSplit: 20 },
  { id: 14, name: "Wasted Grain", address: "7295 E Stetson Dr", city: "Scottsdale", area: "Old Town", rating: 4.3, reviews: 1324, phone: "(480) 970-0500", website: "wastedgrain.com", estMonthly: 1400, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-tower-2", barSplit: 20 },
  { id: 15, name: "Old Town Tavern", address: "7330 E Main St", city: "Scottsdale", area: "Old Town", rating: 4.5, reviews: 1188, phone: "(480) 306-7320", website: "oldtowntavernaz.com", estMonthly: 1350, priority: "A", ownerName: "", contactDate: "", nextAction: "", notes: "", status: "not_contacted", machineType: "slim-wall", barSplit: 20 },
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
