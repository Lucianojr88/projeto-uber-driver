import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import Goals from './components/Goals';
import Settings from './components/Settings';

// Import the uuid library
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Render the active page component
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'records':
        return <Records />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout activePage={activePage} onChangePage={setActivePage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;