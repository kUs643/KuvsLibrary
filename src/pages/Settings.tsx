import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Upload, 
  Save, 
  Trash2, 
  Link as LinkIcon, 
  Shield, 
  UserPlus, 
  Users, 
  AlertCircle,
  Check
} from 'lucide-react';

const Settings = ({ currentUser, updateUserData, users = [], addNewUser, toggleUserStatus }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(currentUser || {});
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('user_role') === 'admin');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [members, setMembers] = useState(users || []);
  const [newMember, setNewMember] = useState({
    username: '',
    email: '',
    role: 'player',
    teamStatus: 'Main Roster',
    password: '',
    confirmPassword: ''
  });
  
  const fileInputRef = useRef(null);

  // Update userData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  // Update members when users changes
  useEffect(() => {
    if (users) {
      setMembers(users);
    }
  }, [users]);
  
  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setUserData({
          ...userData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    if (section) {
      setUserData({
        ...userData,
        [section]: {
          ...userData[section] || {},
          [field]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [field]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Call the updateUserData function passed from App component
    const result = updateUserData(userData);
    
    if (result.success) {
      setSuccessMessage(result.message || 'Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setErrorMessage(result.message || 'Failed to update profile');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };
  
  // Handle new member form submission
  const handleAddMember = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newMember.username || !newMember.email || !newMember.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    if (newMember.password !== newMember.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Call the addNewUser function passed from App component
    const result = addNewUser({
      username: newMember.username,
      email: newMember.email,
      role: newMember.role,
      teamStatus: newMember.teamStatus
    });
    
    if (result.success) {
      // Reset form
      setNewMember({
        username: '',
        email: '',
        role: 'player',
        teamStatus: 'Main Roster',
        password: '',
        confirmPassword: ''
      });
      
      setSuccessMessage(result.message || 'Member added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    } else {
      setErrorMessage(result.message || 'Failed to add member');
    }
  };
  
  // Handle member status toggle
  const handleToggleUserStatus = (id, isActive) => {
    // Call the toggleUserStatus function passed from App component
    const result = toggleUserStatus(id, !isActive);
    
    if (result.success) {
      setSuccessMessage(`User ${isActive ? 'deactivated' : 'activated'} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  return (
    <div className="min-h-screen bg-kuvsbook-darker text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-md text-green-200 flex items-center">
            <Check size={18} className="mr-2 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#2D283E] rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'profile' ? 'bg-[#802BB1] text-white' : 'text-gray-300 hover:bg-[#1E1A25]'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('hardware')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'hardware' ? 'bg-[#802BB1] text-white' : 'text-gray-300 hover:bg-[#1E1A25]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M6 8h.01" />
                      <path d="M10 8h.01" />
                      <path d="M14 8h.01" />
                      <path d="M18 8h.01" />
                      <path d="M6 12h.01" />
                      <path d="M10 12h.01" />
                      <path d="M14 12h.01" />
                      <path d="M18 12h.01" />
                      <path d="M6 16h.01" />
                      <path d="M10 16h.01" />
                      <path d="M14 16h.01" />
                      <path d="M18 16h.01" />
                    </svg>
                    Hardware Setup
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('links')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'links' ? 'bg-[#802BB1] text-white' : 'text-gray-300 hover:bg-[#1E1A25]'
                    }`}
                  >
                    <LinkIcon size={18} className="mr-3" />
                    External Links
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'admin' ? 'bg-[#802BB1] text-white' : 'text-gray-300 hover:bg-[#1E1A25]'
                      }`}
                    >
                      <Shield size={18} className="mr-3" />
                      Admin Controls
                    </button>
                  )}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#2D283E] rounded-lg overflow-hidden">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Profile Image */}
                    <div className="mb-8 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#802BB1]">
                          <img 
                            src={userData.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"} 
                            alt={userData.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-[#802BB1] p-2 rounded-full hover:bg-[#9030d0] transition-colors"
                        >
                          <Upload size={16} />
                        </button>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-400">Click the icon to upload a new profile picture</p>
                    </div>
                    
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            Username
                          </label>
                          <input
                            id="username"
                            type="text"
                            value={userData.username || ''}
                            onChange={(e) => handleInputChange(null, 'username', e.target.value)}
                            className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={userData.email || ''}
                            onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                            className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                            Role
                          </label>
                          <select
                            id="role"
                            value={userData.role || 'player'}
                            onChange={(e) => handleInputChange(null, 'role', e.target.value)}
                            className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            disabled={!isAdmin && userData.role === 'admin'} // Only admin can change admin role
                          >
                            <option value="player">Player</option>
                            {isAdmin && <option value="admin">Admin</option>}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="teamStatus" className="block text-sm font-medium text-gray-300 mb-1">
                            Team Status
                          </label>
                          <select
                            id="teamStatus"
                            value={userData.teamStatus || 'Main Roster'}
                            onChange={(e) => handleInputChange(null, 'teamStatus', e.target.value)}
                            className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          >
                            <option value="Main Roster">Main Roster</option>
                            <option value="Sub">Sub</option>
                            <option value="Benched">Benched</option>
                            <option value="Head Coach">Head Coach</option>
                            <option value="Assistant Coach">Assistant Coach</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-[#802BB1] text-white py-2 px-6 rounded-md font-medium hover:bg-[#9030d0] transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Hardware Setup */}
              {activeTab === 'hardware' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Hardware Setup</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="keyboard" className="block text-sm font-medium text-gray-300 mb-1">
                          Keyboard
                        </label>
                        <input
                          id="keyboard"
                          type="text"
                          value={userData.hardware?.keyboard || ''}
                          onChange={(e) => handleInputChange('hardware', 'keyboard', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="e.g., Logitech G Pro X"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="mouse" className="block text-sm font-medium text-gray-300 mb-1">
                          Mouse
                        </label>
                        <input
                          id="mouse"
                          type="text"
                          value={userData.hardware?.mouse || ''}
                          onChange={(e) => handleInputChange('hardware', 'mouse', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="e.g., Logitech G Pro X Superlight"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="mousepad" className="block text-sm font-medium text-gray-300 mb-1">
                          Mousepad
                        </label>
                        <input
                          id="mousepad"
                          type="text"
                          value={userData.hardware?.mousepad || ''}
                          onChange={(e) => handleInputChange('hardware', 'mousepad', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="e.g., Logitech G640"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="headset" className="block text-sm font-medium text-gray-300 mb-1">
                          Headset
                        </label>
                        <input
                          id="headset"
                          type="text"
                          value={userData.hardware?.headset || ''}
                          onChange={(e) => handleInputChange('hardware', 'headset', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="e.g., Logitech G Pro X"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="monitor" className="block text-sm font-medium text-gray-300 mb-1">
                          Monitor
                        </label>
                        <input
                          id="monitor"
                          type="text"
                          value={userData.hardware?.monitor || ''}
                          onChange={(e) => handleInputChange('hardware', 'monitor', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="e.g., 240Hz"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-[#802BB1] text-white py-2 px-6 rounded-md font-medium hover:bg-[#9030d0] transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* External Links */}
              {activeTab === 'links' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">External Links</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="trackerNA" className="block text-sm font-medium text-gray-300 mb-1">
                          Tracker.gg NA Profile
                        </label>
                        <input
                          id="trackerNA"
                          type="url"
                          value={userData.externalLinks?.trackerNA || ''}
                          onChange={(e) => handleInputChange('externalLinks', 'trackerNA', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="https://tracker.gg/valorant/profile/..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="trackerLAN" className="block text-sm font-medium text-gray-300 mb-1">
                          Tracker.gg LAN Profile
                        </label>
                        <input
                          id="trackerLAN"
                          type="url"
                          value={userData.externalLinks?.trackerLAN || ''}
                          onChange={(e) => handleInputChange('externalLinks', 'trackerLAN', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="https://tracker.gg/valorant/profile/..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="vlr" className="block text-sm font-medium text-gray-300 mb-1">
                          VLR.gg Profile
                        </label>
                        <input
                          id="vlr"
                          type="url"
                          value={userData.externalLinks?.vlr || ''}
                          onChange={(e) => handleInputChange('externalLinks', 'vlr', e.target.value)}
                          className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          placeholder="https://www.vlr.gg/player/..."
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-[#802BB1] text-white py-2 px-6 rounded-md font-medium hover:bg-[#9030d0] transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Admin Controls */}
              {activeTab === 'admin' && isAdmin && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Admin Controls</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <UserPlus size={20} className="mr-2" />
                      Add New Team Member
                    </h3>
                    
                    <form onSubmit={handleAddMember} className="bg-[#1E1A25] p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="new-username" className="block text-sm font-medium text-gray-300 mb-1">
                            Username <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="new-username"
                            type="text"
                            value={newMember.username}
                            onChange={(e) => setNewMember({...newMember, username: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="new-email"
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="new-role" className="block text-sm font-medium text-gray-300 mb-1">
                            Role
                          </label>
                          <select
                            id="new-role"
                            value={newMember.role}
                            onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          >
                            <option value="player">Player</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="new-status" className="block text-sm font-medium text-gray-300 mb-1">
                            Team Status
                          </label>
                          <select
                            id="new-status"
                            value={newMember.teamStatus}
                            onChange={(e) => setNewMember({...newMember, teamStatus: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                          >
                            <option value="Main Roster">Main Roster</option>
                            <option value="Sub">Sub</option>
                            <option value="Benched">Benched</option>
                            <option value="Head Coach">Head Coach</option>
                            <option value="Assistant Coach">Assistant Coach</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                            Password <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="new-password"
                            type="password"
                            value={newMember.password}
                            onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm Password <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="new-confirm-password"
                            type="password"
                            value={newMember.confirmPassword}
                            onChange={(e) => setNewMember({...newMember, confirmPassword: e.target.value})}
                            className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="bg-[#802BB1] text-white py-2 px-6 rounded-md font-medium hover:bg-[#9030d0] transition-colors flex items-center"
                        >
                          <UserPlus size={18} className="mr-2" />
                          Add Member
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Users size={20} className="mr-2" />
                      Manage Team Members
                    </h3>
                    
                    <div className="bg-[#1E1A25] rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#2D283E]">
                              <th className="px-4 py-3 text-left">Username</th>
                              <th className="px-4 py-3 text-left">Email</th>
                              <th className="px-4 py-3 text-left">Role</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {members.map(member => (
                              <tr key={member.id} className={member.isActive === false ? "opacity-60" : ""}>
                                <td className="px-4 py-3">{member.username}</td>
                                <td className="px-4 py-3">{member.email}</td>
                                <td className="px-4 py-3">{member.role}</td>
                                <td className="px-4 py-3">{member.teamStatus}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => handleToggleUserStatus(member.id, member.isActive !== false)}
                                      className={`p-1 rounded ${
                                        member.isActive !== false 
                                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                      }`}
                                      title={member.isActive !== false ? "Deactivate Account" : "Activate Account"}
                                    >
                                      {member.isActive !== false ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                      className="p-1 rounded bg-[#802BB1]/20 text-[#802BB1] hover:bg-[#802BB1]/30"
                                      title="Reset Password"
                                    >
                                      Reset Password
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;