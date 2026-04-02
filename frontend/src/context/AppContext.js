import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [demoMode, setDemoMode] = useState(true);
  const [audienceMode, setAudienceMode] = useState('executive');
  const [activeSection, setActiveSection] = useState('overview');
  const [activeModes, setActiveModes] = useState(new Set());
  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('urbanivity_theme') || 'light'
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('urbanivity_theme', theme);
  }, [theme]);

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

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{
      demoMode, setDemoMode,
      audienceMode, setAudienceMode,
      activeSection, setActiveSection,
      activeModes, toggleMode, clearModes,
      user, setUser, logout,
      theme, setTheme, toggleTheme,
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
