import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchDemoGuide, resetDemo } from '@/lib/api';
import { BookOpen, Play, RotateCcw, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DemoGuide() {
  const { setActiveSection } = useApp();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [visited, setVisited] = useState(new Set());

  useEffect(() => {
    fetchDemoGuide().then(setGuide).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !guide) {
    return <div className="animate-pulse"><div className="bg-white dark:bg-[#141820] rounded-xl h-64 border border-slate-200 dark:border-slate-800/60" /></div>;
  }

  const handleNavigate = (section, stepIdx) => {
    setActiveSection(section);
    setVisited(prev => new Set([...prev, stepIdx]));
    setCurrentStep(stepIdx);
    window.history.replaceState(null, '', `/dashboard/${section}`);
  };

  const handleReset = async () => {
    try {
      await resetDemo();
      setVisited(new Set());
      setCurrentStep(0);
      toast.success('Demo state reset to initial configuration');
    } catch (e) {
      toast.error('Failed to reset demo');
    }
  };

  const progress = Math.round((visited.size / guide.steps.length) * 100);

  return (
    <div className="space-y-6" data-testid="demo-guide-page">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Demo Guide</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Guided walkthrough of Urbanivity capabilities</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-800 text-xs" data-testid="reset-demo-btn">
          <RotateCcw className="w-3 h-3 mr-2" /> Reset Demo
        </Button>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-[#141820] border border-slate-200 dark:border-slate-800/60 rounded-xl p-5" data-testid="demo-progress">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-700 dark:text-slate-300">Walkthrough Progress</span>
          <span className="font-mono text-sm text-blue-400">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span>{visited.size} of {guide.steps.length} sections visited</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Est. {guide.total_duration_min} min total</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3" data-testid="demo-steps">
        {guide.steps.map((step, i) => {
          const isVisited = visited.has(i);
          const isCurrent = currentStep === i;
          return (
            <div
              key={step.step}
              className={`bg-white dark:bg-[#141820] border rounded-xl p-5 transition-all ${isCurrent ? 'border-blue-500/50 ring-1 ring-blue-500/20' :
                  isVisited ? 'border-emerald-500/20' : 'border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              data-testid={`demo-step-${step.step}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVisited ? 'bg-emerald-500/10' : isCurrent ? 'bg-blue-500/10' : 'bg-white dark:bg-slate-800/60'
                  }`}>
                  {isVisited ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className="font-heading font-bold text-lg text-slate-600 dark:text-slate-400">{step.step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading text-sm font-medium text-slate-900 dark:text-white">{step.title}</h3>
                    <Badge variant="outline" className="text-xs text-slate-500 border-slate-300 dark:border-slate-700">
                      <Clock className="w-3 h-3 mr-1" />{step.duration_sec}s
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{step.description}</p>
                  <Button
                    onClick={() => handleNavigate(step.section, i)}
                    size="sm"
                    className={`text-xs ${isVisited ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-700' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                    data-testid={`navigate-to-${step.section}`}
                  >
                    {isVisited ? 'Revisit' : 'Show This'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Start Tips */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading text-sm font-medium text-blue-300 mb-2">Demo Presentation Tips</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Start with Executive Overview for the strongest first impression</li>
              <li>Use the audience mode selector in the top bar to show perspective-specific views</li>
              <li>Highlight the provenance system as a key differentiator</li>
              <li>Show the equity section to demonstrate social impact awareness</li>
              <li>End with the routing demo for a tangible user-facing feature</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
