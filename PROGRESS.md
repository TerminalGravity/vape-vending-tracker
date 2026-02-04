# VapeVend Pro - Progress

## Current State (2026-02-04 01:05 UTC)
Fully functional prospect tracker + CRM + inventory management system.

## Features Implemented

### Core CRM
- [x] 39 Arizona bar prospects with scoring (Hours/Traffic/Demo)
- [x] Deal pipeline: Not Contacted → Contacted → Meeting → Negotiating → Won/Lost
- [x] Pipeline board (Kanban view)
- [x] Prospect detail pages with quick actions (Call, Website, Map)
- [x] Contact tracking (owner name, dates, notes)
- [x] Search + filter by area, status, priority

### Multi-Machine Support (v2)
- [x] Multiple machines per location
- [x] Machine status: Planned → Ordered → Installed → Active → Maintenance
- [x] Machine config: type, serial #, install date, placement note
- [x] Add/remove machines from any location

### Inventory Management (v2.1 - VapeTM-inspired)
- [x] Per-machine inventory tracking
- [x] Slot positions (A1, A2, B1, etc.) for each product
- [x] Configurable alert thresholds per product
- [x] Low stock warnings (⚠️) and empty alerts (🚨)
- [x] Quick restock buttons + full restock
- [x] Stock percentage progress bars
- [x] Restock history tracking

### Operations (v2.1)
- [x] Next restock date scheduling
- [x] Restock frequency tracking (days between visits)
- [x] Actual revenue tracking per machine per month
- [x] Total revenue accumulation
- [x] Actual vs Projected performance comparison
- [x] Restock urgency scoring (empty=10pts, low=3pts)

### Route Planner (v2.1)
- [x] 🚗 Route tab showing active machines by urgency
- [x] Summary cards (active machines, needs restock, scheduled today, total revenue)
- [x] Machines sorted by restock urgency
- [x] Visual urgency indicators (🔴 HIGH, 🟡 MED, 🟢 OK)
- [x] Quick links to Maps and prospect details
- [x] Overdue/Today schedule badges

### Calculators
- [x] What-If scenario builder (machines, revenue, COGS, split)
- [x] Pipeline P/L table with per-location breakdown
- [x] Cost breakdown (startup + monthly recurring)
- [x] Product margins table with supplier links

### UI
- [x] Dark theme
- [x] Mobile responsive
- [x] Call scripts modal
- [x] Quick call list
- [x] VapeTM machine catalog
- [x] Accessories list

## Tech Stack
- Next.js 14 + React
- Tailwind CSS
- localStorage persistence
- PM2 process manager
- Tailscale Serve/Funnel (public access)

## URL
https://srv1325349.tail657eaf.ts.net

## Data Flow
```
Prospect (location) 
  └─ machines[] (1 or more per location)
       └─ inventory[] (products with slots, stock, thresholds)
       └─ actualRevenue[] (monthly revenue entries)
       └─ restockHistory[] (restock logs)
```

## Next Ideas
- [ ] Google Maps integration for route optimization
- [ ] VapeTM API integration (if available) for live data
- [ ] Push notifications for low stock
- [ ] Export route as shareable link
- [ ] Photo documentation per location
