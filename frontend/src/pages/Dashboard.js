import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Map, Route, BarChart3, AlertTriangle,
  Accessibility, Globe, Shield, BookOpen, ChevronLeft,
  Menu, Layers, Play, RotateCcw, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Overview from '@/pages/dashboard/Overview';
import TransitNetwork from '@/pages/dashboard/TransitNetwork';
import Routing from '@/pages/dashboard/Routing';
import Forecasting from '@/pages/dashboard/Forecasting';
import Alerts from '@/pages/dashboard/Alerts';
import Equity from '@/pages/dashboard/Equity';
import EarthObservation from '@/pages/dashboard/EarthObservation';
import Provenance from '@/pages/dashboard/Provenance';
import DemoGuide from '@/pages/dashboard/DemoGuide';

const SECTIONS = [
  { id: 'overview', name: 'Executive Overview', icon: LayoutDashboard },
  { id: 'transit', name: 'Transit Network', icon: Map },
  { id: 'routing', name: 'Routing Intelligence', icon: Route },
  { id: 'forecasting', name: 'Forecasting', icon: BarChart3 },
  { id: 'alerts', name: 'Alerts & Incidents', icon: AlertTriangle },
  { id: 'equity', name: 'Mobility Equity', icon: Accessibility },
  { id: 'earth-observation', name: 'Earth Observation', icon: Globe },
  { id: 'provenance', name: 'Provider Provenance', icon: Shield },
  { id: 'demo-guide', name: 'Demo Guide', icon: BookOpen },
];

const AUDIENCE_MODES = [
  { id: 'executive', name: 'Executive / Jury' },
  { id: 'b2g', name: 'B2G / Public Sector' },
  { id: 'b2b', name: 'B2B / Operator' },
  { id: 'b2c', name: 'B2C / Rider' },
  { id: 'technical', name: 'Technical / System' },
];

const VIEWS = {
  'overview': Overview,
  'transit': TransitNetwork,
  'routing': Routing,
  'forecasting': Forecasting,
  'alerts': Alerts,
  'equity': Equity,
  'earth-observation': EarthObservation,
  'provenance': Provenance,
  'demo-guide': DemoGuide,
};

export default function Dashboard() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { demoMode, setDemoMode, audienceMode, setAudienceMode, activeSection, setActiveSection } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (section && SECTIONS.find(s => s.id === section)) {
      setActiveSection(section);
    }
  }, [section, setActiveSection]);

  const handleSectionChange = (id) => {
    setActiveSection(id);
    navigate(`/dashboard/${id}`, { replace: true });
    setMobileMenuOpen(false);
  };

  const ActiveView = VIEWS[activeSection] || Overview;

  return (
    <div className="h-screen flex bg-[#0B0E14] text-slate-200 overflow-hidden" data-testid="dashboard">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-800/60 bg-[#0D1117] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`} data-testid="sidebar">
        <div className="h-14 flex items-center px-4 border-b border-slate-800/60">
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-heading font-bold text-sm text-white tracking-tight">IRIDIUM</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors" data-testid="collapse-sidebar-btn">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="mx-auto text-slate-500 hover:text-slate-300 transition-colors" data-testid="expand-sidebar-btn">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <nav className="flex-1 py-3 overflow-y-auto iridium-scroll">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                activeSection === s.id
                  ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              data-testid={`nav-${s.id}`}
            >
              <s.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              {sidebarOpen && <span className="truncate">{s.name}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Demo Mode</span>
              <Switch checked={demoMode} onCheckedChange={setDemoMode} data-testid="demo-mode-toggle" />
            </div>
            {demoMode && (
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs w-full justify-center">
                <Play className="w-3 h-3 mr-1" /> Demo Active
              </Badge>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-slate-800/60 bg-[#0D1117]/80 glass-panel flex-shrink-0" data-testid="topbar">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="mobile-menu-toggle">
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-sm text-white">IRIDIUM</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="font-heading font-semibold text-white text-sm">
                {SECTIONS.find(s => s.id === activeSection)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={audienceMode} onValueChange={setAudienceMode}>
              <SelectTrigger className="w-[180px] h-8 bg-slate-800/60 border-slate-700 text-xs text-slate-300" data-testid="audience-mode-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {AUDIENCE_MODES.map(m => (
                  <SelectItem key={m.id} value={m.id} className="text-xs text-slate-300 focus:bg-slate-800 focus:text-white">{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-8" data-testid="back-to-landing-btn">
                Landing
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 z-50 bg-[#0B0E14]/95 glass-panel" data-testid="mobile-nav-overlay">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-heading font-bold text-white">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSectionChange(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-1 ${
                    activeSection === s.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <s.icon className="w-4 h-4" strokeWidth={1.5} />
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto iridium-scroll p-4 lg:p-6" data-testid="dashboard-content">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
