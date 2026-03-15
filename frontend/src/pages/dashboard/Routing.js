import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchDemoRoute } from '@/lib/api';
import {
  Route, Clock, Banknote, Leaf, Shield, Accessibility, Footprints,
  Train, Bus, Navigation, ArrowRight, Bike, Zap, CircleDot, Car,
  Truck, Repeat, Users, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MODE_COLORS = {
  walking: '#10b981', wheelchair: '#8b5cf6', bicycle: '#06b6d4', e_bike: '#14b8a6',
  scooter: '#f59e0b', e_scooter: '#eab308', private_car: '#64748b', taxi: '#f97316',
  metro: '#ef4444', bus: '#3b82f6', minibus: '#a855f7', shuttle: '#ec4899',
  park_and_ride: '#6366f1', shared_mobility: '#0ea5e9',
};

const MODE_ICONS = {
  walking: Footprints, wheelchair: Accessibility, bicycle: Bike, e_bike: Zap,
  scooter: CircleDot, e_scooter: Zap, private_car: Car, taxi: Navigation,
  metro: Train, bus: Bus, minibus: Truck, shuttle: Bus,
  park_and_ride: Repeat, shared_mobility: Users,
};

const CATEGORIES = [
  { id: 'all', name: 'All Modes' },
  { id: 'active', name: 'Active' },
  { id: 'transit', name: 'Transit' },
  { id: 'vehicle', name: 'Vehicle' },
  { id: 'micro', name: 'Micro' },
];

export default function Routing() {
  const { activeModes } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  useEffect(() => {
    fetchDemoRoute().then(d => {
      setData(d);
      setSelected(d.options[0]?.id);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-[#141820] rounded-xl h-24 border border-slate-800/60" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-[#141820] rounded-xl h-48 border border-slate-800/60" />)}
        </div>
      </div>
    );
  }

  const getCategoryForMode = (mode) => {
    if (['walking', 'wheelchair', 'bicycle', 'e_bike'].includes(mode)) return 'active';
    if (['scooter', 'e_scooter'].includes(mode)) return 'micro';
    if (['private_car', 'taxi'].includes(mode)) return 'vehicle';
    if (['metro', 'bus', 'minibus', 'shuttle'].includes(mode)) return 'transit';
    return 'transfer';
  };

  let filtered = data.options.filter(opt => opt.segments.length > 0 || opt.primary_mode === 'shared_mobility');
  if (activeModes.size > 0) {
    filtered = filtered.filter(opt => activeModes.has(opt.primary_mode));
  }
  if (category !== 'all') {
    filtered = filtered.filter(opt => getCategoryForMode(opt.primary_mode) === category);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (a.primary_mode === 'shared_mobility') return 1;
    if (b.primary_mode === 'shared_mobility') return -1;
    if (sortBy === 'time') return a.time_min - b.time_min;
    if (sortBy === 'cost') return a.cost_azn - b.cost_azn;
    if (sortBy === 'emissions') return a.emissions_g - b.emissions_g;
    return b.reliability - a.reliability;
  });

  const selectedRoute = data.options.find(r => r.id === selected);

  return (
    <div className="space-y-6" data-testid="routing-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Routing Intelligence</h2>
        <p className="text-sm text-slate-400 mt-1">Compare all 14 mobility modes for any journey across Baku</p>
      </div>

      {/* Origin / Destination */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="route-endpoints">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1 block">Origin</label>
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white">{data.origin.name}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 hidden sm:block mt-5" />
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1 block">Destination</label>
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white">{data.destination.name}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-slate-800/60">
            {CATEGORIES.map(c => (
              <TabsTrigger key={c.id} value={c.id} className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">{c.name}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          {['time', 'cost', 'emissions', 'reliability'].map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-all ${sortBy === s ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}
              data-testid={`sort-${s}`}
            >
              {s === 'time' ? 'Time' : s === 'cost' ? 'Cost' : s === 'emissions' ? 'CO2' : 'Reliability'}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="route-options">
        {sorted.map((opt) => {
          const Icon = MODE_ICONS[opt.primary_mode] || Route;
          const color = MODE_COLORS[opt.primary_mode] || '#64748b';
          const isPlanned = opt.primary_mode === 'shared_mobility';
          const isSelected = selected === opt.id;
          const isExpanded = expanded === opt.id;

          return (
            <div
              key={opt.id}
              className={`bg-[#141820] border rounded-xl transition-all duration-200 overflow-hidden ${
                isSelected ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-800/60 hover:border-slate-700'
              } ${isPlanned ? 'opacity-60' : ''}`}
              data-testid={`route-option-${opt.id}`}
            >
              <button
                onClick={() => { setSelected(opt.id); if (!isPlanned) setExpanded(isExpanded ? null : opt.id); }}
                className="w-full text-left p-4"
              >
                {/* Mode Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-medium text-white truncate">{opt.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {opt.modes.slice(0, 4).map((m, i) => {
                        const MIcon = MODE_ICONS[m] || Route;
                        return (
                          <span key={i} className="flex items-center gap-0.5">
                            {i > 0 && <ArrowRight className="w-2 h-2 text-slate-700" />}
                            <MIcon className="w-3 h-3" style={{ color: MODE_COLORS[m] || '#64748b' }} strokeWidth={1.5} />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {!isPlanned && (
                    isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {isPlanned ? (
                  <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Planned for Q3 2026</p>
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600 mt-2">configuration_required</Badge>
                  </div>
                ) : (
                  <>
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="font-mono">{opt.time_min} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Banknote className="w-3 h-3 flex-shrink-0" />
                        <span className="font-mono">{opt.cost_azn > 0 ? `${opt.cost_azn.toFixed(2)} AZN` : 'Free'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Leaf className="w-3 h-3 flex-shrink-0" />
                        <span className="font-mono">{opt.emissions_g}g CO2</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Shield className="w-3 h-3 flex-shrink-0" />
                        <span className="font-mono">{Math.round(opt.reliability * 100)}%</span>
                      </div>
                    </div>

                    {/* Accessibility Badge */}
                    <div className="mt-3">
                      <Badge variant="outline" className={`text-xs ${
                        opt.accessibility === 'full' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                        opt.accessibility === 'partial' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                        opt.accessibility === 'limited' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                        'text-slate-400 border-slate-600 bg-slate-800/50'
                      }`}>
                        <Accessibility className="w-3 h-3 mr-1" />
                        {opt.accessibility === 'full' ? 'Fully Accessible' :
                         opt.accessibility === 'partial' ? 'Partial Access' :
                         opt.accessibility === 'limited' ? 'Limited Access' :
                         opt.accessibility === 'request_required' ? 'On Request' : opt.accessibility}
                      </Badge>
                    </div>
                  </>
                )}
              </button>

              {/* Expanded Segments */}
              {isExpanded && !isPlanned && opt.segments.length > 0 && (
                <div className="border-t border-slate-800/40 p-4 bg-slate-900/30">
                  <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-3">Route Segments</h4>
                  <div className="space-y-0">
                    {opt.segments.map((seg, i) => {
                      const SIcon = MODE_ICONS[seg.mode] || Route;
                      const sColor = MODE_COLORS[seg.mode] || '#64748b';
                      return (
                        <div key={i} className="flex gap-3 relative">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center border" style={{ borderColor: `${sColor}50`, backgroundColor: `${sColor}10` }}>
                              <SIcon className="w-3.5 h-3.5" style={{ color: sColor }} strokeWidth={1.5} />
                            </div>
                            {i < opt.segments.length - 1 && <div className="w-0.5 flex-1 bg-slate-800 my-0.5" />}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-medium text-slate-300 capitalize">{seg.mode.replace('_', ' ')}</span>
                              {seg.line && <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/20 py-0 h-4">{seg.line}</Badge>}
                              {seg.route && <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/20 py-0 h-4">{seg.route}</Badge>}
                            </div>
                            <p className="text-[11px] text-slate-500">{seg.from} &rarr; {seg.to}</p>
                            <p className="text-[11px] text-slate-600">{seg.min} min / {seg.m >= 1000 ? `${(seg.m / 1000).toFixed(1)} km` : `${seg.m} m`}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary comparison */}
      {sorted.length > 0 && sorted[0].primary_mode !== 'shared_mobility' && (
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="route-comparison-summary">
          <h3 className="font-heading text-sm font-medium text-white mb-3">Quick Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 font-mono uppercase tracking-wider border-b border-slate-800/40">
                  <th className="text-left p-2">Mode</th>
                  <th className="text-right p-2">Time</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-right p-2">CO2</th>
                  <th className="text-right p-2">Reliability</th>
                  <th className="text-right p-2">Access</th>
                </tr>
              </thead>
              <tbody>
                {sorted.filter(o => o.primary_mode !== 'shared_mobility').map(opt => {
                  const Icon = MODE_ICONS[opt.primary_mode] || Route;
                  return (
                    <tr key={opt.id} className="border-b border-slate-800/20 hover:bg-slate-800/20">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" style={{ color: MODE_COLORS[opt.primary_mode] }} strokeWidth={1.5} />
                          <span className="text-slate-300">{opt.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-right font-mono text-slate-400">{opt.time_min} min</td>
                      <td className="p-2 text-right font-mono text-slate-400">{opt.cost_azn > 0 ? `${opt.cost_azn.toFixed(2)}` : 'Free'}</td>
                      <td className="p-2 text-right font-mono text-slate-400">{opt.emissions_g}g</td>
                      <td className="p-2 text-right font-mono text-slate-400">{Math.round(opt.reliability * 100)}%</td>
                      <td className="p-2 text-right">
                        <span className={`${opt.accessibility === 'full' ? 'text-emerald-400' : opt.accessibility === 'partial' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {opt.accessibility}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
