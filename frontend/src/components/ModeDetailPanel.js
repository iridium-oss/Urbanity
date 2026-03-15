import { useState, useEffect } from 'react';
import { fetchModeDetail } from '@/lib/api';
import {
  X, MapPin, Route, Clock, AlertTriangle, Shield, Star,
  Footprints, Accessibility, Bike, Zap, CircleDot, Car,
  Navigation, Train, Bus, Truck, Repeat, Users, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MODE_ICONS = {
  walking: Footprints, wheelchair: Accessibility, bicycle: Bike, e_bike: Zap,
  scooter: CircleDot, e_scooter: Zap, private_car: Car, taxi: Navigation,
  metro: Train, bus: Bus, minibus: Truck, shuttle: Bus,
  park_and_ride: Repeat, shared_mobility: Users,
};

const PROV_COLORS = {
  official: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  official_alerts_only: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
  public_web_observed: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  public_undocumented: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  licensed_partner: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  configuration_required: 'text-red-400 border-red-500/30 bg-red-500/10',
};

export default function ModeDetailPanel({ modeId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!modeId) return;
    setLoading(true);
    fetchModeDetail(modeId).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [modeId]);

  if (!modeId) return null;

  const Icon = MODE_ICONS[modeId] || CircleDot;

  if (loading) {
    return (
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5 mb-4" data-testid="mode-detail-loading">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-sm text-slate-400">Loading mode details...</span>
        </div>
      </div>
    );
  }

  if (!data || data.error) return null;

  const detail = data.detail || {};
  const infra = detail.infrastructure || {};
  const routes = detail.popular_routes || [];

  return (
    <div className="bg-[#141820] border border-blue-500/20 rounded-xl overflow-hidden mb-4" data-testid={`mode-detail-${modeId}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${data.color}15`, border: `1px solid ${data.color}30` }}>
            <Icon className="w-5 h-5" style={{ color: data.color }} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-white">{data.name}</h3>
            <p className="text-xs text-slate-500">{data.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${data.status === 'active' ? 'text-emerald-400 border-emerald-500/30' : data.status === 'limited' ? 'text-amber-400 border-amber-500/30' : data.status === 'emerging' ? 'text-blue-400 border-blue-500/30' : 'text-slate-400 border-slate-600'}`}>
            {data.status}
          </Badge>
          <Badge variant="outline" className={`text-xs ${PROV_COLORS[data.provenance] || 'text-slate-400 border-slate-600'}`}>
            <Shield className="w-3 h-3 mr-1" />{data.provenance?.replace(/_/g, ' ')}
          </Badge>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors ml-2" data-testid="close-mode-detail">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stats */}
          <div className="space-y-3">
            <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider">Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Routes Available</span>
                <span className="text-white font-mono">{detail.routes_available ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Avg Speed</span>
                <span className="text-white font-mono">{detail.avg_speed_kmh ? `${detail.avg_speed_kmh} km/h` : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Coverage</span>
                <span className="text-white font-mono">{detail.coverage_km ? `${detail.coverage_km} km` : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Active Alerts</span>
                <span className={`font-mono ${data.active_alerts > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{data.active_alerts}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-3">
            <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider">Infrastructure</h4>
            <div className="space-y-2">
              {Object.entries(infra).slice(0, 5).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-500 truncate mr-2">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                  <span className="text-white font-mono whitespace-nowrap">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : Array.isArray(val) ? val.join(', ') : val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Routes */}
          <div className="space-y-3">
            <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider">Popular Routes</h4>
            {routes.length > 0 ? (
              <div className="space-y-2">
                {routes.slice(0, 3).map((r, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800/30">
                    <div className="text-xs text-white font-medium truncate">{r.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span>{r.distance_m >= 1000 ? `${(r.distance_m / 1000).toFixed(1)} km` : `${r.distance_m} m`}</span>
                      <span>{r.time_min} min</span>
                      {r.rating && <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-amber-400" /> {r.rating}</span>}
                      {r.est_cost && <span>{r.est_cost.toFixed(2)} AZN</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic">No routes available yet</p>
            )}
          </div>

          {/* Providers */}
          <div className="space-y-3">
            <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider">Data Providers</h4>
            {data.providers?.length > 0 ? (
              <div className="space-y-2">
                {data.providers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate mr-2">{p.name}</span>
                    <div className="flex items-center gap-2">
                      {p.reliability && <span className="font-mono text-emerald-400">{Math.round(p.reliability * 100)}%</span>}
                      <Badge variant="outline" className={`text-[10px] py-0 h-4 ${PROV_COLORS[p.provenance] || ''}`}>
                        {p.provenance?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic">No providers configured</p>
            )}
            {/* Transit Lines */}
            {data.transit_lines?.length > 0 && (
              <div className="mt-2 space-y-1">
                <h5 className="text-[10px] text-slate-600 font-mono uppercase">Transit Lines</h5>
                {data.transit_lines.map(l => (
                  <div key={l.id} className="text-xs text-slate-400">{l.name} ({l.stations} stops, {l.length_km} km)</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {data.alerts?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/40">
            <h4 className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">Active Alerts</h4>
            <div className="space-y-2">
              {data.alerts.map(a => (
                <div key={a.id} className="flex items-start gap-2 text-xs">
                  <AlertTriangle className={`w-3 h-3 flex-shrink-0 mt-0.5 ${a.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`} />
                  <div>
                    <span className="text-slate-300">{a.title}</span>
                    <span className="text-slate-600 ml-2">{a.affected_area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
