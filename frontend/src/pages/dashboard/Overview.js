import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchOverview } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Activity, Users, AlertTriangle, MapPin, Clock, TrendingUp, Shield, Accessibility } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-blue-400' }) => (
  <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700 transition-all" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
    <div className="flex items-center justify-between mb-3">
      <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
      {sub && <span className="text-xs text-slate-500 font-mono">{sub}</span>}
    </div>
    <div className="font-heading text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-400 mt-1">{label}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 100 ? `${(p.value / 1000).toFixed(1)}K` : p.value}</p>
      ))}
    </div>
  );
};

export default function Overview() {
  const { audienceMode } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-[#141820] rounded-xl h-28 border border-slate-800/60" />)}
        </div>
      </div>
    );
  }

  const showTechnical = audienceMode === 'technical' || audienceMode === 'executive';
  const showEquity = audienceMode === 'b2g' || audienceMode === 'executive';

  return (
    <div className="space-y-6" data-testid="overview-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">Executive Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Baku multimodal mobility intelligence at a glance</p>
        </div>
        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs">
          <Activity className="w-3 h-3 mr-1" /> System Operational
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPin} label="Mobility Modes" value={data.total_modes} sub="14 total" color="text-blue-400" />
        <StatCard icon={Shield} label="Active Providers" value={data.active_providers} sub={`${data.data_freshness_pct}% fresh`} color="text-emerald-400" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={data.active_alerts} color="text-amber-400" />
        <StatCard icon={Users} label="Daily Trips (est.)" value={`${(data.daily_trips_estimate / 1000000).toFixed(1)}M`} color="text-purple-400" />
      </div>

      {showEquity && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Accessibility} label="Wheelchair Accessible" value={`${data.wheelchair_accessible_pct}%`} sub="of stops" color="text-purple-400" />
          <StatCard icon={MapPin} label="Districts Covered" value={data.districts_covered} color="text-cyan-400" />
          <StatCard icon={TrendingUp} label="Forecast Accuracy" value={`${data.forecast_accuracy_pct}%`} color="text-emerald-400" />
          <StatCard icon={Clock} label="Data Freshness" value={`${data.data_freshness_pct}%`} sub="within SLA" color="text-blue-400" />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Mode Distribution */}
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="mode-distribution-chart">
          <h3 className="font-heading text-sm font-medium text-white mb-4">Mode Distribution (Baku)</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.mode_distribution} dataKey="share" cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={2}>
                    {data.mode_distribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {data.mode_distribution.map((m) => (
                <div key={m.mode} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: m.color }} />
                    <span className="text-slate-400">{m.mode}</span>
                  </div>
                  <span className="text-slate-300 font-mono">{m.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="weekly-trend-chart">
          <h3 className="font-heading text-sm font-medium text-white mb-4">Weekly Trip Volume (thousands)</h3>
          <ResponsiveContainer height={200}>
            <AreaChart data={data.weekly_trend}>
              <defs>
                <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="trips" stroke="#3b82f6" fill="url(#tripGrad)" strokeWidth={2} name="Trips (K)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider Health */}
      {showTechnical && (
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="provider-health-chart">
          <h3 className="font-heading text-sm font-medium text-white mb-4">Provider Uptime (%)</h3>
          <ResponsiveContainer height={180}>
            <BarChart data={data.provider_health} layout="vertical">
              <XAxis type="number" domain={[90, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="uptime" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} name="Uptime" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
