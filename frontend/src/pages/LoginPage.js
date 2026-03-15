import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  Layers, Crown, Building2, Server, Smartphone, Code,
  ArrowRight, ChevronRight, Shield, Mail, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROLE_ICONS = { executive: Crown, b2g: Building2, b2b: Server, b2c: Smartphone, technical: Code };

const ROLE_DETAILS = {
  executive: {
    sections: ['Executive Overview', 'Routing Intelligence', 'Mobility Equity', 'Demo Guide'],
    focus: 'Strongest summary, proof points, and visual impact',
  },
  b2g: {
    sections: ['Executive Overview', 'Transit Network', 'Alerts', 'Mobility Equity', 'Earth Observation', 'Provenance'],
    focus: 'Resilience, equity, public transport access, digital twin completeness',
  },
  b2b: {
    sections: ['Executive Overview', 'Transit Network', 'Routing', 'Forecasting', 'Alerts', 'Provenance'],
    focus: 'Operational dashboard, route insight, alert management, integration surfaces',
  },
  b2c: {
    sections: ['Executive Overview', 'Routing Intelligence', 'Alerts', 'Mobility Equity'],
    focus: 'Trip understanding, route clarity, service alerts, accessibility',
  },
  technical: {
    sections: ['Executive Overview', 'Transit Network', 'Forecasting', 'Earth Observation', 'Provenance', 'Demo Guide'],
    focus: 'Providers, provenance, forecast status, API readiness, system health',
  },
};

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setAudienceMode } = useApp();
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/auth/roles`).then(r => setRoles(r.data)).catch(() => {
      setRoles([
        { id: 'executive', name: 'Executive / Jury', description: 'Strategic overview', icon: 'Crown', color: '#f59e0b' },
        { id: 'b2g', name: 'B2G / Public Sector', description: 'Public transport access and equity', icon: 'Building2', color: '#3b82f6' },
        { id: 'b2b', name: 'B2B / Operator', description: 'Operational dashboard and alerts', icon: 'Server', color: '#8b5cf6' },
        { id: 'b2c', name: 'B2C / Rider', description: 'Trip planning and navigation', icon: 'Smartphone', color: '#10b981' },
        { id: 'technical', name: 'Technical / System', description: 'System health and provenance', icon: 'Code', color: '#ef4444' },
      ]);
    });
  }, []);

  const handleLogin = async () => {
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!selectedRole) { setError('Please select a dashboard perspective'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { name, email, role: selectedRole });
      const userData = res.data;
      setUser(userData);
      setAudienceMode(selectedRole);
      localStorage.setItem('iridium_user', JSON.stringify(userData));
      navigate('/dashboard/overview');
    } catch (e) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const details = selectedRole ? ROLE_DETAILS[selectedRole] : null;

  return (
    <div className="min-h-screen bg-[#0B0E14] flex" data-testid="login-page">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-[#0D1117] to-[#0B0E14]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-orange-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-2xl text-white tracking-tight">IRIDIUM</span>
          </Link>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight mb-6">
            Urban Mobility<br />Intelligence Platform
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md font-light">
            Provenance-aware multimodal mobility intelligence for Azerbaijani cities.
            Select your perspective to access the dashboard tailored to your needs.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Source-transparent data with full provenance chain</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>14 mobility modes, 13 data providers, 12 districts</span>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div {...fadeUp} className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-lg text-white tracking-tight">IRIDIUM</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-white mb-2">Access Dashboard</h2>
          <p className="text-sm text-slate-400 mb-8">Enter your details and select a dashboard perspective</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-sm text-red-400" data-testid="login-error">
              {error}
            </div>
          )}

          {/* Name & Email */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 block">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-[#141820] border-slate-700 text-white pl-10 h-11 focus:border-blue-500 focus:ring-blue-500/20"
                  data-testid="login-name-input"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  className="bg-[#141820] border-slate-700 text-white pl-10 h-11 focus:border-blue-500 focus:ring-blue-500/20"
                  data-testid="login-email-input"
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <label className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-3 block">Dashboard Perspective</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6" data-testid="role-selector">
            {roles.map((role) => {
              const Icon = ROLE_ICONS[role.id] || Crown;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left rounded-xl p-4 border transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20'
                      : 'border-slate-800 bg-[#141820] hover:border-slate-600'
                  }`}
                  data-testid={`role-${role.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${role.color}15`, border: `1px solid ${role.color}30` }}>
                      <Icon className="w-4 h-4" style={{ color: role.color }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-sm font-medium text-white truncate">{role.name}</div>
                      <div className="text-xs text-slate-500 truncate">{role.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Role Details */}
          {details && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#141820] border border-slate-800 rounded-xl p-4 mb-6"
              data-testid="role-details"
            >
              <p className="text-xs text-slate-500 mb-2">Highlighted sections for this perspective:</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {details.sections.map(s => (
                  <Badge key={s} variant="outline" className="text-xs text-blue-400 border-blue-500/30 bg-blue-500/5">{s}</Badge>
                ))}
              </div>
              <p className="text-xs text-slate-400">{details.focus}</p>
            </motion.div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg h-12 text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
            data-testid="login-submit-btn"
          >
            {loading ? 'Entering...' : 'Enter Dashboard'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Back to Landing Page
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
