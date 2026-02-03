'use client';

import { useState, useEffect } from 'react';
import { initialProspects, statusOptions, profitSplitGuide, callScript, productCatalog, suppliers } from '../lib/data';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calcTab, setCalcTab] = useState('revenue');
  const [prospects, setProspects] = useState([]);
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showScripts, setShowScripts] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vapeVendingProspects');
    if (saved) setProspects(JSON.parse(saved));
    else setProspects(initialProspects);
  }, []);

  useEffect(() => {
    if (prospects.length > 0) localStorage.setItem('vapeVendingProspects', JSON.stringify(prospects));
  }, [prospects]);

  const updateProspect = (id, field, value) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const stats = {
    total: prospects.length,
    notContacted: prospects.filter(p => p.status === 'not_contacted').length,
    inProgress: prospects.filter(p => ['left_voicemail', 'spoke_interested', 'meeting_scheduled', 'deal_in_progress'].includes(p.status)).length,
    won: prospects.filter(p => p.status === 'closed_won').length,
    totalPotentialMonthly: prospects.reduce((sum, p) => sum + p.estMonthly, 0),
    wonMonthly: prospects.filter(p => p.status === 'closed_won').reduce((sum, p) => sum + p.estMonthly, 0),
  };

  const filteredProspects = prospects.filter(p => {
    if (filterArea !== 'all' && p.area !== filterArea) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    return true;
  });

  const areas = [...new Set(prospects.map(p => p.area))];
  const priorities = [...new Set(prospects.map(p => p.priority))];

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚬</span>
            <div>
              <h1 className="text-xl font-bold text-white">Vape Vending Tracker</h1>
              <p className="text-sm text-gray-400">Arizona Operations</p>
            </div>
          </div>
          <button onClick={() => setShowScripts(!showScripts)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium">📞 Call Scripts</button>
        </div>
      </header>

      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex gap-1">
          {[{id:'dashboard',label:'📊 Dashboard'},{id:'prospects',label:'📋 Prospects'},{id:'calculator',label:'💰 Calculator'},{id:'splits',label:'🤝 Profit Splits'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>{tab.label}</button>
          ))}
        </div>
      </nav>

      {showScripts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📞 Call Scripts</h2>
              <button onClick={() => setShowScripts(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4"><h3 className="font-semibold text-green-400 mb-2">Opening:</h3><p className="text-gray-300 italic">"{callScript.opening}"</p></div>
              <div className="bg-gray-700 rounded-lg p-4"><h3 className="font-semibold text-blue-400 mb-2">Value Props:</h3><ul className="space-y-2">{callScript.valueProps.map((p,i)=><li key={i} className="text-gray-300">• {p}</li>)}</ul></div>
              <div className="bg-gray-700 rounded-lg p-4"><h3 className="font-semibold text-yellow-400 mb-2">Objections:</h3>{Object.entries(callScript.objections).map(([o,r])=><div key={o} className="mb-2"><p className="text-red-400">"{o}"</p><p className="text-gray-300 ml-4">→ {r}</p></div>)}</div>
              <div className="bg-gray-700 rounded-lg p-4"><h3 className="font-semibold text-purple-400 mb-2">Close:</h3><p className="text-gray-300 italic">"{callScript.closeAttempt}"</p></div>
            </div>
          </div>
        </div>
      )}

      <main className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Prospects" value={stats.total} icon="📋" color="blue" />
              <StatCard title="Not Contacted" value={stats.notContacted} icon="📵" color="gray" />
              <StatCard title="In Progress" value={stats.inProgress} icon="🔄" color="yellow" />
              <StatCard title="Deals Won" value={stats.won} icon="🎉" color="green" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm mb-2">Total Pipeline Value</h3>
                <p className="text-3xl font-bold">${stats.totalPotentialMonthly.toLocaleString()}<span className="text-lg text-gray-400">/mo</span></p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-green-700">
                <h3 className="text-green-400 text-sm mb-2">Won Revenue</h3>
                <p className="text-3xl font-bold text-green-400">${stats.wonMonthly.toLocaleString()}<span className="text-lg text-green-600">/mo</span></p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold mb-4">🎯 Today's Priority Calls</h3>
              <div className="space-y-2">
                {prospects.filter(p => p.status === 'not_contacted' && p.priority === 'A+').slice(0,5).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div><p className="font-medium">{p.name}</p><p className="text-sm text-gray-400">{p.city} • {p.phone}</p></div>
                    <div className="text-right"><span className="text-green-400 font-bold">${p.estMonthly}/mo</span><p className="text-xs text-yellow-400">{p.priority}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prospects' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 bg-gray-800 rounded-lg p-4">
              <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Areas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Priorities</option>
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Statuses</option>
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <span className="text-gray-400 text-sm self-center ml-auto">Showing {filteredProspects.length} of {prospects.length}</span>
            </div>
            <div className="space-y-2">
              {filteredProspects.map(prospect => (
                <div key={prospect.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{prospect.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${prospect.priority === 'A+' ? 'bg-green-600' : prospect.priority === 'A' ? 'bg-blue-600' : 'bg-gray-600'}`}>{prospect.priority}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{prospect.address}, {prospect.city}</p>
                      <p className="text-gray-500 text-sm">{prospect.area} • ⭐ {prospect.rating}</p>
                    </div>
                    <div className="text-center"><p className="text-green-400 font-bold text-lg">${prospect.estMonthly}</p><p className="text-gray-500 text-xs">/month</p></div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <a href={`tel:${prospect.phone}`} className="text-blue-400 hover:underline text-sm">📞 {prospect.phone}</a>
                      <select value={prospect.status} onChange={e => updateProspect(prospect.id, 'status', e.target.value)} className={`rounded px-2 py-1 text-sm font-medium ${statusOptions.find(s => s.value === prospect.status)?.color || 'bg-gray-500'}`}>
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Owner Name" value={prospect.ownerName} onChange={e => updateProspect(prospect.id, 'ownerName', e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" />
                    <input type="date" value={prospect.contactDate} onChange={e => updateProspect(prospect.id, 'contactDate', e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" />
                    <input type="text" placeholder="Next Action" value={prospect.nextAction} onChange={e => updateProspect(prospect.id, 'nextAction', e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-4">
            <div className="flex gap-2 bg-gray-800 rounded-lg p-2">
              <button onClick={() => setCalcTab('revenue')} className={`px-4 py-2 rounded-lg text-sm font-medium ${calcTab === 'revenue' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>💵 Revenue</button>
              <button onClick={() => setCalcTab('products')} className={`px-4 py-2 rounded-lg text-sm font-medium ${calcTab === 'products' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>📦 Product Margins</button>
              <button onClick={() => setCalcTab('suppliers')} className={`px-4 py-2 rounded-lg text-sm font-medium ${calcTab === 'suppliers' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>🚚 Suppliers</button>
            </div>
            {calcTab === 'revenue' && <RevenueCalculator />}
            {calcTab === 'products' && <ProductMargins />}
            {calcTab === 'suppliers' && <SupplierList />}
          </div>
        )}

        {activeTab === 'splits' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">💰 Profit Split Guide</h2>
              <div className="space-y-3">
                {profitSplitGuide.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                    <div><p className="font-semibold">{item.tier}</p><p className="text-gray-400 text-sm">{item.description}</p></div>
                    <span className="text-green-400 font-bold text-lg">{item.split}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = { blue: 'border-blue-700 bg-blue-900/20', green: 'border-green-700 bg-green-900/20', yellow: 'border-yellow-700 bg-yellow-900/20', gray: 'border-gray-700 bg-gray-800' };
  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{icon}</span><span className="text-gray-400 text-sm">{title}</span></div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function RevenueCalculator() {
  const [machines, setMachines] = useState(5);
  const [avgRevenue, setAvgRevenue] = useState(1200);
  const [profitMargin, setProfitMargin] = useState(40);
  const [barSplit, setBarSplit] = useState(20);
  const monthlyGross = machines * avgRevenue;
  const monthlyProfit = monthlyGross * (profitMargin / 100);
  const monthlyAfterSplit = monthlyProfit * (1 - barSplit / 100);
  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">💰 Revenue Calculator</h2>
        <div className="space-y-4">
          <div><label className="block text-sm text-gray-400 mb-1">Machines: {machines}</label><input type="range" min="1" max="20" value={machines} onChange={e => setMachines(Number(e.target.value))} className="w-full" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Avg Revenue: ${avgRevenue}/mo</label><input type="range" min="500" max="2000" step="100" value={avgRevenue} onChange={e => setAvgRevenue(Number(e.target.value))} className="w-full" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Profit Margin: {profitMargin}%</label><input type="range" min="20" max="60" value={profitMargin} onChange={e => setProfitMargin(Number(e.target.value))} className="w-full" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Bar Split: {barSplit}%</label><input type="range" min="0" max="50" step="5" value={barSplit} onChange={e => setBarSplit(Number(e.target.value))} className="w-full" /></div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-6 border border-green-700">
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-400">Monthly Gross</span><span className="font-bold">${monthlyGross.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Monthly Profit</span><span className="font-bold">${monthlyProfit.toLocaleString()}</span></div>
          <div className="flex justify-between border-t border-gray-700 pt-3"><span className="text-gray-400">After Bar Split</span><span className="font-bold text-green-400">${monthlyAfterSplit.toLocaleString()}</span></div>
          <div className="flex justify-between text-lg"><span>Annual Net</span><span className="font-bold text-green-400">${(monthlyAfterSplit * 12).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

function ProductMargins() {
  const [filterCat, setFilterCat] = useState('all');
  const categories = [...new Set(productCatalog.map(p => p.category))];
  const filtered = filterCat === 'all' ? productCatalog : productCatalog.filter(p => p.category === filterCat);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📦 Product Catalog</h2>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700"><tr><th className="text-left px-4 py-3">Product</th><th className="text-right px-4 py-3">Wholesale</th><th className="text-right px-4 py-3">Retail</th><th className="text-right px-4 py-3">Margin</th><th className="text-left px-4 py-3">Supplier</th></tr></thead>
          <tbody>
            {filtered.map(p => {
              const margin = Math.round(((p.retail - p.wholesale) / p.wholesale) * 100);
              return (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3"><span className="font-medium">{p.name}</span>{p.notes && <span className="text-xs text-yellow-400 ml-2">({p.notes})</span>}</td>
                  <td className="text-right px-4 py-3 text-gray-400">${p.wholesale.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 font-bold">${p.retail}</td>
                  <td className="text-right px-4 py-3"><span className={`font-bold ${margin >= 500 ? 'text-green-400' : margin >= 200 ? 'text-blue-400' : 'text-gray-300'}`}>{margin}%</span></td>
                  <td className="px-4 py-3"><a href={p.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{p.supplier} →</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
        <p className="text-green-400 text-sm">💡 <strong>Pro tip:</strong> Call VapeTM at 888-537-8273 to set up wholesale with SmokeDirect.</p>
      </div>
    </div>
  );
}

function SupplierList() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🚚 Verified Suppliers</h2>
      <div className="grid gap-4">
        {suppliers.map((s, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold">{s.name}</h3>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">{s.url} →</a>
            {s.phone && <p className="text-gray-400 mt-1">📞 <a href={`tel:${s.phone}`} className="text-green-400">{s.phone}</a></p>}
            <p className="text-gray-400 mt-3 text-sm">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
