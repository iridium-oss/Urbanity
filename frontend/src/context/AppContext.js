import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [demoMode, setDemoMode] = useState(true);
  const [audienceMode, setAudienceMode] = useState('executive');
  const [activeSection, setActiveSection] = useState('overview');
  const [activeModes, setActiveModes] = useState(new Set());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('urbanivity_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setAudienceMode(parsed.role || 'executive');
      } catch { }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('urbanivity_user');
  };

  const toggleMode = (modeId) => {
    setActiveModes(prev => {
      const next = new Set(prev);
      if (next.has(modeId)) next.delete(modeId);
      else next.add(modeId);
      return next;
    });
  };

  const clearModes = () => setActiveModes(new Set());

  return (
    <AppContext.Provider value={{
      demoMode, setDemoMode,
      audienceMode, setAudienceMode,
      activeSection, setActiveSection,
      activeModes, toggleMode, clearModes,
      user, setUser, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
