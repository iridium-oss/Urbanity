import { useState, useEffect } from 'react';
import { fetchEarthObs } from '@/lib/api';
import { Globe, Thermometer, TreePine, Building2, Droplets, Wind, Lightbulb, TrendingUp, TrendingDown, Minus, Satellite } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LAYER_ICONS = {
  ndvi: TreePine, lst: Thermometer, built_up: Building2,
  water: Droplets, air_quality: Wind, nightlight: Lightbulb,
};

const TREND_ICONS = {
  stable: Minus, increasing: TrendingUp, decreasing: TrendingDown,
  seasonal: TrendingUp, improving: TrendingUp,
};

const TREND_COLORS = {
  stable: 'text-slate-400', increasing: 'text-amber-400',
  decreasing: 'text-red-400', seasonal: 'text-blue-400', improving: 'text-emerald-400',
};

export default function EarthObservation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarthObs().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="animate-pulse"><div className="bg-[#141820] rounded-xl h-64 border border-slate-800/60" /></div>;
  }

  return (
    <div className="space-y-6" data-testid="earth-observation-page">
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">Earth Observation Context</h2>
        <p className="text-sm text-slate-400 mt-1">Satellite-derived environmental and urban context for planning</p>
      </div>

      {/* Satellite Info */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5" data-testid="satellite-info">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Satellite className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-medium text-white">{data.satellite}</h3>
              <p className="text-xs text-slate-500">Earth Observation Satellite</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 ml-auto flex-wrap">
            <span>Resolution: <span className="text-slate-300">{data.resolution}</span></span>
            <span>Coverage: <span className="text-slate-300">{data.coverage}</span></span>
            <span>Last Capture: <span className="text-slate-300">{data.last_capture?.split('T')[0]}</span></span>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs">
              official
            </Badge>
          </div>
        </div>
      </div>

      {/* Layers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="eo-layers">
        {data.layers.map((layer) => {
          const Icon = LAYER_ICONS[layer.id] || Globe;
          const TrendIcon = TREND_ICONS[layer.trend] || Minus;
          const trendColor = TREND_COLORS[layer.trend] || 'text-slate-400';
          return (
            <div key={layer.id} className="bg-[#141820] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700 transition-all" data-testid={`eo-layer-${layer.id}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <Badge variant="outline" className={`text-xs ${layer.status === 'available' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                  {layer.status}
                </Badge>
              </div>
              <h3 className="font-heading text-sm font-medium text-white mb-1">{layer.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{layer.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                <div>
                  <span className="font-heading text-lg font-bold text-white">{layer.value}</span>
                  <span className="text-xs text-slate-500 ml-1">{layer.unit}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="capitalize">{layer.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Context Note */}
      <div className="bg-[#141820] border border-slate-800/60 rounded-xl p-5">
        <h3 className="font-heading text-sm font-medium text-white mb-2">About Earth Observation Data</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Earth observation data from {data.satellite} provides environmental and planning context for urban mobility decisions.
          This data is used for urban heat island analysis, green space monitoring, and urban expansion tracking.
          It is not used as real-time traffic data. Resolution is {data.resolution} with revisit periods of approximately 5 days.
          All EO data carries official provenance from the ESA Copernicus programme.
        </p>
      </div>
    </div>
  );
}
