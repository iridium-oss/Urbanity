import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [demoMode, setDemoMode] = useState(true);
  const [audienceMode, setAudienceMode] = useState('executive');
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <AppContext.Provider value={{
      demoMode, setDemoMode,
      audienceMode, setAudienceMode,
      activeSection, setActiveSection,
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
