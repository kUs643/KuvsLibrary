import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, BarChart2, Bell, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1E1A25]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          kuvsbook
        </Link>
        
        {/* Navigation Icons */}
        <div className="flex items-center space-x-6">
          <Link to="/" className={`nav-icon ${isActive('/') ? 'text-[#802BB1]' : 'text-gray-400 hover:text-white'}`}>
            <Home size={20} />
          </Link>
          <Link to="/playbook" className={`nav-icon ${isActive('/playbook') ? 'text-[#802BB1]' : 'text-gray-400 hover:text-white'}`}>
            <BookOpen size={20} />
          </Link>
          <Link to="/calendar" className={`nav-icon ${isActive('/calendar') ? 'text-[#802BB1]' : 'text-gray-400 hover:text-white'}`}>
            <Calendar size={20} />
          </Link>
          <Link to="/analytics" className={`nav-icon ${isActive('/analytics') ? 'text-[#802BB1]' : 'text-gray-400 hover:text-white'}`}>
            <BarChart2 size={20} />
          </Link>
          <button className="nav-icon text-gray-400 hover:text-white relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF4655] rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#802BB1] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;