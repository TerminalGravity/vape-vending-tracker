'use client';
import { useState, useEffect } from 'react';
import { initialProspects, statusOptions, profitSplitGuide, callScript, productCatalog, suppliers, vapeTmMachines, accessories, scoringMethodology } from '../lib/data';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calcTab, setCalcTab] = useState('whatif');
  const [prospects, setProspects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showScripts, setShowScripts] = useState(false);
  const [showQuickCall, setShowQuickCall] = useState(false);
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');

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
  
  const calcROI = (p) => {
    const machine = getMachine(p.machineType);
    const startup = machine.price + 650 + 500; // machine + accessories + inventory
    const monthlyNet = p.estMonthly * 0.4 * (1 - p.barSplit/100);
    const payback = startup / monthlyNet;
    return { startup, monthlyNet, payback, annual: monthlyNet * 12 };
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
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedProspect = prospects.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚬</span>
            <div><h1 className="text-lg font-bold">VapeVend Pro</h1><p className="text-xs text-gray-400">Arizona Operations</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuickCall(true)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm">📞 Quick Call</button>
            <button onClick={() => setShowScripts(true)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm">📜 Scripts</button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 flex gap-1 overflow-x-auto">
        {[{id:'dashboard',label:'📊 Dashboard'},{id:'prospects',label:'📋 Prospects'},{id:'pipeline',label:'📈 Pipeline'},{id:'calculator',label:'🧮 Calculator'},{id:'machines',label:'🚬 Machines'}].map(t => (
          <button key={t.id} onClick={() => {setActiveTab(t.id); setSelectedId(null);}} className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === t.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>{t.label}</button>
        ))}
      </nav>

      {/* Quick Call Modal */}
      {showQuickCall && (
        <Modal onClose={() => setShowQuickCall(false)} title="📞 Quick Call List">
          <div className="space-y-2">
            {prospects.filter(p => p.status === 'not_contacted').slice(0,10).map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-700 rounded p-3">
                <div><p className="font-medium">{p.name}</p><p className="text-sm text-gray-400">{p.city}</p></div>
                <a href={`tel:${p.phone}`} className="px-3 py-1 bg-green-600 rounded text-sm">📞 {p.phone}</a>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Scripts Modal */}
      {showScripts && (
        <Modal onClose={() => setShowScripts(false)} title="📜 Call Scripts">
          <div className="space-y-4 text-sm">
            <div className="bg-gray-700 rounded p-3"><h4 className="text-green-400 font-semibold mb-1">Opening:</h4><p className="text-gray-300 italic">"{callScript.opening}"</p></div>
            <div className="bg-gray-700 rounded p-3"><h4 className="text-blue-400 font-semibold mb-1">Value Props:</h4><ul className="space-y-1">{callScript.valueProps.map((v,i) => <li key={i} className="text-gray-300">• {v}</li>)}</ul></div>
            <div className="bg-gray-700 rounded p-3"><h4 className="text-yellow-400 font-semibold mb-1">Objections:</h4>{Object.entries(callScript.objections).map(([q,a]) => <div key={q} className="mb-2"><p className="text-red-400">"{q}"</p><p className="text-gray-300 ml-2">→ {a}</p></div>)}</div>
            <div className="bg-gray-700 rounded p-3"><h4 className="text-purple-400 font-semibold mb-1">Close:</h4><p className="text-gray-300 italic">"{callScript.closeAttempt}"</p></div>
          </div>
        </Modal>
      )}

      <main className="p-4">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card title="Pipeline Value" value={`$${stats.pipeline.toLocaleString()}/mo`} color="blue" />
              <Card title="Active Deals" value={stats.active} color="yellow" />
              <Card title="Won" value={stats.won} color="green" />
              <Card title="Won Revenue" value={`$${stats.wonRevenue.toLocaleString()}/mo`} color="green" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">🎯 Top 5 Prospects</h3>
                {prospects.filter(p => p.status !== 'won' && p.status !== 'lost').sort((a,b) => b.estMonthly - a.estMonthly).slice(0,5).map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-400">{p.area}</p></div>
                    <span className="text-green-400 font-bold">${p.estMonthly}/mo</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">📍 Pipeline by Area</h3>
                {areas.map(area => {
                  const areaProspects = prospects.filter(p => p.area === area);
                  const total = areaProspects.reduce((s,p) => s + p.estMonthly, 0);
                  return (
                    <div key={area} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                      <div><p className="font-medium">{area}</p><p className="text-xs text-gray-400">{areaProspects.length} prospects</p></div>
                      <span className="text-blue-400 font-bold">${total.toLocaleString()}/mo</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROSPECTS LIST */}
        {activeTab === 'prospects' && !selectedId && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm flex-1 min-w-[150px]" />
              <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm">
                <option value="all">All Areas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm">
                <option value="all">All Status</option>
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm">
                <option value="all">All Priority</option>
                <option value="A+">A+ (Top Tier)</option>
                <option value="A">A (High)</option>
                <option value="B">B (Medium)</option>
                <option value="C">C (Lower)</option>
              </select>
            </div>
            <p className="text-gray-400 text-sm">{filtered.length} prospects</p>
            <div className="space-y-2">
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelectedId(p.id)} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-blue-500 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{p.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.priority === 'A+' ? 'bg-green-600' : p.priority === 'A' ? 'bg-blue-600' : p.priority === 'B' ? 'bg-yellow-600' : 'bg-gray-600'}`}>{p.priority}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${statusOptions.find(s=>s.value===p.status)?.color}`}>{statusOptions.find(s=>s.value===p.status)?.label}</span>
                      </div>
                      <p className="text-sm text-gray-400">{p.city} • {p.area}</p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span title="Hours Score (2AM=10)">🕐 {p.hoursScore || '-'}</span>
                        <span title="Traffic Score (reviews)">👥 {p.trafficScore || '-'}</span>
                        <span title="Demo Score (target demo)">🎯 {p.demoScore || '-'}</span>
                        <span className="text-gray-500">⭐ {p.rating} ({p.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">${p.estMonthly?.toLocaleString()}/mo</p>
                      <p className="text-xs text-gray-500">${p.estAnnual?.toLocaleString()}/yr</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROSPECT DETAIL */}
        {activeTab === 'prospects' && selectedId && selectedProspect && (
          <div className="space-y-4">
            <button onClick={() => setSelectedId(null)} className="text-blue-400 text-sm">← Back to list</button>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedProspect.name}</h2>
                  <p className="text-gray-400">{selectedProspect.address}, {selectedProspect.city}</p>
                  <p className="text-gray-500 text-sm">{selectedProspect.area} • ⭐ {selectedProspect.rating} ({selectedProspect.reviews} reviews)</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="bg-gray-700 rounded px-2 py-1"><span className="text-gray-400">Hours:</span> <span className="font-bold text-blue-400">{selectedProspect.hoursScore}/10</span></div>
                    <div className="bg-gray-700 rounded px-2 py-1"><span className="text-gray-400">Traffic:</span> <span className="font-bold text-green-400">{selectedProspect.trafficScore}/10</span></div>
                    <div className="bg-gray-700 rounded px-2 py-1"><span className="text-gray-400">Demo:</span> <span className="font-bold text-purple-400">{selectedProspect.demoScore}/10</span></div>
                    <div className="bg-gray-700 rounded px-2 py-1"><span className="text-gray-400">Total:</span> <span className="font-bold text-yellow-400">{(selectedProspect.hoursScore||0)+(selectedProspect.trafficScore||0)+(selectedProspect.demoScore||0)}/30</span></div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${statusOptions.find(s=>s.value===selectedProspect.status)?.color}`}>{statusOptions.find(s=>s.value===selectedProspect.status)?.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <a href={`tel:${selectedProspect.phone}`} className="px-3 py-1.5 bg-green-600 rounded text-sm">📞 Call</a>
                <a href={`https://${selectedProspect.website}`} target="_blank" className="px-3 py-1.5 bg-blue-600 rounded text-sm">🌐 Website</a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(selectedProspect.address + ' ' + selectedProspect.city)}`} target="_blank" className="px-3 py-1.5 bg-purple-600 rounded text-sm">📍 Map</a>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Deal Info</h4>
                  <div><label className="text-xs text-gray-400">Status</label>
                    <select value={selectedProspect.status} onChange={e => updateProspect(selectedId, {status: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                      {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-gray-400">Machine Type</label>
                    <select value={selectedProspect.machineType} onChange={e => updateProspect(selectedId, {machineType: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                      {vapeTmMachines.map(m => <option key={m.id} value={m.id}>{m.name} (${m.price})</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-gray-400">Bar Split: {selectedProspect.barSplit}%</label>
                    <input type="range" min="0" max="50" step="5" value={selectedProspect.barSplit} onChange={e => updateProspect(selectedId, {barSplit: Number(e.target.value)})} className="w-full" />
                  </div>
                  <div><label className="text-xs text-gray-400">Est. Monthly Revenue</label>
                    <input type="number" value={selectedProspect.estMonthly} onChange={e => updateProspect(selectedId, {estMonthly: Number(e.target.value)})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Info</h4>
                  <div><label className="text-xs text-gray-400">Owner Name</label><input value={selectedProspect.ownerName} onChange={e => updateProspect(selectedId, {ownerName: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-gray-400">Contact Date</label><input type="date" value={selectedProspect.contactDate} onChange={e => updateProspect(selectedId, {contactDate: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-gray-400">Next Action</label><input value={selectedProspect.nextAction} onChange={e => updateProspect(selectedId, {nextAction: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-gray-400">Notes</label><textarea value={selectedProspect.notes} onChange={e => updateProspect(selectedId, {notes: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm h-20" /></div>
                </div>
              </div>
            </div>
            {/* ROI Card */}
            <div className="bg-gray-800 rounded-xl p-4 border border-green-700">
              <h4 className="font-semibold text-green-400 mb-3">📊 Deal ROI</h4>
              {(() => { const roi = calcROI(selectedProspect); return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div><p className="text-gray-400 text-xs">Startup Cost</p><p className="text-xl font-bold">${roi.startup.toLocaleString()}</p></div>
                  <div><p className="text-gray-400 text-xs">Monthly Net</p><p className="text-xl font-bold text-green-400">${roi.monthlyNet.toLocaleString()}</p></div>
                  <div><p className="text-gray-400 text-xs">Payback</p><p className="text-xl font-bold text-yellow-400">{roi.payback.toFixed(1)} mo</p></div>
                  <div><p className="text-gray-400 text-xs">Annual Profit</p><p className="text-xl font-bold text-green-400">${roi.annual.toLocaleString()}</p></div>
                </div>
              );})()}
            </div>
          </div>
        )}

        {/* PIPELINE BOARD */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {statusOptions.filter(s => s.value !== 'lost').map(status => (
              <div key={status.value} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h4 className={`font-semibold text-sm mb-2 ${status.color.replace('bg-','text-')}`}>{status.label}</h4>
                <p className="text-xs text-gray-400 mb-2">{prospects.filter(p => p.status === status.value).length} deals • ${prospects.filter(p => p.status === status.value).reduce((s,p) => s + p.estMonthly, 0).toLocaleString()}/mo</p>
                <div className="space-y-1">
                  {prospects.filter(p => p.status === status.value).slice(0,5).map(p => (
                    <div key={p.id} onClick={() => {setActiveTab('prospects'); setSelectedId(p.id);}} className="bg-gray-700 rounded p-2 text-xs cursor-pointer hover:bg-gray-600">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-green-400">${p.estMonthly}/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {['whatif','pipeline','costs','products'].map(t => (
                <button key={t} onClick={() => setCalcTab(t)} className={`px-3 py-1.5 rounded text-sm ${calcTab === t ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {t === 'whatif' ? '🧪 What-If' : t === 'pipeline' ? '📊 Pipeline P/L' : t === 'costs' ? '🧾 Costs' : '📦 Products'}
                </button>
              ))}
            </div>
            {calcTab === 'whatif' && <WhatIfCalculator />}
            {calcTab === 'pipeline' && <PipelinePL prospects={prospects} calcROI={calcROI} getMachine={getMachine} />}
            {calcTab === 'costs' && <CostBreakdown />}
            {calcTab === 'products' && <ProductMargins />}
          </div>
        )}

        {/* MACHINES */}
        {activeTab === 'machines' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">🚬 VapeTM Machine Catalog</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Wall-Mounted</h3>
                {vapeTmMachines.filter(m => m.type === 'wall').map(m => <MachineCard key={m.id} machine={m} />)}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Towers</h3>
                {vapeTmMachines.filter(m => m.type === 'tower').map(m => <MachineCard key={m.id} machine={m} />)}
              </div>
            </div>
            <h3 className="font-semibold mt-4">Accessories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {accessories.map(a => (
                <div key={a.id} className="bg-gray-800 rounded p-3 border border-gray-700">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-green-400 font-bold">${a.price}</p>
                  {a.required && <span className="text-xs text-yellow-400">Required</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const colors = { blue: 'border-blue-700 bg-blue-900/20', green: 'border-green-700 bg-green-900/20', yellow: 'border-yellow-700 bg-yellow-900/20' };
  return <div className={`rounded-xl p-4 border ${colors[color]}`}><p className="text-gray-400 text-xs">{title}</p><p className="text-2xl font-bold">{value}</p></div>;
}

function MachineCard({ machine }) {
  return (
    <div className={`bg-gray-800 rounded-lg p-3 border mb-2 ${machine.recommended ? 'border-green-500' : 'border-gray-700'}`}>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{machine.name} {machine.recommended && <span className="text-xs text-green-400">⭐ RECOMMENDED</span>}</p>
          <p className="text-sm text-gray-400">{machine.slots} slots • {machine.type}</p>
          <p className="text-xs text-gray-500">{machine.description}</p>
        </div>
        <p className="text-green-400 font-bold">${machine.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

function WhatIfCalculator() {
  const [machines, setMachines] = useState(5);
  const [machineType, setMachineType] = useState('slim-tower-2');
  const [revenue, setRevenue] = useState(1200);
  const [cogs, setCogs] = useState(30);
  const [split, setSplit] = useState(20);
  const [opCosts, setOpCosts] = useState(200);
  
  const machine = vapeTmMachines.find(m => m.id === machineType);
  const startup = machines * (machine.price + 650 + 500);
  const gross = machines * revenue;
  const cogsAmt = gross * cogs / 100;
  const profit = gross - cogsAmt;
  const barShare = profit * split / 100;
  const net = profit - barShare - opCosts;
  const annual = net * 12;
  const payback = startup / net;
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-4">
        <h3 className="font-semibold">🧪 Scenario Builder</h3>
        <div><label className="text-xs text-gray-400">Machines: {machines}</label><input type="range" min="1" max="20" value={machines} onChange={e => setMachines(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-gray-400">Machine Type</label><select value={machineType} onChange={e => setMachineType(e.target.value)} className="w-full bg-gray-700 rounded px-2 py-1.5 text-sm">{vapeTmMachines.map(m => <option key={m.id} value={m.id}>{m.name} (${m.price})</option>)}</select></div>
        <div><label className="text-xs text-gray-400">Revenue/Machine: ${revenue}/mo</label><input type="range" min="500" max="2500" step="100" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-gray-400">COGS: {cogs}%</label><input type="range" min="20" max="50" value={cogs} onChange={e => setCogs(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-gray-400">Bar Split: {split}%</label><input type="range" min="0" max="50" step="5" value={split} onChange={e => setSplit(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-gray-400">Operating Costs: ${opCosts}/mo</label><input type="range" min="0" max="500" step="50" value={opCosts} onChange={e => setOpCosts(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold mb-2">💰 Startup</h4>
          <p className="text-3xl font-bold text-yellow-400">${startup.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Machines + accessories + initial inventory</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-green-700">
          <h4 className="font-semibold mb-2">📊 Monthly P/L</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Gross Revenue</span><span>${gross.toLocaleString()}</span></div>
            <div className="flex justify-between text-red-400"><span>COGS ({cogs}%)</span><span>-${cogsAmt.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Gross Profit</span><span>${profit.toLocaleString()}</span></div>
            <div className="flex justify-between text-red-400"><span>Bar Split ({split}%)</span><span>-${barShare.toLocaleString()}</span></div>
            <div className="flex justify-between text-red-400"><span>Operating</span><span>-${opCosts}</span></div>
            <div className="flex justify-between border-t border-gray-600 pt-1 font-bold text-green-400"><span>Net Profit</span><span>${net.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-blue-700">
          <h4 className="font-semibold mb-2">📈 Annual / ROI</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><p className="text-xs text-gray-400">Annual Profit</p><p className="text-2xl font-bold text-green-400">${annual.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-400">Payback</p><p className="text-2xl font-bold text-yellow-400">{payback.toFixed(1)} mo</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelinePL({ prospects, calcROI, getMachine }) {
  const active = prospects.filter(p => !['lost'].includes(p.status));
  const totalStartup = active.reduce((s, p) => s + calcROI(p).startup, 0);
  const totalMonthly = active.reduce((s, p) => s + calcROI(p).monthlyNet, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card title="Total Startup" value={`$${totalStartup.toLocaleString()}`} color="yellow" />
        <Card title="Monthly Revenue" value={`$${active.reduce((s,p) => s + p.estMonthly, 0).toLocaleString()}`} color="blue" />
        <Card title="Monthly Net" value={`$${totalMonthly.toLocaleString()}`} color="green" />
        <Card title="Annual Net" value={`$${(totalMonthly * 12).toLocaleString()}`} color="green" />
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700"><tr><th className="text-left px-3 py-2">Location</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Machine</th><th className="px-3 py-2">Startup</th><th className="px-3 py-2">Revenue</th><th className="px-3 py-2">Split</th><th className="px-3 py-2">Net/mo</th><th className="px-3 py-2">Payback</th></tr></thead>
          <tbody>
            {active.map(p => { const roi = calcROI(p); const m = getMachine(p.machineType); return (
              <tr key={p.id} className="border-t border-gray-700">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs ${statusOptions.find(s=>s.value===p.status)?.color}`}>{statusOptions.find(s=>s.value===p.status)?.label}</span></td>
                <td className="px-3 py-2 text-gray-400">{m.name}</td>
                <td className="px-3 py-2">${roi.startup.toLocaleString()}</td>
                <td className="px-3 py-2">${p.estMonthly.toLocaleString()}</td>
                <td className="px-3 py-2">{p.barSplit}%</td>
                <td className="px-3 py-2 text-green-400 font-bold">${roi.monthlyNet.toLocaleString()}</td>
                <td className="px-3 py-2 text-yellow-400">{roi.payback.toFixed(1)}mo</td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CostBreakdown() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-3">💵 One-Time Startup</h3>
        <div className="space-y-2 text-sm">
          {[['Machine (Slim Tower 2.0)', '$5,000'],['ID Scanner + Card Reader', '$650'],['Initial Inventory', '$500'],['TPT License (AZ)', '$12'],['LED Signage', '$150']].map(([item, cost]) => (
            <div key={item} className="flex justify-between"><span className="text-gray-400">{item}</span><span>{cost}</span></div>
          ))}
          <div className="flex justify-between border-t border-gray-600 pt-2 font-bold"><span>Total</span><span className="text-yellow-400">~$6,312</span></div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-3">📅 Monthly Recurring</h3>
        <div className="space-y-2 text-sm">
          {[['Restock (COGS ~30%)', 'Variable'],['Bar Split (15-25%)', 'Variable'],['Card Processing (3%)', '~$36'],['VTM Telemetry', '$25'],['Gas/Travel', '$50'],['Insurance', '$50']].map(([item, cost]) => (
            <div key={item} className="flex justify-between"><span className="text-gray-400">{item}</span><span>{cost}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductMargins() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-700"><tr><th className="text-left px-3 py-2">Product</th><th className="px-3 py-2">Wholesale</th><th className="px-3 py-2">Retail</th><th className="px-3 py-2">Margin</th><th className="text-left px-3 py-2">Supplier</th></tr></thead>
        <tbody>
          {productCatalog.map(p => {
            const margin = Math.round(((p.retail - p.wholesale) / p.wholesale) * 100);
            return (
              <tr key={p.id} className="border-t border-gray-700">
                <td className="px-3 py-2 font-medium">{p.name} {p.notes && <span className="text-xs text-yellow-400">({p.notes})</span>}</td>
                <td className="px-3 py-2 text-gray-400">${p.wholesale.toFixed(2)}</td>
                <td className="px-3 py-2 font-bold">${p.retail}</td>
                <td className="px-3 py-2"><span className={margin >= 500 ? 'text-green-400' : 'text-blue-400'}>{margin}%</span></td>
                <td className="px-3 py-2"><a href={p.supplierUrl} target="_blank" className="text-blue-400 hover:underline">{p.supplier}</a></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
