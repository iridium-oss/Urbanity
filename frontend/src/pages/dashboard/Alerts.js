import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchAlerts } from '@/lib/api';
import { AlertTriangle, Info, CheckCircle2, Clock, MapPin, Shield, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SEVERITY_CONFIG = {
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  resolved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const PROVENANCE_COLORS = {
  official: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  official_alerts_only: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
  public_web_observed: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  public_undocumented: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
};

export default function Alerts() {
  const { activeModes } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAlerts().then(setAlerts).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-[#141820] rounded-xl h-24 border border-slate-800/60" />)}</div>;
  }

  const filtered = (statusFilter === 'all' ? alerts : alerts.filter(a => a.status === statusFilter))
    .filter(a => activeModes.size === 0 || activeModes.has(a.mode));
  const activeCount = alerts.filter(a => a.status === 'active').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6" data-testid="alerts-page">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">Alerts & Incidents</h2>
          <p className="text-sm text-slate-400 mt-1">Official alerts, observed disruptions, and anomaly outputs</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 text-xs">
            {activeCount} Active
          </Badge>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs">
            {resolvedCount} Resolved
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <TabsList className="bg-slate-800/60">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="resolved" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Resolved ({resolvedCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3" data-testid="alerts-list">
        {filtered.length === 0 ? (
          <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No alerts matching this filter</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            const SevIcon = sev.icon;
            return (
              <div key={alert.id} className={`bg-[#141820] border ${sev.border} rounded-xl p-5 hover:border-slate-600 transition-all`} data-testid={`alert-${alert.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${sev.bg} flex items-center justify-center flex-shrink-0`}>
                    <SevIcon className={`w-5 h-5 ${sev.color}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-heading text-sm font-medium text-white">{alert.title}</h3>
                      <Badge variant="outline" className={`text-xs ${PROVENANCE_COLORS[alert.provenance] || 'text-slate-400 border-slate-600'}`}>
                        <Shield className="w-3 h-3 mr-1" />{alert.provenance.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.affected_area}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.start_time?.split('T')[0]}</span>
                      {alert.mode && <Badge variant="outline" className="text-xs text-slate-400 border-slate-700 capitalize">{alert.mode}</Badge>}
                      <Badge variant="outline" className={`text-xs ${alert.status === 'active' ? 'text-amber-400 border-amber-500/30' : 'text-emerald-400 border-emerald-500/30'}`}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
