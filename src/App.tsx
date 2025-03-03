import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Playbook from './pages/Playbook';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Settings from './pages/Settings';

// Define a user type for better type safety
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

// Initial users data
const initialUsers: User[] = [
  {
    id: 1,
    username: "kuvs",
    role: "admin",
    email: "kuvs@example.com",
    teamStatus: "Head Coach",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    hardware: {
      keyboard: "Logitech G Pro X",
      mouse: "Logitech G Pro X Superlight",
      mousepad: "Logitech G640",
      headset: "Logitech G Pro X",
      monitor: "240Hz"
    },
    externalLinks: {
      trackerNA: "https://tracker.gg/valorant",
      trackerLAN: "https://tracker.gg/valorant",
      vlr: "https://www.vlr.gg/"
    }
  },
  {
    id: 2,
    username: "player",
    role: "player",
    email: "player@example.com",
    teamStatus: "Main Roster",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    // Try to load users from localStorage
    const savedUsers = localStorage.getItem('app_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const navigate = useNavigate();

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      setIsAuthenticated(true);
      
      // Find the user by ID
      const user = users.find(u => u.id === parseInt(userId));
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [users]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const handleLogin = (credentials) => {
    // Special case for the admin account
    if (credentials.username.toLowerCase() === 'kuvs' && credentials.password === 'nintendoiswack123') {
      localStorage.setItem('auth_token', 'admin_token_secure');
      localStorage.setItem('user_id', '1');
      localStorage.setItem('user_role', 'admin');
      setIsAuthenticated(true);
      setCurrentUser(users[0]);
      navigate('/');
      return { success: true };
    }
    
    // Find user by username (case insensitive)
    const user = users.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase()
    );
    
    // Check if user exists and password matches
    if (user && credentials.password === 'password') {
      localStorage.setItem('auth_token', `token_${user.id}_secure`);
      localStorage.setItem('user_id', user.id.toString());
      localStorage.setItem('user_role', user.role);
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigate('/');
      return { success: true };
    }
    
    return { success: false, message: 'Invalid username or password' };
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const updateUserData = (updatedUser: User) => {
    // Update the users array with the updated user data
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    
    return { success: true, message: 'Profile updated successfully!' };
  };

  const addNewUser = (newUser: Partial<User>) => {
    // Generate a new ID
    const newId = Math.max(...users.map(u => u.id)) + 1;
    
    // Create the new user object
    const userToAdd: User = {
      id: newId,
      username: newUser.username || '',
      role: newUser.role || 'player',
      email: newUser.email || '',
      teamStatus: newUser.teamStatus || 'Main Roster',
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      hardware: {
        keyboard: "",
        mouse: "",
        mousepad: "",
        headset: "",
        monitor: ""
      },
      externalLinks: {
        trackerNA: "",
        trackerLAN: "",
        vlr: ""
      }
    };
    
    // Add the new user to the users array
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    
    return { success: true, message: 'User added successfully!', userId: newId };
  };

  const toggleUserStatus = (userId: number, isActive: boolean) => {
    // Update the user's active status
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive } : user
    );
    
    setUsers(updatedUsers);
    
    return { success: true };
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
                updateUserData={updateUserData} 
                users={users}
                addNewUser={addNewUser}
                toggleUserStatus={toggleUserStatus}
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