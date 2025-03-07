import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Info, 
  Settings, 
  LogOut
} from 'lucide-react';
import logo from '/src/components/logoMesa de trabajo 1.png';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-16 border-r border-gray-800 p-2 flex flex-col h-screen fixed left-0 top-0 bg-kuvsbook-darker">
      <div className="mb-8 mt-4 flex justify-center">
        <img 
          src={logo}
          alt="KUVS Logo" 
          className="h-8 w-auto"
        />
      </div>
      
      <nav className="flex-1 flex flex-col items-center space-y-4">
        <Link to="/" className={`sidebar-icon ${isActive('/') ? 'active' : ''}`} title="Dashboard">
          <LayoutDashboard size={20} />
        </Link>
        <Link to="/playbook" className={`sidebar-icon ${isActive('/playbook') ? 'active' : ''}`} title="Playbook">
          <BookOpen size={20} />
        </Link>
        <Link to="/calendar" className={`sidebar-icon ${isActive('/calendar') ? 'active' : ''}`} title="Calendar">
          <Calendar size={20} />
        </Link>
        <Link to="/information" className={`sidebar-icon ${isActive('/information') ? 'active' : ''}`} title="Information">
          <Info size={20} />
        </Link>
      </nav>
      
      <div className="pt-4 border-t border-gray-800 mt-4 flex flex-col items-center space-y-4">
        <Link to="/settings" className={`sidebar-icon ${isActive('/settings') ? 'active' : ''}`} title="Settings">
          <Settings size={20} />
        </Link>
        <button 
          className="sidebar-icon" 
          title="Logout"
          onClick={onLogout}
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;