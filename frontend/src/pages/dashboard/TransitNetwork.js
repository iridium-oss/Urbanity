import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchTransitNetwork } from '@/lib/api';
import MapComponent from '@/components/MapComponent';
import { Train, Bus, Users, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TransitNetwork() {
  const { activeModes } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransitNetwork().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="animate-pulse"><div className="bg-[#141820] rounded-xl h-96 border border-slate-800/60" /></div>;
  }

  const filteredLines = (filter === 'all' ? data.lines : data.lines.filter(l => {
    if (filter === 'active') return l.status === 'active';
    if (filter === 'planned') return l.status === 'planned';
    return l.mode === filter;
  })).filter(l => activeModes.size === 0 || activeModes.has(l.mode));

  return (
    <div className="space-y-6" data-testid="transit-network-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Transit Network</h2>
        <p className="text-sm text-slate-400 mt-1">Metro lines, bus routes, and station coverage across Baku</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Train, label: 'Metro Lines', value: data.lines.filter(l => l.mode === 'metro').length, color: 'text-red-400' },
          { icon: MapPin, label: 'Total Stations', value: data.total_stations, color: 'text-blue-400' },
          { icon: Bus, label: 'Bus Routes', value: data.total_routes, color: 'text-emerald-400' },
          { icon: Users, label: 'Daily Ridership', value: `${(data.daily_ridership / 1000000).toFixed(1)}M`, color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#141820] border border-slate-800/60 rounded-xl p-4">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} strokeWidth={1.5} />
            <div className="font-heading text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map + Line Details */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#141820] border border-slate-800/60 rounded-xl overflow-hidden" data-testid="transit-map">
          <MapComponent lines={filteredLines} height="450px" dark={true} zoom={12} />
        </div>
        <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5 overflow-y-auto urbanivity-scroll" style={{ maxHeight: '450px' }} data-testid="transit-lines-panel">
          <h3 className="font-heading text-sm font-medium text-white mb-4">Transit Lines</h3>
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="bg-slate-800/60 flex-wrap h-auto gap-0.5 p-1">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="metro" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Metro</TabsTrigger>
              <TabsTrigger value="bus" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Bus</TabsTrigger>
              <TabsTrigger value="minibus" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Minibus</TabsTrigger>
              <TabsTrigger value="bicycle" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Bicycle</TabsTrigger>
              <TabsTrigger value="shuttle" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Shuttle</TabsTrigger>
              <TabsTrigger value="planned" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Planned</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-3">
            {filteredLines.map((line) => (
              <div key={line.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/40 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                  <span className="font-heading font-medium text-white text-sm">{line.name}</span>
                  <Badge variant="outline" className={`text-xs ml-auto ${line.status === 'active' ? 'text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-slate-600'}`}>
                    {line.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{line.stations} stops</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{line.frequency_min > 0 ? `Every ${line.frequency_min} min` : 'Open'}</div>
                  <div>Length: {line.length_km} km</div>
                  <div>{line.fare_azn > 0 ? `${line.fare_azn.toFixed(2)} AZN` : 'Free'}</div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant="outline" className={`text-xs ${line.mode === 'metro' ? 'text-red-400 border-red-500/20' : line.mode === 'bus' ? 'text-blue-400 border-blue-500/20' : line.mode === 'minibus' ? 'text-purple-400 border-purple-500/20' : line.mode === 'bicycle' ? 'text-cyan-400 border-cyan-500/20' : 'text-pink-400 border-pink-500/20'}`}>
                    {line.mode}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                    {line.provenance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
