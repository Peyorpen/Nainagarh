import React, { useState } from 'react';
import { ViewState, AdminUser } from './types';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { Rooms } from './Rooms';
import { Banquets } from './components/Banquets';
import { Dining, DiningTab } from './components/Dining';
import { Tours } from './Tours';
import { VaranasiGuide } from './VaranasiGuide';
import { Footer } from './Footer';
import { Concierge } from './components/Concierge';
import { Gallery } from './Gallery';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { DataProvider } from './DataContext';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [initialDiningTab, setInitialDiningTab] = useState<DiningTab>('reserve');

  const handleAdminLogin = (user: AdminUser) => {
    setCurrentUser(user);
    setCurrentView(ViewState.ADMIN_DASHBOARD);
  };

  const handleAdminLogout = () => {
    setCurrentUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleNavigation = (view: ViewState) => {
    if (view === ViewState.DINING) {
        setInitialDiningTab('reserve');
    }
    setCurrentView(view);
  };

  const handleNavigateToDiningPackages = () => {
    setInitialDiningTab('packages');
    setCurrentView(ViewState.DINING);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Hero onNavigate={handleNavigation} />;
      case ViewState.ROOMS:
        return <Rooms onNavigateToDiningPackages={handleNavigateToDiningPackages} />;
      case ViewState.BANQUETS:
        return <Banquets />;
      case ViewState.DINING:
        return <Dining initialTab={initialDiningTab} />;
      case ViewState.TOURS:
        return <Tours onNavigateToGuide={() => setCurrentView(ViewState.GUIDE)} />;
      case ViewState.GUIDE:
        return <VaranasiGuide />;
      case ViewState.GALLERY:
        return <Gallery />;
      case ViewState.ADMIN_LOGIN:
        return <AdminLogin onLogin={handleAdminLogin} onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.ADMIN_DASHBOARD:
        return currentUser ? (
          <AdminDashboard user={currentUser} onLogout={handleAdminLogout} /> 
        ) : (
          <AdminLogin onLogin={handleAdminLogin} onBack={() => setCurrentView(ViewState.HOME)} />
        );
      default:
        return <Hero onNavigate={handleNavigation} />;
    }
  };

  // If in Admin mode (Login or Dashboard), we hide the standard Navigation/Footer for a focused interface
  if (currentView === ViewState.ADMIN_LOGIN || currentView === ViewState.ADMIN_DASHBOARD) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {renderView()}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation currentView={currentView} onNavigate={handleNavigation} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Concierge />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
};

export default App;
