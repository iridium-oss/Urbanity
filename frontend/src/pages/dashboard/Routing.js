import { useState, useEffect } from 'react';
import { fetchDemoRoute } from '@/lib/api';
import { Route, Clock, Banknote, Leaf, Shield, Accessibility, Footprints, Train, Bus, Navigation, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MODE_COLORS = { walking: '#10b981', metro: '#ef4444', bus: '#3b82f6', taxi: '#f97316' };
const MODE_ICONS = { walking: Footprints, metro: Train, bus: Bus, taxi: Navigation };

export default function Routing() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchDemoRoute().then(d => { setData(d); setSelected(d.options[0]?.id); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="animate-pulse"><div className="bg-[#141820] rounded-xl h-64 border border-slate-800/60" /></div>;
  }

  const selectedRoute = data.options.find(r => r.id === selected) || data.options[0];

  return (
    <div className="space-y-6" data-testid="routing-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Routing Intelligence</h2>
        <p className="text-sm text-slate-400 mt-1">Multimodal route comparison with time, cost, emissions, and accessibility</p>
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
        <p className="text-xs text-slate-500 mt-3">Demo route showing multimodal comparison for a common Baku journey</p>
      </div>

      {/* Route Options */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="route-options">
        {data.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`text-left bg-[#141820] border rounded-xl p-5 transition-all duration-200 ${
              selected === opt.id ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-800/60 hover:border-slate-700'
            }`}
            data-testid={`route-option-${opt.id}`}
          >
            <div className="flex items-center gap-2 mb-3">
              {opt.modes.map((m, i) => {
                const Icon = MODE_ICONS[m] || Route;
                return (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                    <Icon className="w-4 h-4" style={{ color: MODE_COLORS[m] || '#64748b' }} strokeWidth={1.5} />
                  </span>
                );
              })}
            </div>
            <h3 className="font-heading text-sm font-medium text-white mb-3">{opt.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-slate-400"><Clock className="w-3 h-3" />{opt.time_min} min</div>
              <div className="flex items-center gap-1 text-slate-400"><Banknote className="w-3 h-3" />{opt.cost_azn.toFixed(2)} AZN</div>
              <div className="flex items-center gap-1 text-slate-400"><Leaf className="w-3 h-3" />{opt.emissions_g}g CO2</div>
              <div className="flex items-center gap-1 text-slate-400"><Shield className="w-3 h-3" />{Math.round(opt.reliability * 100)}%</div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className={`text-xs ${
                opt.accessibility === 'full' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                opt.accessibility === 'partial' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                'text-slate-400 border-slate-600 bg-slate-800/50'
              }`}>
                <Accessibility className="w-3 h-3 mr-1" />
                {opt.accessibility === 'full' ? 'Fully Accessible' : opt.accessibility === 'partial' ? 'Partial Access' : 'On Request'}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Route Detail */}
      {selectedRoute && (
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="route-detail">
          <h3 className="font-heading text-sm font-medium text-white mb-4">Route Segments: {selectedRoute.name}</h3>
          <div className="space-y-0">
            {selectedRoute.segments.map((seg, i) => {
              const Icon = MODE_ICONS[seg.mode] || Route;
              return (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ borderColor: MODE_COLORS[seg.mode] || '#64748b', backgroundColor: `${MODE_COLORS[seg.mode] || '#64748b'}15` }}>
                      <Icon className="w-4 h-4" style={{ color: MODE_COLORS[seg.mode] || '#64748b' }} strokeWidth={1.5} />
                    </div>
                    {i < selectedRoute.segments.length - 1 && <div className="w-0.5 flex-1 bg-slate-800 my-1" />}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading text-sm font-medium text-white capitalize">{seg.mode}</span>
                      {seg.line && <Badge variant="outline" className="text-xs text-red-400 border-red-500/20">{seg.line}</Badge>}
                      {seg.route && <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/20">{seg.route}</Badge>}
                    </div>
                    <p className="text-xs text-slate-400">{seg.from} to {seg.to}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{seg.min} min</span>
                      <span>{seg.m >= 1000 ? `${(seg.m / 1000).toFixed(1)} km` : `${seg.m} m`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
