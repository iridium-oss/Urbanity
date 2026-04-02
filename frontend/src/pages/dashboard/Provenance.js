import { useState, useEffect } from 'react';
import { fetchProviders } from '@/lib/api';
import { Shield, Clock, Activity, Database, ExternalLink, CheckCircle2, AlertCircle, XCircle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PROV_CONFIG = {
  official: { label: 'Official', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: '#10b981', icon: CheckCircle2 },
  official_alerts_only: { label: 'Alerts Only', color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/30', dot: '#84cc16', icon: CheckCircle2 },
  public_web_observed: { label: 'Web Observed', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: '#3b82f6', icon: Activity },
  public_undocumented: { label: 'Undocumented', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: '#f59e0b', icon: AlertCircle },
  licensed_partner: { label: 'Licensed', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: '#a855f7', icon: ExternalLink },
  configuration_required: { label: 'Config Needed', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: '#ef4444', icon: Settings },
  unavailable: { label: 'Unavailable', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: '#64748b', icon: XCircle },
  stale: { label: 'Stale', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: '#c2410c', icon: Clock },
};

export default function Provenance() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProviders().then(setProviders).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-[#141820] rounded-xl h-20 border border-slate-200 dark:border-slate-800/60" />)}</div>;
  }

  const filtered = filter === 'all' ? providers : providers.filter(p => p.provenance === filter);
  const provCounts = providers.reduce((acc, p) => { acc[p.provenance] = (acc[p.provenance] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6" data-testid="provenance-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Provider Provenance</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Source transparency for every data provider in the Urbanivity system</p>
      </div>

      {/* Provenance Legend */}
      <div className="bg-white dark:bg-[#141820] border border-slate-200 dark:border-slate-800/60 rounded-xl p-5" data-testid="provenance-legend">
        <h3 className="font-heading text-sm font-medium text-slate-900 dark:text-white mb-4">Provenance Classification</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(PROV_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className={`flex items-center gap-2 p-2 rounded-lg ${cfg.bg} ${cfg.border} border`}>
                <div className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: cfg.dot }} />
                <Icon className={`w-3 h-3 ${cfg.color}`} />
                <span className={`text-xs font-mono ${cfg.color}`}>{cfg.label}</span>
                {provCounts[key] && <span className="text-xs text-slate-500 ml-auto">{provCounts[key]}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="bg-white dark:bg-slate-800/60 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">All ({providers.length})</TabsTrigger>
          {Object.entries(provCounts).map(([key, count]) => (
            <TabsTrigger key={key} value={key} className={`text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white`}>
              {PROV_CONFIG[key]?.label || key} ({count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Provider Table */}
      <div className="bg-white dark:bg-[#141820] border border-slate-200 dark:border-slate-800/60 rounded-xl overflow-hidden" data-testid="providers-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/40 text-xs text-slate-500 font-mono uppercase tracking-wider">
                <th className="text-left p-4">Provider</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Provenance</th>
                <th className="text-left p-4">Coverage</th>
                <th className="text-right p-4">Reliability</th>
                <th className="text-right p-4">Freshness</th>
                <th className="text-right p-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cfg = PROV_CONFIG[p.provenance] || PROV_CONFIG.unavailable;
                return (
                  <tr key={p.id} className="border-b border-slate-200 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors" data-testid={`provider-${p.id}`}>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{p.description}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-xs">{p.type}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`text-xs ${cfg.color} ${cfg.border} ${cfg.bg}`}>
                        <div className="w-1.5 h-1.5 rounded-full mr-1.5 pulse-dot" style={{ backgroundColor: cfg.dot }} />
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{p.coverage}</td>
                    <td className="p-4 text-right">
                      {p.reliability !== null ? (
                        <span className={`font-mono text-xs ${p.reliability >= 0.9 ? 'text-emerald-400' : p.reliability >= 0.7 ? 'text-amber-400' : 'text-red-400'}`}>
                          {Math.round(p.reliability * 100)}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-xs text-slate-600 dark:text-slate-400">
                      {p.freshness_hours !== null ? (
                        p.freshness_hours < 1 ? `${Math.round(p.freshness_hours * 60)}m` : `${p.freshness_hours}h`
                      ) : 'N/A'}
                    </td>
                    <td className="p-4 text-right text-xs text-slate-500">
                      {p.last_updated ? p.last_updated.split('T')[0] : 'Not configured'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white dark:bg-[#141820] border border-slate-200 dark:border-slate-800/60 rounded-xl p-5">
        <h3 className="font-heading text-sm font-medium text-slate-900 dark:text-white mb-2">Why Provenance Matters</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Every piece of data in Urbanivity carries a provenance tag that describes its source, trust level, and freshness.
          This allows decision-makers to understand the reliability of what they see, distinguish between official government data and
          community-observed information, and identify gaps where data sources need to be configured or permissions obtained.
          Source transparency is not optional; it is fundamental to building trust in urban intelligence systems.
        </p>
      </div>
    </div>
  );
}
