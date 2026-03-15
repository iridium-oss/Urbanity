import { useState, useEffect } from 'react';
import { fetchEquity } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Accessibility, MapPin, Bus, Train, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d?.name}</p>
      <p className="text-xs text-slate-400">Mobility Score: {d?.mobility_score}</p>
      <p className="text-xs text-slate-400">Equity Index: {d?.equity_index}</p>
      <p className="text-xs text-slate-400">Wheelchair Stops: {d?.wheelchair_accessible_stops}</p>
      <p className="text-xs text-slate-400">Population: {d?.population?.toLocaleString()}</p>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  if (score >= 25) return '#f97316';
  return '#ef4444';
};

export default function Equity() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquity().then(setDistricts).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse"><div className="bg-[#141820] rounded-xl h-64 border border-slate-800/60" /></div>;
  }

  const sorted = [...districts].sort((a, b) => b.mobility_score - a.mobility_score);
  const avgScore = Math.round(districts.reduce((s, d) => s + d.mobility_score, 0) / districts.length);
  const avgEquity = (districts.reduce((s, d) => s + d.equity_index, 0) / districts.length).toFixed(2);
  const totalWheelchairStops = districts.reduce((s, d) => s + d.wheelchair_accessible_stops, 0);
  const underserved = districts.filter(d => d.mobility_score < 50);

  return (
    <div className="space-y-6" data-testid="equity-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Mobility Equity & Accessibility</h2>
        <p className="text-sm text-slate-400 mt-1">District-level comparison of mobility access, equity, and wheelchair accessibility</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MapPin, label: 'Avg Mobility Score', value: avgScore, color: 'text-blue-400' },
          { icon: Users, label: 'Avg Equity Index', value: avgEquity, color: 'text-emerald-400' },
          { icon: Accessibility, label: 'Wheelchair Stops', value: totalWheelchairStops, color: 'text-purple-400' },
          { icon: AlertTriangle, label: 'Underserved Districts', value: underserved.length, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} strokeWidth={1.5} />
            <div className="font-heading text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mobility Score Chart */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="equity-chart">
        <h3 className="font-heading text-sm font-medium text-white mb-4">District Mobility Scores</h3>
        <ResponsiveContainer height={300}>
          <BarChart data={sorted} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mobility_score" radius={[0, 4, 4, 0]} barSize={16}>
              {sorted.map((d, i) => <Cell key={i} fill={getScoreColor(d.mobility_score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* District Detail Table */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl overflow-hidden" data-testid="equity-table">
        <div className="p-5 border-b border-slate-800/40">
          <h3 className="font-heading text-sm font-medium text-white">District Accessibility Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/40 text-xs text-slate-500 font-mono uppercase tracking-wider">
                <th className="text-left p-4">District</th>
                <th className="text-right p-4">Population</th>
                <th className="text-right p-4">Metro</th>
                <th className="text-right p-4">Bus Routes</th>
                <th className="text-right p-4 whitespace-nowrap">Wheelchair Stops</th>
                <th className="text-right p-4 whitespace-nowrap">Avg Transit (min)</th>
                <th className="text-right p-4">Score</th>
                <th className="text-right p-4">Equity</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.id} className="border-b border-slate-800/20 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-white font-medium">{d.name}</td>
                  <td className="p-4 text-right text-slate-400">{d.population.toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-400">{d.metro_stations}</td>
                  <td className="p-4 text-right text-slate-400">{d.bus_routes}</td>
                  <td className="p-4 text-right">
                    <Badge variant="outline" className={`text-xs ${d.wheelchair_accessible_stops > 10 ? 'text-emerald-400 border-emerald-500/30' : d.wheelchair_accessible_stops > 5 ? 'text-amber-400 border-amber-500/30' : 'text-red-400 border-red-500/30'}`}>
                      {d.wheelchair_accessible_stops}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-slate-400">{d.avg_transit_time_min}</td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-medium" style={{ color: getScoreColor(d.mobility_score) }}>{d.mobility_score}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-xs" style={{ color: getScoreColor(d.equity_index * 100) }}>{d.equity_index.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5" data-testid="equity-insight">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading text-sm font-medium text-amber-300 mb-1">Underserved Districts Identified</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {underserved.map(d => d.name).join(', ')} have mobility scores below 50, indicating limited transit access,
              fewer wheelchair-accessible stops, and longer average travel times. These districts should be prioritized for infrastructure
              investment and service expansion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
