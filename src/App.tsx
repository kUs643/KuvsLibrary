import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import Playbook from './pages/Playbook';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Settings from './pages/Settings';

interface User {
  id: number;
  username: string;
  role: string;
  email?: string;
  teamStatus?: string;
  avatar?: string;
  hardware?: {
    keyboard: string;
    mouse: string;
    mousepad: string;
    headset: string;
    monitor: string;
  };
  externalLinks?: {
    trackerNA?: string;
    trackerLAN?: string;
    vlr?: string;
  };
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        setCurrentUser({
          id: parseInt(userId),
          username: profile.username || profile.email?.split('@')[0] || 'User',
          role: profile.role || 'player',
          email: profile.email,
          teamStatus: profile.team_status,
          avatar: profile.avatar_url,
          hardware: profile.hardware,
          externalLinks: profile.external_links
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password
      });

      if (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          message: error.message || 'Invalid login credentials'
        };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        navigate('/');
        return { success: true };
      }

      return { 
        success: false, 
        message: 'Login failed. Please try again.'
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      <div className={isAuthenticated ? "ml-16 w-full" : "w-full"}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard currentUser={currentUser} users={users} />
            </ProtectedRoute>
          } />
          <Route path="/playbook" element={
            <ProtectedRoute>
              <Playbook />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings 
                currentUser={currentUser} 
                updateUserData={() => {}} 
                users={users}
                addNewUser={() => {}}
                toggleUserStatus={() => {}}
              />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;