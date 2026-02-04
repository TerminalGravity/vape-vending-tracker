'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Kanban, Truck, DollarSign, Calculator, Package, 
  Phone, FileText, MapPin, Globe, ChevronRight, Plus, Trash2, RefreshCw,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Target, Share2, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  initialProspects, statusOptions, callScript, productCatalog, vapeTmMachines, 
  accessories, machineStatusOptions, createMachine, calculateRestockPriority,
  calculatePerformanceHealth, calculateTrialStatus 
} from '@/lib/data';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Package className="h-8 w-8 animate-pulse" /></div>}>
      <VapeVendPro />
    </Suspense>
  );
}

function VapeVendPro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [prospects, setProspects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Read URL params on load
  useEffect(() => {
    const tab = searchParams.get('tab');
    const id = searchParams.get('id');
    if (tab) setActiveTab(tab);
    if (id) setSelectedId(Number(id));
  }, [searchParams]);

  // Update URL when tab/selection changes
  const updateURL = useCallback((tab, id = null) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (id) params.set('id', id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedId(null);
    updateURL(tab);
  };

  const handleSelectProspect = (id) => {
    setSelectedId(id);
    updateURL('prospects', id);
  };

  const handleBackToList = () => {
    setSelectedId(null);
    updateURL('prospects');
  };

  // Generate shareable link
  const getShareableLink = (tab, id = null) => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (id) params.set('id', id.toString());
    return `${base}?${params.toString()}`;
  };

  const copyLink = async (tab, id = null) => {
    const link = getShareableLink(tab, id);
    await navigator.clipboard.writeText(link);
    alert('Link copied!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('vapeProspects2');
    if (saved) setProspects(JSON.parse(saved));
    else setProspects(initialProspects);
  }, []);

  useEffect(() => {
    if (prospects.length) localStorage.setItem('vapeProspects2', JSON.stringify(prospects));
  }, [prospects]);

  const updateProspect = (id, updates) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const getMachine = (id) => vapeTmMachines.find(m => m.id === id) || vapeTmMachines[5];
  
  const getProspectMachines = (prospect) => {
    if (prospect.machines && prospect.machines.length > 0) return prospect.machines;
    return [createMachine(prospect.machineType || 'slim-tower-2', 1)];
  };

  const addMachine = (prospectId, machineType = 'slim-tower-2') => {
    setProspects(prev => prev.map(p => {
      if (p.id !== prospectId) return p;
      const machines = getProspectMachines(p);
      return { ...p, machines: [...machines, createMachine(machineType, machines.length + 1)] };
    }));
  };

  const removeMachine = (prospectId, machineId) => {
    setProspects(prev => prev.map(p => {
      if (p.id !== prospectId) return p;
      const machines = (p.machines || []).filter(m => m.id !== machineId);
      return { ...p, machines };
    }));
  };

  const updateMachine = (prospectId, machineId, updates) => {
    setProspects(prev => prev.map(p => {
      if (p.id !== prospectId) return p;
      const machines = (p.machines || []).map(m => m.id === machineId ? { ...m, ...updates } : m);
      return { ...p, machines };
    }));
  };

  const updateInventory = (prospectId, machineId, productId, updates) => {
    setProspects(prev => prev.map(p => {
      if (p.id !== prospectId) return p;
      const machines = (p.machines || []).map(m => {
        if (m.id !== machineId) return m;
        const inventory = m.inventory.map(inv => inv.productId === productId ? { ...inv, ...updates } : inv);
        return { ...m, inventory };
      });
      return { ...p, machines };
    }));
  };

  const restockAll = (prospectId, machineId) => {
    const today = new Date().toISOString().split('T')[0];
    setProspects(prev => prev.map(p => {
      if (p.id !== prospectId) return p;
      const machines = (p.machines || []).map(m => {
        if (m.id !== machineId) return m;
        const inventory = m.inventory.map(inv => ({ ...inv, current: inv.capacity, lastRestock: today }));
        const restockHistory = [...(m.restockHistory || []), { date: today, type: 'full', items: inventory.length }];
        return { ...m, inventory, restockHistory };
      });
      return { ...p, machines };
    }));
  };

  const calcROI = (p) => {
    const machines = getProspectMachines(p);
    const machinesCost = machines.reduce((sum, m) => sum + getMachine(m.type).price, 0);
    const startup = machinesCost + (650 * machines.length) + (500 * machines.length);
    const monthlyNet = p.estMonthly * 0.4 * (1 - p.barSplit/100);
    const payback = monthlyNet > 0 ? startup / monthlyNet : 0;
    return { startup, monthlyNet, payback, annual: monthlyNet * 12, machineCount: machines.length };
  };

  const stats = {
    total: prospects.length,
    pipeline: prospects.reduce((s, p) => s + p.estMonthly, 0),
    active: prospects.filter(p => ['contacted','meeting','negotiating'].includes(p.status)).length,
    won: prospects.filter(p => p.status === 'won').length,
    wonRevenue: prospects.filter(p => p.status === 'won').reduce((s, p) => s + calcROI(p).monthlyNet, 0),
  };

  const areas = [...new Set(prospects.map(p => p.area))];
  const filtered = prospects.filter(p => {
    if (filterArea !== 'all' && p.area !== filterArea) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedProspect = prospects.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold">VapeVend Pro</h1>
              <p className="text-xs text-muted-foreground">Arizona Operations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-1" /> Quick Call</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Quick Call List</DialogTitle>
                  <DialogDescription>Top prospects ready to call</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {prospects.filter(p => p.status === 'not_contacted').slice(0,8).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.city}</p>
                      </div>
                      <Button size="sm" variant="success" asChild>
                        <a href={`tel:${p.phone}`}><Phone className="h-3 w-3 mr-1" />{p.phone}</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Scripts</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Call Scripts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-green-400">Opening</CardTitle></CardHeader><CardContent><p className="text-sm italic">"{callScript.opening}"</p></CardContent></Card>
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-blue-400">Value Props</CardTitle></CardHeader><CardContent><ul className="text-sm space-y-1">{callScript.valueProps.map((v,i) => <li key={i}>• {v}</li>)}</ul></CardContent></Card>
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-400">Objections</CardTitle></CardHeader><CardContent>{Object.entries(callScript.objections).map(([q,a]) => <div key={q} className="mb-2 text-sm"><p className="text-red-400">"{q}"</p><p className="ml-2 text-muted-foreground">→ {a}</p></div>)}</CardContent></Card>
                  <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-purple-400">Close</CardTitle></CardHeader><CardContent><p className="text-sm italic">"{callScript.closeAttempt}"</p></CardContent></Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="container px-4 py-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4">
          <TabsTrigger value="dashboard" className="text-xs"><LayoutDashboard className="h-4 w-4 mr-1 hidden sm:inline" />Dashboard</TabsTrigger>
          <TabsTrigger value="prospects" className="text-xs"><Users className="h-4 w-4 mr-1 hidden sm:inline" />Prospects</TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs"><Kanban className="h-4 w-4 mr-1 hidden sm:inline" />Pipeline</TabsTrigger>
          <TabsTrigger value="route" className="text-xs"><Truck className="h-4 w-4 mr-1 hidden sm:inline" />Route</TabsTrigger>
          <TabsTrigger value="startup" className="text-xs"><DollarSign className="h-4 w-4 mr-1 hidden sm:inline" />Startup</TabsTrigger>
          <TabsTrigger value="calculator" className="text-xs"><Calculator className="h-4 w-4 mr-1 hidden sm:inline" />Calculator</TabsTrigger>
          <TabsTrigger value="machines" className="text-xs"><Package className="h-4 w-4 mr-1 hidden sm:inline" />Machines</TabsTrigger>
        </TabsList>

        {/* DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Pipeline Value" value={`$${stats.pipeline.toLocaleString()}/mo`} icon={TrendingUp} trend="+12%" />
            <StatCard title="Active Deals" value={stats.active} icon={Target} />
            <StatCard title="Won Deals" value={stats.won} icon={CheckCircle2} variant="success" />
            <StatCard title="Won Revenue" value={`$${stats.wonRevenue.toLocaleString()}/mo`} icon={DollarSign} variant="success" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">🎯 Top Prospects</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {prospects.filter(p => p.status !== 'won' && p.status !== 'lost').sort((a,b) => b.estMonthly - a.estMonthly).slice(0,5).map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.area}</p></div>
                    <Badge variant="success">${p.estMonthly}/mo</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">📍 By Area</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {areas.map(area => {
                  const areaProspects = prospects.filter(p => p.area === area);
                  const total = areaProspects.reduce((s,p) => s + p.estMonthly, 0);
                  return (
                    <div key={area} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div><p className="font-medium">{area}</p><p className="text-xs text-muted-foreground">{areaProspects.length} prospects</p></div>
                      <Badge variant="info">${total.toLocaleString()}/mo</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PROSPECTS */}
        <TabsContent value="prospects" className="space-y-4">
          {!selectedId ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-48" />
                <Select value={filterArea} onValueChange={setFilterArea}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Area" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">{filtered.length} prospects</p>
              <div className="grid gap-3">
                {filtered.map(p => (
                  <Card key={p.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelectProspect(p.id)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{p.name}</h3>
                            <Badge variant={p.priority === 'A+' ? 'success' : p.priority === 'A' ? 'info' : 'muted'}>{p.priority}</Badge>
                            <Badge variant={p.status === 'won' ? 'success' : p.status === 'lost' ? 'destructive' : 'secondary'}>
                              {statusOptions.find(s=>s.value===p.status)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{p.city} • {p.area}</p>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span>🕐 {p.hoursScore}/10</span>
                            <span>👥 {p.trafficScore}/10</span>
                            <span>🎯 {p.demoScore}/10</span>
                            <span>⭐ {p.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">${p.estMonthly?.toLocaleString()}/mo</p>
                          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : selectedProspect && (
            <ProspectDetail 
              prospect={selectedProspect}
              onBack={handleBackToList}
              onUpdate={(updates) => updateProspect(selectedId, updates)}
              onCopyLink={() => copyLink('prospects', selectedId)}
              getMachine={getMachine}
              getProspectMachines={getProspectMachines}
              addMachine={addMachine}
              removeMachine={removeMachine}
              updateMachine={updateMachine}
              updateInventory={updateInventory}
              restockAll={restockAll}
              calcROI={calcROI}
            />
          )}
        </TabsContent>

        {/* PIPELINE */}
        <TabsContent value="pipeline">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statusOptions.filter(s => s.value !== 'lost').map(status => {
              const statusProspects = prospects.filter(p => p.status === status.value);
              return (
                <Card key={status.value} className="min-h-[200px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{status.label}</CardTitle>
                    <CardDescription>{statusProspects.length} • ${statusProspects.reduce((s,p) => s + p.estMonthly, 0).toLocaleString()}/mo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {statusProspects.slice(0,5).map(p => (
                      <div key={p.id} onClick={() => handleSelectProspect(p.id)} className="p-2 rounded bg-secondary cursor-pointer hover:bg-secondary/80 text-xs">
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-green-400">${p.estMonthly}/mo</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ROUTE */}
        <TabsContent value="route">
          <RouteTab prospects={prospects} getMachine={getMachine} onSelectProspect={handleSelectProspect} />
        </TabsContent>

        {/* STARTUP */}
        <TabsContent value="startup">
          <StartupTab />
        </TabsContent>

        {/* CALCULATOR */}
        <TabsContent value="calculator">
          <CalculatorTab prospects={prospects} calcROI={calcROI} getMachine={getMachine} />
        </TabsContent>

        {/* MACHINES */}
        <TabsContent value="machines">
          <MachinesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, variant }) {
  return (
    <Card className={variant === 'success' ? 'border-green-700' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", variant === 'success' ? 'text-green-400' : 'text-muted-foreground')} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-green-400">{trend} from last month</p>}
      </CardContent>
    </Card>
  );
}

// Prospect Detail Component
function ProspectDetail({ prospect, onBack, onUpdate, onCopyLink, getMachine, getProspectMachines, addMachine, removeMachine, updateMachine, updateInventory, restockAll, calcROI }) {
  const machines = getProspectMachines(prospect);
  const roi = calcROI(prospect);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} size="sm">← Back to list</Button>
        <Button variant="outline" size="sm" onClick={onCopyLink}><Link2 className="h-3 w-3 mr-1" />Copy Link</Button>
      </div>
      
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{prospect.name}</CardTitle>
              <CardDescription>{prospect.address}, {prospect.city}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">{prospect.area} • ⭐ {prospect.rating} ({prospect.reviews} reviews)</p>
            </div>
            <Badge variant={prospect.status === 'won' ? 'success' : 'secondary'}>
              {statusOptions.find(s=>s.value===prospect.status)?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" variant="success" asChild><a href={`tel:${prospect.phone}`}><Phone className="h-3 w-3 mr-1" />Call</a></Button>
            <Button size="sm" variant="outline" asChild><a href={`https://${prospect.website}`} target="_blank"><Globe className="h-3 w-3 mr-1" />Website</a></Button>
            <Button size="sm" variant="outline" asChild><a href={`https://maps.google.com/?q=${encodeURIComponent(prospect.address + ' ' + prospect.city)}`} target="_blank"><MapPin className="h-3 w-3 mr-1" />Map</a></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Deal Info</h4>
              <Select value={prospect.status} onValueChange={v => onUpdate({status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
              <div>
                <label className="text-xs text-muted-foreground">Bar Split: {prospect.barSplit}%</label>
                <Slider value={[prospect.barSplit]} onValueChange={([v]) => onUpdate({barSplit: v})} max={50} step={5} className="mt-2" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Est. Monthly Revenue</label>
                <Input type="number" value={prospect.estMonthly} onChange={e => onUpdate({estMonthly: Number(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Contact Info</h4>
              <Input placeholder="Owner Name" value={prospect.ownerName || ''} onChange={e => onUpdate({ownerName: e.target.value})} />
              <Input type="date" value={prospect.contactDate || ''} onChange={e => onUpdate({contactDate: e.target.value})} />
              <Input placeholder="Next Action" value={prospect.nextAction || ''} onChange={e => onUpdate({nextAction: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines */}
      <Card className="border-blue-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base text-blue-400">🎰 Machines ({machines.length})</CardTitle>
            <Button size="sm" onClick={() => addMachine(prospect.id)}><Plus className="h-3 w-3 mr-1" />Add Machine</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {machines.map((machine, idx) => (
            <MachineCard 
              key={machine.id}
              machine={machine}
              index={idx}
              prospect={prospect}
              getMachine={getMachine}
              updateMachine={(updates) => updateMachine(prospect.id, machine.id, updates)}
              updateInventory={(productId, updates) => updateInventory(prospect.id, machine.id, productId, updates)}
              restockAll={() => restockAll(prospect.id, machine.id)}
              onRemove={machines.length > 1 ? () => removeMachine(prospect.id, machine.id) : null}
            />
          ))}
        </CardContent>
      </Card>

      {/* ROI */}
      <Card className="border-green-700">
        <CardHeader><CardTitle className="text-base text-green-400">📊 Deal ROI</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div><p className="text-xs text-muted-foreground">Machines</p><p className="text-xl font-bold">{roi.machineCount}</p></div>
            <div><p className="text-xs text-muted-foreground">Startup</p><p className="text-xl font-bold">${roi.startup.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Net/mo</p><p className="text-xl font-bold text-green-400">${roi.monthlyNet.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Payback</p><p className="text-xl font-bold text-yellow-400">{roi.payback.toFixed(1)} mo</p></div>
            <div><p className="text-xs text-muted-foreground">Annual</p><p className="text-xl font-bold text-green-400">${roi.annual.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Machine Card Component
function MachineCard({ machine, index, prospect, getMachine, updateMachine, updateInventory, restockAll, onRemove }) {
  const machineInfo = getMachine(machine.type);
  const lowStock = machine.inventory?.filter(inv => inv.current > 0 && inv.current <= (inv.alertThreshold || 5)) || [];
  const emptyStock = machine.inventory?.filter(inv => inv.current === 0) || [];
  const totalStock = machine.inventory?.reduce((sum, inv) => sum + inv.current, 0) || 0;
  const totalCapacity = machine.inventory?.reduce((sum, inv) => sum + inv.capacity, 0) || 0;
  const stockPercent = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Machine #{index + 1}</span>
            <Badge variant={machine.status === 'active' ? 'success' : 'secondary'}>
              {machineStatusOptions.find(s => s.value === machine.status)?.label}
            </Badge>
            {lowStock.length > 0 && <Badge variant="warning">⚠️ {lowStock.length} Low</Badge>}
            {emptyStock.length > 0 && <Badge variant="destructive">🚨 {emptyStock.length} Empty</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{machineInfo.name} • {machineInfo.slots} slots</p>
        </div>
        <div className="flex gap-2">
          <Button size="xs" variant="success" onClick={restockAll}><RefreshCw className="h-3 w-3 mr-1" />Full Restock</Button>
          {onRemove && <Button size="xs" variant="destructive" onClick={onRemove}><Trash2 className="h-3 w-3" /></Button>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <Select value={machine.type} onValueChange={v => updateMachine({type: v})}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{vapeTmMachines.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={machine.status} onValueChange={v => updateMachine({status: v})}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{machineStatusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
        <Input className="h-8 text-xs" placeholder="Serial #" value={machine.serialNumber || ''} onChange={e => updateMachine({serialNumber: e.target.value})} />
        <Input className="h-8 text-xs" type="date" value={machine.installDate || ''} onChange={e => updateMachine({installDate: e.target.value})} />
      </div>

      {/* Inventory */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">📦 Inventory</span>
          <div className="flex items-center gap-2">
            <Progress value={stockPercent} className="w-20 h-2" indicatorClassName={stockPercent > 50 ? 'bg-green-500' : stockPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'} />
            <span className="text-xs text-muted-foreground">{stockPercent}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {machine.inventory?.map(inv => {
            const isLow = inv.current > 0 && inv.current <= (inv.alertThreshold || 5);
            const isEmpty = inv.current === 0;
            return (
              <div key={inv.productId} className={cn("flex items-center justify-between p-2 rounded text-xs", isEmpty ? "bg-red-950/50" : isLow ? "bg-yellow-950/50" : "bg-background")}>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-5">{inv.slot}</span>
                  <span className="truncate">{inv.name}</span>
                  {isEmpty && <AlertTriangle className="h-3 w-3 text-red-400" />}
                  {isLow && !isEmpty && <AlertTriangle className="h-3 w-3 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-1">
                  <span className={isEmpty ? "text-red-400" : isLow ? "text-yellow-400" : "text-green-400"}>{inv.current}/{inv.capacity}</span>
                  <Input type="number" className="h-6 w-12 text-xs text-center" min="0" max={inv.capacity} value={inv.current} onChange={e => updateInventory(inv.productId, {current: Number(e.target.value)})} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Route Tab
function RouteTab({ prospects, getMachine, onSelectProspect }) {
  const activeMachines = prospects
    .filter(p => p.status === 'won' && p.machines?.some(m => ['active', 'installed', 'underperforming'].includes(m.status)))
    .flatMap(p => {
      const machineCount = (p.machines || []).filter(m => ['active', 'installed', 'underperforming'].includes(m.status)).length;
      const projectedPerMachine = p.estMonthly / Math.max(1, machineCount);
      return (p.machines || [])
        .filter(m => ['active', 'installed', 'underperforming'].includes(m.status))
        .map(m => ({ ...m, prospect: p, urgency: calculateRestockPriority(m), health: calculatePerformanceHealth(m, projectedPerMachine), trial: calculateTrialStatus(m) }));
    })
    .sort((a, b) => b.urgency - a.urgency);

  const needsRestock = activeMachines.filter(m => m.urgency > 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const atRisk = activeMachines.filter(m => m.health?.status === 'at_risk');

  if (activeMachines.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No active machines yet.</p>
        <p className="text-sm text-muted-foreground">Win some deals and set machines to "Active" to see your route!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active Machines" value={activeMachines.length} icon={Package} />
        <StatCard title="Needs Restock" value={needsRestock.length} icon={AlertTriangle} variant={needsRestock.length > 0 ? 'warning' : undefined} />
        <StatCard title="At Risk" value={atRisk.length} icon={TrendingDown} variant={atRisk.length > 0 ? 'destructive' : undefined} />
        <StatCard title="Total Revenue" value={`$${activeMachines.reduce((s, m) => s + (m.totalRevenue || 0), 0).toLocaleString()}`} icon={DollarSign} variant="success" />
      </div>
      <div className="space-y-2">
        {activeMachines.map((m, idx) => {
          const lowItems = m.inventory?.filter(inv => inv.current > 0 && inv.current <= (inv.alertThreshold || 5)) || [];
          const emptyItems = m.inventory?.filter(inv => inv.current === 0) || [];
          return (
            <Card key={m.id} className={m.urgency > 20 ? 'border-red-700 bg-red-950/20' : m.urgency > 10 ? 'border-yellow-700 bg-yellow-950/20' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                    <div>
                      <h3 className="font-semibold">{m.prospect.name}</h3>
                      <p className="text-sm text-muted-foreground">{m.prospect.address}, {m.prospect.city}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {emptyItems.length > 0 && <Badge variant="destructive">🚨 {emptyItems.length} empty</Badge>}
                        {lowItems.length > 0 && <Badge variant="warning">⚠️ {lowItems.length} low</Badge>}
                        {m.health?.status === 'at_risk' && <Badge variant="destructive">At Risk</Badge>}
                        {m.trial?.isInTrial && <Badge variant="info">Trial {m.trial.daysRemaining}d</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={m.urgency > 20 ? 'destructive' : m.urgency > 10 ? 'warning' : 'success'}>
                      {m.urgency > 20 ? '🔴 HIGH' : m.urgency > 10 ? '🟡 MED' : '🟢 OK'}
                    </Badge>
                    <div className="flex gap-1 mt-2">
                      <Button size="xs" variant="outline" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(m.prospect.address + ' ' + m.prospect.city)}`} target="_blank"><MapPin className="h-3 w-3" /></a>
                      </Button>
                      <Button size="xs" onClick={() => onSelectProspect(m.prospect.id)}>View</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Startup Tab
function StartupTab() {
  const [capital, setCapital] = useState(7000);
  const [checklist, setChecklist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('startupChecklist');
      if (saved) return JSON.parse(saved);
    }
    return { ein: false, tpt: false, bank: false, capital: false, location: false, vtmCall: false, insurance: false, firstMachine: false };
  });

  useEffect(() => {
    localStorage.setItem('startupChecklist', JSON.stringify(checklist));
  }, [checklist]);

  // Per-machine costs breakdown
  const machineCost = 5000;
  const idScanner = 300;
  const cardReader = 350;
  const initialInventory = 500;
  const signAndLicense = 162;
  const costPerMachine = machineCost + idScanner + cardReader + initialInventory + signAndLicense; // $6,312

  // Monthly revenue model (per machine)
  const grossRevenue = 1200;
  const cogsPercent = 30;
  const cogsAmount = grossRevenue * (cogsPercent / 100); // $360
  const grossProfit = grossRevenue - cogsAmount; // $840
  const barSplitPercent = 20;
  const barSplitAmount = grossProfit * (barSplitPercent / 100); // $168
  const cardProcessing = grossRevenue * 0.03; // $36
  const operatingCosts = 76; // telemetry $25 + gas $30 + insurance $21
  const netPerMachine = grossProfit - barSplitAmount - cardProcessing - operatingCosts; // ~$400

  // Calculations based on capital
  const machineCount = Math.floor(capital / costPerMachine);
  const leftoverCapital = capital - (machineCount * costPerMachine);
  const monthlyNet = machineCount * netPerMachine;
  const paybackMonths = monthlyNet > 0 ? capital / monthlyNet : 0;
  const yearOneProfit = monthlyNet * 12;

  const checklistItems = [
    { key: 'ein', label: 'Get EIN from IRS', desc: 'Free, online, instant' },
    { key: 'tpt', label: 'AZ TPT License', desc: '$12' },
    { key: 'bank', label: 'Business bank account', desc: 'Keep separate' },
    { key: 'capital', label: 'Secure $7K+ capital', desc: 'Savings or credit' },
    { key: 'vtmCall', label: 'Call VapeTM', desc: 'Pricing & lead times' },
    { key: 'location', label: 'First location committed', desc: 'Verbal agreement' },
    { key: 'insurance', label: 'Get insurance quote', desc: 'General liability' },
    { key: 'firstMachine', label: 'Order first machine', desc: '🎉 In business!' },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>🧮 Capital Calculator</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Capital Input */}
            <div>
              <label className="text-sm text-muted-foreground">Available Capital: ${capital.toLocaleString()}</label>
              <Slider value={[capital]} onValueChange={([v]) => setCapital(v)} min={5000} max={50000} step={1000} className="mt-2" />
              <div className="flex flex-wrap gap-2 mt-3">
                {[7000, 15000, 25000, 35000, 50000].map(amt => (
                  <Button key={amt} size="sm" variant={capital === amt ? 'default' : 'outline'} onClick={() => setCapital(amt)}>${(amt/1000)}K</Button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-blue-950/30 border-blue-700"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Machines</p><p className="text-2xl font-bold text-blue-400">{machineCount}</p></CardContent></Card>
              <Card className="bg-green-950/30 border-green-700"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Net</p><p className="text-2xl font-bold text-green-400">${Math.round(monthlyNet).toLocaleString()}</p></CardContent></Card>
              <Card className="bg-yellow-950/30 border-yellow-700"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Payback</p><p className="text-2xl font-bold text-yellow-400">{paybackMonths.toFixed(1)} mo</p></CardContent></Card>
              <Card className="bg-green-950/30 border-green-700"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Year 1 Profit</p><p className="text-2xl font-bold text-green-400">${Math.round(yearOneProfit).toLocaleString()}</p></CardContent></Card>
            </div>

            {/* Calculation Breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Per Machine Cost */}
              <Card className="bg-secondary/30">
                <CardHeader className="pb-2"><CardTitle className="text-sm">💰 Cost Per Machine</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Slim Tower 2.0</span><span>${machineCost.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ID Scanner</span><span>${idScanner}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Card Reader (Nayax)</span><span>${cardReader}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Initial Inventory</span><span>${initialInventory}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sign + License</span><span>${signAndLicense}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total Per Machine</span><span className="text-yellow-400">${costPerMachine.toLocaleString()}</span></div>
                </CardContent>
              </Card>

              {/* Monthly P/L Per Machine */}
              <Card className="bg-secondary/30">
                <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Monthly P/L (Per Machine)</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Gross Revenue</span><span>${grossRevenue.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-400"><span>COGS ({cogsPercent}%)</span><span>-${cogsAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Gross Profit</span><span>${grossProfit.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-400"><span>Bar Split ({barSplitPercent}%)</span><span>-${barSplitAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-400"><span>Card Processing (3%)</span><span>-${cardProcessing.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-400"><span>Operating Costs</span><span>-${operatingCosts}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Net Profit</span><span className="text-green-400">${Math.round(netPerMachine)}/mo</span></div>
                </CardContent>
              </Card>
            </div>

            {/* Formula Breakdown */}
            <Card className="bg-primary/5 border-primary/30">
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔢 Your Numbers</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2 font-mono">
                <div className="p-2 rounded bg-background">
                  <p className="text-muted-foreground text-xs mb-1">Machines you can afford:</p>
                  <p>${capital.toLocaleString()} ÷ ${costPerMachine.toLocaleString()} = <span className="text-blue-400 font-bold">{machineCount} machines</span></p>
                  {leftoverCapital > 0 && <p className="text-xs text-muted-foreground mt-1">(${leftoverCapital.toLocaleString()} leftover for emergency fund)</p>}
                </div>
                <div className="p-2 rounded bg-background">
                  <p className="text-muted-foreground text-xs mb-1">Monthly net profit:</p>
                  <p>{machineCount} machines × ${Math.round(netPerMachine)}/mo = <span className="text-green-400 font-bold">${Math.round(monthlyNet).toLocaleString()}/mo</span></p>
                </div>
                <div className="p-2 rounded bg-background">
                  <p className="text-muted-foreground text-xs mb-1">Payback period:</p>
                  <p>${capital.toLocaleString()} ÷ ${Math.round(monthlyNet).toLocaleString()}/mo = <span className="text-yellow-400 font-bold">{paybackMonths.toFixed(1)} months</span></p>
                </div>
                <div className="p-2 rounded bg-background">
                  <p className="text-muted-foreground text-xs mb-1">Year 1 profit:</p>
                  <p>${Math.round(monthlyNet).toLocaleString()}/mo × 12 = <span className="text-green-400 font-bold">${Math.round(yearOneProfit).toLocaleString()}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>✅ Startup Checklist</CardTitle>
            <span className="text-sm text-muted-foreground">{completedCount}/{checklistItems.length}</span>
          </div>
          <Progress value={(completedCount / checklistItems.length) * 100} className="h-2" indicatorClassName="bg-green-500" />
        </CardHeader>
        <CardContent className="space-y-2">
          {checklistItems.map(item => (
            <div 
              key={item.key}
              onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              className={cn("flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border", 
                checklist[item.key] ? "bg-green-950/30 border-green-700" : "bg-secondary/50 border-transparent hover:border-muted")}
            >
              <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center", 
                checklist[item.key] ? "bg-green-600 border-green-600" : "border-muted-foreground")}>
                {checklist[item.key] && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className={cn("font-medium", checklist[item.key] && "line-through text-muted-foreground")}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Calculator Tab
function CalculatorTab({ prospects, calcROI, getMachine }) {
  const [machines, setMachines] = useState(5);
  const [revenue, setRevenue] = useState(1200);
  const [cogs, setCogs] = useState(30);
  const [split, setSplit] = useState(20);

  const startup = machines * 6150;
  const gross = machines * revenue;
  const cogsAmt = gross * cogs / 100;
  const profit = gross - cogsAmt;
  const barShare = profit * split / 100;
  const net = profit - barShare - 200;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>🧪 What-If Calculator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm">Machines: {machines}</label><Slider value={[machines]} onValueChange={([v]) => setMachines(v)} min={1} max={20} className="mt-2" /></div>
            <div><label className="text-sm">Revenue/Machine: ${revenue}</label><Slider value={[revenue]} onValueChange={([v]) => setRevenue(v)} min={500} max={2500} step={100} className="mt-2" /></div>
            <div><label className="text-sm">COGS: {cogs}%</label><Slider value={[cogs]} onValueChange={([v]) => setCogs(v)} min={20} max={50} className="mt-2" /></div>
            <div><label className="text-sm">Bar Split: {split}%</label><Slider value={[split]} onValueChange={([v]) => setSplit(v)} min={0} max={50} step={5} className="mt-2" /></div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Startup Cost</p><p className="text-3xl font-bold text-yellow-400">${startup.toLocaleString()}</p></CardContent></Card>
          <Card className="border-green-700">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly P/L</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between"><span>Gross</span><span>${gross.toLocaleString()}</span></div>
              <div className="flex justify-between text-red-400"><span>COGS</span><span>-${cogsAmt.toLocaleString()}</span></div>
              <div className="flex justify-between text-red-400"><span>Bar Split</span><span>-${barShare.toLocaleString()}</span></div>
              <div className="flex justify-between border-t pt-1 font-bold text-green-400"><span>Net</span><span>${net.toLocaleString()}</span></div>
            </CardContent>
          </Card>
          <Card><CardContent className="p-4 grid grid-cols-2 gap-4 text-center">
            <div><p className="text-xs text-muted-foreground">Annual</p><p className="text-xl font-bold text-green-400">${(net*12).toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Payback</p><p className="text-xl font-bold text-yellow-400">{(startup/net).toFixed(1)} mo</p></div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// Machines Tab
function MachinesTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🚬 VapeTM Machine Catalog</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Wall-Mounted</h3>
          {vapeTmMachines.filter(m => m.type === 'wall').map(m => (
            <Card key={m.id} className={cn("mb-2", m.recommended && "border-green-500")}>
              <CardContent className="p-4 flex justify-between">
                <div>
                  <p className="font-semibold">{m.name} {m.recommended && <Badge variant="success">⭐ REC</Badge>}</p>
                  <p className="text-sm text-muted-foreground">{m.slots} slots • {m.description}</p>
                </div>
                <p className="text-green-400 font-bold">${m.price.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Towers</h3>
          {vapeTmMachines.filter(m => m.type === 'tower').map(m => (
            <Card key={m.id} className={cn("mb-2", m.recommended && "border-green-500")}>
              <CardContent className="p-4 flex justify-between">
                <div>
                  <p className="font-semibold">{m.name} {m.recommended && <Badge variant="success">⭐ REC</Badge>}</p>
                  <p className="text-sm text-muted-foreground">{m.slots} slots • {m.description}</p>
                </div>
                <p className="text-green-400 font-bold">${m.price.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <h3 className="font-semibold">Accessories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {accessories.map(a => (
          <Card key={a.id}><CardContent className="p-3"><p className="font-medium">{a.name}</p><p className="text-green-400 font-bold">${a.price}</p>{a.required && <Badge variant="warning" className="mt-1">Required</Badge>}</CardContent></Card>
        ))}
      </div>
    </div>
  );
}
