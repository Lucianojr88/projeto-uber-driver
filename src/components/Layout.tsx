import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Settings as SettingsIcon, 
  Menu, 
  X,
  Car
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onChangePage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onChangePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'records', label: 'Registros', icon: <Calendar className="h-5 w-5" /> },
    { id: 'goals', label: 'Metas', icon: <Target className="h-5 w-5" /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon className="h-5 w-5" /> }
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleNavClick = (pageId: string) => {
    onChangePage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <Car className="h-7 w-7 mr-2" />
              <h1 className="text-xl font-bold">UberTracker</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
        >
          <div className="p-4 border-b flex items-center justify-between md:justify-center">
            <h2 className="font-semibold text-lg text-blue-600">Menu</h2>
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activePage === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t text-center text-xs text-gray-500">
            UberTracker - v1.0.0
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;