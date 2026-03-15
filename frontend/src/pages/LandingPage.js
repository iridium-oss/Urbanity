import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, MapPin, Shield, BarChart3, Route, AlertTriangle,
  Accessibility, Globe, Users, Building2, Smartphone, Train, Bus,
  Car, Bike, Footprints, Navigation, Truck, Eye, CheckCircle2,
  Clock, ArrowRight, Activity, Zap, CircleDot, ParkingSquare,
  Menu, X, Star, Target, TrendingUp, Database, Lock, Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };
const fadeIn = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5 } };

const PROVENANCE_LABELS = {
  official: { label: 'Official', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  official_alerts_only: { label: 'Alerts Only', color: 'bg-lime-100 text-lime-700 border-lime-200' },
  public_web_observed: { label: 'Web Observed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  public_undocumented: { label: 'Undocumented', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  licensed_partner: { label: 'Licensed', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  configuration_required: { label: 'Config Needed', color: 'bg-red-100 text-red-700 border-red-200' },
  permission_required: { label: 'Permission Needed', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  unavailable: { label: 'Unavailable', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  stale: { label: 'Stale', color: 'bg-orange-100 text-orange-700 border-orange-200' },
};

const MODE_ICONS = {
  walking: Footprints, wheelchair: Accessibility, bicycle: Bike, e_bike: Zap,
  scooter: CircleDot, e_scooter: Zap, private_car: Car, taxi: Navigation,
  metro: Train, bus: Bus, minibus: Truck, shuttle: Bus, park_and_ride: Route,
  shared_mobility: Users,
};

const MODES = [
  { id: 'walking', name: 'Walking', status: 'active' },
  { id: 'wheelchair', name: 'Wheelchair', status: 'active' },
  { id: 'bicycle', name: 'Bicycle', status: 'limited' },
  { id: 'e_bike', name: 'E-Bike', status: 'emerging' },
  { id: 'scooter', name: 'Scooter', status: 'limited' },
  { id: 'e_scooter', name: 'E-Scooter', status: 'emerging' },
  { id: 'private_car', name: 'Private Car', status: 'active' },
  { id: 'taxi', name: 'Taxi', status: 'active' },
  { id: 'metro', name: 'Metro', status: 'active' },
  { id: 'bus', name: 'Bus', status: 'active' },
  { id: 'minibus', name: 'Minibus', status: 'active' },
  { id: 'shuttle', name: 'Shuttle', status: 'limited' },
  { id: 'park_and_ride', name: 'Transfer / Multimodal', status: 'active' },
  { id: 'shared_mobility', name: 'Future Shared Mobility', status: 'planned' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${scrolled ? 'bg-white/90 glass-panel border-b border-slate-200/50 shadow-sm' : 'bg-transparent'}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/urbanivity-logo.png" alt="Urbanivity" className="w-[180px]" />
          <Logo size={44} hideText />
        </Link>
        <div className="hidden md:flex items-center gap-8 mx-[20px]">
          <a href="#vision" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Vision</a>
          <a href="#modules" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Modules</a>
          <a href="#provenance" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Trust</a>
          <a href="#business" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Business</a>
          <a href="#team" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Team</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button data-testid="launch-dashboard-btn" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-medium shadow-lg shadow-blue-600/20">
              Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} data-testid="mobile-menu-btn">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <a href="#vision" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Vision</a>
          <a href="#modules" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Modules</a>
          <a href="#provenance" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Trust</a>
          <a href="#business" className="block text-sm text-slate-600" onClick={() => setMobileOpen(false)}>Business</a>
          <Link to="/login" className="block">
            <Button data-testid="mobile-dashboard-btn" className="w-full bg-blue-600 text-white rounded-lg text-sm">Launch Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden" data-testid="hero-section">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-slate-50" />
    <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-3xl" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="max-w-4xl">
        <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs uppercase tracking-widest">
          Urban Mobility Intelligence
        </Badge>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Making city movement<br />
          <span className="text-blue-600">understandable, equitable,</span><br />
          and trustworthy
        </h1>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8 font-light">
          Urbanivity is a provenance-aware multimodal mobility intelligence platform for Azerbaijani cities.
          Built for Baku. Designed for every mode of movement, including wheelchair mobility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login">
            <Button data-testid="hero-dashboard-btn" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 text-base font-medium shadow-lg shadow-blue-600/20 transition-all">
              Explore the Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href="#vision">
            <Button data-testid="hero-learn-btn" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg px-8 py-3 text-base transition-all">
              Learn More
            </Button>
          </a>
        </div>
      </motion.div>
      <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
        {[
          { n: '14', l: 'Mobility Modes' }, { n: '13', l: 'Data Providers' },
          { n: '12', l: 'Districts Covered' }, { n: '2.8M', l: 'Daily Trips' }
        ].map((s) => (
          <div key={s.l} className="bg-white/80 glass-panel rounded-xl border border-slate-200/60 p-4 text-center">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">{s.n}</div>
            <div className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Vision = () => (
  <section id="vision" className="py-24 sm:py-32 bg-white" data-testid="vision-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp}>
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">The Vision</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-6">
            Why Azerbaijan needs integrated mobility intelligence now
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Baku is a growing city with increasingly complex urban movement patterns. Public transport, taxis, private cars, walking,
              and emerging micro-mobility options all compete for space and attention, but no single system connects them.
            </p>
            <p>
              Transport information is fragmented across operators, platforms, and formats. Riders cannot compare options.
              Planners cannot see the full picture. Operators work in isolation. Decision-makers lack transparent, source-aware data.
            </p>
            <p>
              Urbanivity treats mobility as one connected system. Every mode, from walking and wheelchair mobility to metro and ride-hailing,
              is part of a unified intelligence layer where every data point carries its provenance.
            </p>
          </div>
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-4">
          {[
            { icon: Activity, title: 'Growing urban complexity', desc: 'Rapid population growth and urban expansion outpace transport planning capacity.' },
            { icon: Database, title: 'Fragmented information', desc: 'No unified view of mobility across all modes and operators.' },
            { icon: Accessibility, title: 'Inclusive mobility gaps', desc: 'Wheelchair users and mobility-impaired citizens lack route confidence.' },
            { icon: Shield, title: 'Trust deficit', desc: 'No transparency about where transport data comes from or how fresh it is.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-heading font-medium text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const MultimodalSection = () => (
  <section className="py-24 sm:py-32 bg-slate-50" data-testid="multimodal-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">Complete Mobility Coverage</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
          Every mode of movement, one platform
        </h2>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-light">
          Urbanivity supports 14 mobility modes: walking, wheelchair mobility, bicycle, e-bike, scooter, e-scooter,
          private car, taxi and ride-hailing, metro, bus, minibus, shuttle, transfer-based multimodal journeys,
          and future shared mobility. This is not just another transit app.
        </p>
      </motion.div>
      <motion.div {...fadeIn} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {MODES.map((mode) => {
          const Icon = MODE_ICONS[mode.id] || CircleDot;
          const statusColor = mode.status === 'active' ? 'text-emerald-600 bg-emerald-50' : mode.status === 'limited' ? 'text-amber-600 bg-amber-50' : mode.status === 'emerging' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50';
          return (
            <div key={mode.id} className="group bg-white rounded-xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all duration-300 text-center">
              <div className={`w-12 h-12 rounded-xl ${statusColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-medium text-sm text-slate-900 mb-1">{mode.name}</h3>
              <span className={`text-xs font-mono uppercase tracking-wider ${mode.status === 'active' ? 'text-emerald-600' : mode.status === 'limited' ? 'text-amber-600' : mode.status === 'emerging' ? 'text-blue-600' : 'text-slate-400'}`}>
                {mode.status}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-24 sm:py-32 bg-white" data-testid="how-it-works-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">How It Works</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          From fragmented data to unified intelligence
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { step: '01', title: 'Aggregate', icon: Database, desc: 'Collect data from official feeds, licensed partners, public observations, and satellite imagery. Every source is tagged with its provenance.' },
          { step: '02', title: 'Analyze', icon: BarChart3, desc: 'Process multimodal routing, congestion forecasting, equity analysis, and anomaly detection across all mobility modes and districts.' },
          { step: '03', title: 'Activate', icon: Target, desc: 'Deliver intelligence to public sector planners, transit operators, and riders through dashboards, APIs, and mobile-ready interfaces.' },
        ].map((item) => (
          <motion.div key={item.step} {...fadeUp} className="relative bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-100 transition-all">
            <span className="font-mono text-5xl font-bold text-slate-100 absolute top-4 right-6">{item.step}</span>
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
              <item.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SourceTrust = () => (
  <section id="provenance" className="py-24 sm:py-32 bg-slate-900 text-white" data-testid="provenance-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-400 mb-4">Source Trust & Provenance</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Every data point tells you where it came from
        </h2>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light">
          Unlike opaque mobility platforms, Urbanivity makes source transparency a core feature.
          Every metric, alert, and route carries a provenance tag.
        </p>
      </motion.div>
      <motion.div {...fadeIn} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {Object.entries(PROVENANCE_LABELS).map(([key, { label }]) => {
          const colors = {
            official: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
            official_alerts_only: 'border-lime-500/30 bg-lime-500/10 text-lime-400',
            public_web_observed: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
            public_undocumented: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
            licensed_partner: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
            configuration_required: 'border-red-500/30 bg-red-500/10 text-red-400',
            permission_required: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
            unavailable: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
            stale: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
          };
          return (
            <div key={key} className={`rounded-xl border p-4 ${colors[key]}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full pulse-dot`} style={{ backgroundColor: 'currentColor' }} />
                <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {key === 'official' && 'Government or operator-provided data'}
                {key === 'official_alerts_only' && 'Official source, alerts channel only'}
                {key === 'public_web_observed' && 'Publicly observable web data'}
                {key === 'public_undocumented' && 'Community-observed, not official'}
                {key === 'licensed_partner' && 'Licensed commercial API access'}
                {key === 'configuration_required' && 'Integration ready, needs setup'}
                {key === 'permission_required' && 'Requires authorization to access'}
                {key === 'unavailable' && 'Data source not currently available'}
                {key === 'stale' && 'Data older than expected freshness'}
              </p>
            </div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

const Modules = () => (
  <section id="modules" className="py-24 sm:py-32 bg-white" data-testid="modules-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">Product Modules</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          A complete intelligence toolkit
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Route, title: 'Multimodal Routing', desc: 'Compare journeys across walking, transit, taxi, and cycling with time, cost, emissions, and accessibility scores.', color: 'bg-blue-50 text-blue-600' },
          { icon: TrendingUp, title: 'Congestion Forecasting', desc: 'Predict corridor-level congestion with machine learning models. Transparent confidence intervals.', color: 'bg-emerald-50 text-emerald-600' },
          { icon: AlertTriangle, title: 'Alerts & Incidents', desc: 'Official alerts, observed disruptions, and anomaly detection with clear provenance for every alert.', color: 'bg-amber-50 text-amber-600' },
          { icon: Accessibility, title: 'Mobility Equity', desc: 'District-level access comparison, wheelchair accessibility scoring, and intermodal gap analysis.', color: 'bg-purple-50 text-purple-600' },
          { icon: Globe, title: 'Earth Observation', desc: 'Satellite-derived environmental context: vegetation, temperature, urban density, and air quality proxies.', color: 'bg-cyan-50 text-cyan-600' },
          { icon: Shield, title: 'Provider Provenance', desc: 'Full transparency into every data source: status, freshness, reliability, and trust classification.', color: 'bg-orange-50 text-orange-600' },
        ].map((mod) => (
          <motion.div key={mod.title} {...fadeUp} className="group bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl ${mod.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <mod.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-lg font-semibold text-slate-900 mb-2">{mod.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const BusinessSection = () => (
  <section id="business" className="py-24 sm:py-32 bg-slate-50" data-testid="business-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">Business Model</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Built for governments, operators, and riders
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            segment: 'B2G', subtitle: 'Public Sector', icon: Building2, items: [
              'City-wide mobility dashboard', 'Equity and accessibility analytics', 'Resilience and service visibility',
              'Digital twin completeness', 'On-premise / sovereign deployment', 'Planning decision support'
            ]
          },
          {
            segment: 'B2B', subtitle: 'Operators', icon: Server, items: [
              'Operational status dashboard', 'Route-level performance insight', 'Alert management system',
              'Stop and station analytics', 'Integration API surfaces', 'White-label deployment option'
            ]
          },
          {
            segment: 'B2C', subtitle: 'Riders', icon: Smartphone, items: [
              'Multimodal trip planning', 'Source confidence indicators', 'Service disruption alerts',
              'Accessibility-aware routing', 'Real observed arrivals', 'Cost and time comparison'
            ]
          },
        ].map((b) => (
          <motion.div key={b.segment} {...fadeUp} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-mono text-xs">{b.segment}</Badge>
                <p className="text-sm text-slate-500 mt-0.5">{b.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {b.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Roadmap = () => (
  <section className="py-24 sm:py-32 bg-white" data-testid="roadmap-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">Roadmap</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          From Baku to the region
        </h2>
      </motion.div>
      <div className="max-w-3xl mx-auto space-y-0">
        {[
          { phase: 'Phase 1', title: 'Baku Core', period: 'Q1 2026', status: 'active', items: ['Official transit feeds integration', 'Multimodal routing engine', 'Provenance framework', 'Dashboard MVP with 9 modules'] },
          { phase: 'Phase 2', title: 'Intelligence Layer', period: 'Q2-Q3 2026', status: 'next', items: ['Congestion forecasting refinement', 'Anomaly detection system', 'Earth observation integration', 'Equity analytics expansion'] },
          { phase: 'Phase 3', title: 'Partner & Scale', period: 'Q4 2026', status: 'planned', items: ['Ride-hailing API integrations', 'Micro-mobility partners', 'B2G pilot deployments', 'Mobile-ready interfaces'] },
          { phase: 'Phase 4', title: 'Regional Expansion', period: '2027', status: 'planned', items: ['Ganja, Sumgait coverage', 'White-label platform', 'API marketplace', 'On-premise deployments'] },
        ].map((r, i) => (
          <motion.div key={r.phase} {...fadeUp} className="relative flex gap-6 pb-12 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 ${r.status === 'active' ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`} />
              {i < 3 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
            </div>
            <div className="flex-1 -mt-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-heading font-semibold text-slate-900">{r.phase}: {r.title}</span>
                <Badge variant="outline" className={`font-mono text-xs ${r.status === 'active' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-slate-400 border-slate-200'}`}>{r.period}</Badge>
              </div>
              <ul className="space-y-1">
                {r.items.map((item) => (
                  <li key={item} className="text-sm text-slate-500 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'active' ? 'bg-blue-400' : 'bg-slate-300'}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const WUFSection = () => (
  <section className="py-24 sm:py-32 bg-blue-600 text-white" data-testid="wuf-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp}>
          <p className="font-mono text-xs uppercase tracking-widest text-blue-200 mb-4">Global Alignment</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            Aligned with WUF13 and sustainable urban development goals
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6 font-light">
            The World Urban Forum 13 in Cairo emphasized resilient, inclusive, and sustainable cities.
            Urbanivity directly supports these goals by making urban mobility transparent, accessible, and equitable.
          </p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
          {[
            { title: 'Inclusive Access', desc: 'Wheelchair-aware routing and accessibility scoring for all stations' },
            { title: 'Transparent Data', desc: 'Every data point carries provenance, building public trust' },
            { title: 'Resilient Systems', desc: 'Alert propagation and anomaly detection for service continuity' },
            { title: 'Equitable Planning', desc: 'District-level equity indices for evidence-based planning' },
          ].map((item) => (
            <div key={item.title} className="bg-white/10 glass-panel rounded-xl p-5 border border-white/10">
              <h3 className="font-heading font-medium text-white mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-blue-100 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const TeamSection = () => (
  <section id="team" className="py-24 sm:py-32 bg-slate-50" data-testid="team-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-4">Team</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Built by people who understand the problem
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {[
          { name: 'Olaf Yunus Laitinen Imanov', role: 'AI Engineer', focus: 'Architecting the digital twin logic and forecasting models.' },
          { name: 'Amina Sadiqzade', role: 'Frontend Developer', focus: 'Building the institutional dashboard and accessibility interfaces.' },
          { name: 'Malahat Ismayilova', role: 'AI Engineer', focus: 'Leading source-status verification and anomaly detection.' },
          { name: 'Aslan Ibadullayev', role: 'Frontend Developer', focus: 'Engineering the B2C utility and multimodal routing displays.' },
          { name: 'Fidan Bagirova', role: 'AI Engineer', focus: 'Designing the future federated learning pathways.' },
        ].map((member) => (
          <motion.div key={member.name} {...fadeUp} className="bg-white rounded-2xl p-6 border border-slate-100 text-center hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-semibold text-slate-900">{member.name}</h3>
            <p className="text-sm text-blue-600 font-medium mb-2">{member.role}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{member.focus}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 sm:py-32 bg-slate-900" data-testid="cta-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div {...fadeUp}>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
          See Urbanivity in action
        </h2>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8 font-light">
          Explore the full dashboard with real Baku mobility data, multimodal routing, equity analytics, and source-aware intelligence.
        </p>
        <Link to="/login">
          <Button data-testid="cta-dashboard-btn" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-10 py-4 text-base font-medium shadow-lg shadow-blue-600/30 transition-all">
            Launch the Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 py-12 border-t border-slate-800" data-testid="footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="font-heading font-bold text-white tracking-tight">Urbanivity</span>
        </div>
        <p className="text-sm text-slate-500">Multimodal Urban Mobility Intelligence for Azerbaijan</p>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>Baku, Azerbaijan</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-body" data-testid="landing-page">
      <Navbar />
      <Hero />
      <Vision />
      <MultimodalSection />
      <HowItWorks />
      <SourceTrust />
      <Modules />
      <WUFSection />
      <BusinessSection />
      <Roadmap />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
}
