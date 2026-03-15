import { useState, useEffect } from 'react';
import { fetchCongestion } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">Congestion: {Math.round((d?.level || 0) * 100)}%</p>
      <p className="text-xs text-slate-400">Confidence: {Math.round((d?.confidence || 0) * 100)}%</p>
    </div>
  );
};

export default function Forecasting() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [corridor, setCorridor] = useState('Heydar Aliyev Ave');

  useEffect(() => {
    setLoading(true);
    fetchCongestion(corridor).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [corridor]);

  if (loading || !data) {
    return <div className="animate-pulse"><div className="bg-[#141820] rounded-xl h-64 border border-slate-800/60" /></div>;
  }

  const chartData = data.forecast.map(f => ({ ...f, level: f.level * 100, conf_upper: f.level * 100 + (1 - f.confidence) * 15, conf_lower: Math.max(0, f.level * 100 - (1 - f.confidence) * 15) }));
  const peakHour = data.forecast.reduce((a, b) => a.level > b.level ? a : b);
  const avgConfidence = data.forecast.reduce((s, f) => s + f.confidence, 0) / data.forecast.length;

  return (
    <div className="space-y-6" data-testid="forecasting-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Congestion Forecasting</h2>
        <p className="text-sm text-slate-400 mt-1">ML-based congestion predictions for major Baku corridors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
          <TrendingUp className="w-4 h-4 text-red-400 mb-2" strokeWidth={1.5} />
          <div className="font-heading text-xl font-bold text-white">{Math.round(peakHour.level * 100)}%</div>
          <div className="text-xs text-slate-400">Peak Congestion</div>
        </div>
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
          <Clock className="w-4 h-4 text-amber-400 mb-2" strokeWidth={1.5} />
          <div className="font-heading text-xl font-bold text-white">{peakHour.hour}</div>
          <div className="text-xs text-slate-400">Peak Hour</div>
        </div>
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-2" strokeWidth={1.5} />
          <div className="font-heading text-xl font-bold text-white">{Math.round(avgConfidence * 100)}%</div>
          <div className="text-xs text-slate-400">Avg Confidence</div>
        </div>
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-blue-400 mb-2" strokeWidth={1.5} />
          <div className="font-heading text-xs font-medium text-slate-300 truncate">{data.model}</div>
          <div className="text-xs text-slate-400 mt-1">Forecast Model</div>
        </div>
      </div>

      {/* Corridor Selector */}
      {data.available_corridors && (
        <Tabs value={corridor} onValueChange={setCorridor}>
          <TabsList className="bg-slate-800/60">
            {data.available_corridors.map(c => (
              <TabsTrigger key={c} value={c} className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Chart */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="congestion-chart">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-medium text-white">Congestion Forecast: {corridor}</h3>
          <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30 bg-blue-500/10">
            {data.model}
          </Badge>
        </div>
        <ResponsiveContainer height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} />
            <Area type="monotone" dataKey="conf_upper" stroke="none" fill="url(#confGrad)" />
            <Area type="monotone" dataKey="level" stroke="#ef4444" fill="url(#congGrad)" strokeWidth={2} name="Congestion" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-red-500 rounded" /> Congestion Level</div>
          <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-amber-500 rounded" style={{ borderTop: '1px dashed' }} /> High Congestion Threshold (70%)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500/10 rounded" /> Confidence Band</div>
        </div>
      </div>

      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          Forecasts are generated using the <span className="text-slate-300 font-mono">{data.model}</span> model, last trained on {data.last_trained?.split('T')[0]}.
          Confidence bands reflect model uncertainty. Predictions are corridor-level averages and may not reflect micro-level conditions.
          Data sources include official transit feeds and publicly observed traffic data.
        </p>
      </div>
    </div>
  );
}
