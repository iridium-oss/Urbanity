import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { fetchMobilityModes } from '@/lib/api';
import {
  LayoutDashboard, Map, Route, BarChart3, AlertTriangle,
  Accessibility, Globe, Shield, BookOpen, ChevronLeft,
  Menu, Layers, Play, ChevronRight, LogOut, X,
  Footprints, Bike, Zap, CircleDot, Car, Navigation,
  Train, Bus, Truck, Users, Repeat, Code,
  Crown, Building2, Server, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Overview from '@/pages/dashboard/Overview';
import TransitNetwork from '@/pages/dashboard/TransitNetwork';
import Routing from '@/pages/dashboard/Routing';
import Forecasting from '@/pages/dashboard/Forecasting';
import Alerts from '@/pages/dashboard/Alerts';
import Equity from '@/pages/dashboard/Equity';
import EarthObservation from '@/pages/dashboard/EarthObservation';
import Provenance from '@/pages/dashboard/Provenance';
import DemoGuide from '@/pages/dashboard/DemoGuide';
import ModeDetailPanel from '@/components/ModeDetailPanel';

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

const ROLE_ICONS = { executive: Crown, b2g: Building2, b2b: Server, b2c: Smartphone, technical: Code };

const MODE_ICON_MAP = {
  walking: Footprints, wheelchair: Accessibility, bicycle: Bike, e_bike: Zap,
  scooter: CircleDot, e_scooter: Zap, private_car: Car, taxi: Navigation,
  metro: Train, bus: Bus, minibus: Truck, shuttle: Bus,
  park_and_ride: Repeat, shared_mobility: Users,
};

const VIEWS = {
  'overview': Overview, 'transit': TransitNetwork, 'routing': Routing,
  'forecasting': Forecasting, 'alerts': Alerts, 'equity': Equity,
  'earth-observation': EarthObservation, 'provenance': Provenance, 'demo-guide': DemoGuide,
};

const MobilityModeBar = ({ modes, activeModes, toggleMode, clearModes, onModeDetail }) => {
  if (!modes.length) return null;
  const hasActive = activeModes.size > 0;
  return (
    <div className="flex items-center gap-2 px-4 lg:px-6 py-2.5 border-b border-slate-800/40 bg-[#0D1117]/60 overflow-x-auto urbanivity-scroll" data-testid="mobility-mode-bar">
      <span className="text-xs text-slate-500 font-mono uppercase tracking-wider whitespace-nowrap mr-1">Modes:</span>
      {hasActive && (
        <button onClick={clearModes} className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-md px-2 py-1 whitespace-nowrap transition-colors" data-testid="clear-modes-btn">
          Clear all
        </button>
      )}
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-1.5">
          {modes.map((mode) => {
            const Icon = MODE_ICON_MAP[mode.id] || CircleDot;
            const isActive = activeModes.has(mode.id);
            const statusDot = mode.status === 'active' ? 'bg-emerald-500' : mode.status === 'limited' ? 'bg-amber-500' : mode.status === 'emerging' ? 'bg-blue-500' : 'bg-slate-500';
            return (
              <Tooltip key={mode.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      const wasActive = activeModes.has(mode.id);
                      toggleMode(mode.id);
                      if (!wasActive) {
                        onModeDetail && onModeDetail(mode.id);
                      } else {
                        onModeDetail && onModeDetail(null);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 border ${isActive
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : hasActive
                        ? 'bg-transparent border-slate-800/40 text-slate-600 hover:text-slate-400 hover:border-slate-700'
                        : 'bg-[#141820] border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    data-testid={`mode-filter-${mode.id}`}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="hidden xl:inline">{mode.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-xs">
                  <p className="font-medium text-white">{mode.name}</p>
                  <p className="text-slate-400">{mode.description}</p>
                  <p className="text-slate-500 mt-1">Status: {mode.status} / Source: {mode.provenance.replace(/_/g, ' ')}</p>
                  <p className="text-slate-600 mt-0.5 italic">Click to filter and view details</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default function Dashboard() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { demoMode, setDemoMode, audienceMode, setAudienceMode, activeSection, setActiveSection, activeModes, toggleMode, clearModes, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilityModes, setMobilityModes] = useState([]);
  const [detailMode, setDetailMode] = useState(null);

  useEffect(() => {
    fetchMobilityModes().then(setMobilityModes).catch(console.error);
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ActiveView = VIEWS[activeSection] || Overview;
  const RoleIcon = ROLE_ICONS[user?.role] || Crown;

  return (
    <div className="h-screen flex bg-[#0B0E14] text-slate-200 overflow-hidden" data-testid="dashboard">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-800/60 bg-[#0D1117] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`} data-testid="sidebar">
        <div className="h-14 flex items-center px-4 border-b border-slate-800/60">
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="flex items-center gap-2">
                <img src="/assets/urbanivity-logo.png" alt="Urbanivity" className="w-12 h-12" />
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
        <nav className="flex-1 py-3 overflow-y-auto urbanivity-scroll">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${activeSection === s.id
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
          <div className="p-3 border-t border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Demo Mode</span>
              <Switch checked={demoMode} onCheckedChange={setDemoMode} data-testid="demo-mode-toggle" />
            </div>
            {demoMode && (
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs w-full justify-center">
                <Play className="w-3 h-3 mr-1" /> Demo Active
              </Badge>
            )}
            {/* User Info */}
            {user && (
              <div className="pt-2 border-t border-slate-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                    <RoleIcon className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user.role_name}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors w-full px-1" data-testid="logout-btn">
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
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
              <img src="/assets/urbanivity-logo.png" alt="Urbanivity" className="w-10 h-10" />
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
            {user && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-3">
                <RoleIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="truncate max-w-[100px]">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Mobility Mode Selector Bar */}
        <MobilityModeBar modes={mobilityModes} activeModes={activeModes} toggleMode={toggleMode} clearModes={clearModes} onModeDetail={setDetailMode} />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#0B0E14]/95 glass-panel" data-testid="mobile-nav-overlay">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-heading font-bold text-white">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {user && (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/40">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                    <RoleIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.role_name}</div>
                  </div>
                </div>
              )}
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSectionChange(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-1 ${activeSection === s.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50'
                    }`}
                >
                  <s.icon className="w-4 h-4" strokeWidth={1.5} />
                  {s.name}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 mt-4" data-testid="mobile-logout-btn">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto urbanivity-scroll p-4 lg:p-6" data-testid="dashboard-content">
          {detailMode && <ModeDetailPanel modeId={detailMode} onClose={() => setDetailMode(null)} />}
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
