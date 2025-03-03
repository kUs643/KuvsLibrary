import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Target, 
  Clock, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Filter,
  Zap,
  Gamepad2,
  Crosshair,
  Video,
  Lightbulb,
  Calendar,
  AlertCircle,
  Trophy,
  CheckCircle,
  XCircle,
  X,
  Plus
} from 'lucide-react';

// Team attendance data
const teamMembers = [
  { id: 1, name: "KUV", role: "Duelist", teamStatus: "Main Roster", isPlayer: true, attendance: 92, absences: 2, tournaments: 3, lates: 1 },
  { id: 2, name: "Phantom", role: "Controller", teamStatus: "Main Roster", isPlayer: true, attendance: 88, absences: 3, tournaments: 3, lates: 2 },
  { id: 3, name: "Specter", role: "Initiator", teamStatus: "Main Roster", isPlayer: true, attendance: 95, absences: 1, tournaments: 3, lates: 0 },
  { id: 4, name: "Ghost", role: "Sentinel", teamStatus: "Main Roster", isPlayer: true, attendance: 85, absences: 4, tournaments: 3, lates: 1 },
  { id: 5, name: "Vandal", role: "Flex", teamStatus: "Main Roster", isPlayer: true, attendance: 90, absences: 2, tournaments: 3, lates: 3 },
  { id: 6, name: "Sheriff", role: "Sub", teamStatus: "Sub", isPlayer: true, attendance: 75, absences: 6, tournaments: 1, lates: 2 },
  { id: 7, name: "Operator", role: "Benched", teamStatus: "Benched", isPlayer: true, attendance: 60, absences: 10, tournaments: 0, lates: 4 },
  { id: 8, name: "Odin", role: "Head Coach", teamStatus: "Head Coach", isPlayer: false, attendance: 98, absences: 0, tournaments: 3, lates: 1 },
  { id: 9, name: "Guardian", role: "Assistant Coach", teamStatus: "Assistant Coach", isPlayer: false, attendance: 94, absences: 1, tournaments: 3, lates: 2 }
];

// Upcoming events data
const upcomingEvents = [
  { id: 1, type: "absence", memberId: 2, date: "May 15, 2024", reason: "Family event" },
  { id: 2, type: "absence", memberId: 5, date: "May 18, 2024", reason: "Medical appointment" },
  { id: 3, type: "tournament", memberIds: [1, 2, 3, 4, 5, 8, 9], date: "May 20-22, 2024", name: "VCT Challengers" },
  { id: 4, type: "absence", memberId: 7, date: "May 25, 2024", reason: "Personal" },
  { id: 5, type: "absence", memberId: 6, date: "May 28, 2024", reason: "Exam" }
];

// Get team status color
const getTeamStatusColor = (status) => {
  switch(status) {
    case "Main Roster": return "bg-green-500";
    case "Sub": return "bg-blue-500";
    case "Benched": return "bg-yellow-500";
    case "Head Coach": return "bg-purple-500";
    case "Assistant Coach": return "bg-indigo-500";
    case "Manager": return "bg-pink-500";
    default: return "bg-gray-500";
  }
};

// Get attendance color
const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return "text-green-500";
  if (percentage >= 80) return "text-blue-500";
  if (percentage >= 70) return "text-yellow-500";
  return "text-red-500";
};

// Get attendance bar color
const getAttendanceBarColor = (percentage) => {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 80) return "bg-blue-500";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-red-500";
};

function Dashboard({ currentUser, users = [] }) {
  const [currentPeriod, setCurrentPeriod] = useState("May 2024");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [events, setEvents] = useState(upcomingEvents);
  const [newEvent, setNewEvent] = useState({
    type: "absence",
    memberId: "",
    date: "",
    reason: "",
    name: ""
  });
  
  // Initialize team attendance from users
  useEffect(() => {
    if (users && users.length > 0) {
      const initialAttendance = users.map(user => ({
        id: user.id,
        name: user.username,
        role: user.role === 'admin' ? 'Head Coach' : 'Player',
        teamStatus: user.teamStatus || 'Main Roster',
        isPlayer: user.role !== 'admin',
        attendance: Math.floor(Math.random() * 30) + 70, // Random attendance between 70-100%
        absences: Math.floor(Math.random() * 5),
        tournaments: Math.floor(Math.random() * 3),
        lates: Math.floor(Math.random() * 3),
        avatar: user.avatar
      }));
      
      setTeamAttendance(initialAttendance);
    } else {
      setTeamAttendance(teamMembers);
    }
  }, [users]);
  
  // Filter team members based on selected filter
  const filteredTeamMembers = teamAttendance.filter(member => {
    if (attendanceFilter === "all") return true;
    if (attendanceFilter === "players") return member.isPlayer;
    if (attendanceFilter === "staff") return !member.isPlayer;
    return true;
  });

  // Default player data if currentUser is not available
  const defaultPlayerData = {
    username: "KUV",
    name: "KUV",
    role: "Duelist",
    teamStatus: "Main Roster",
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
  };
  
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };
  
  const handleAddEvent = () => {
    if (newEvent.type === "absence" && (!newEvent.memberId || !newEvent.date || !newEvent.reason)) {
      return; // Don't add if required fields are missing
    }
    
    if (newEvent.type === "tournament" && (!newEvent.date || !newEvent.name)) {
      return; // Don't add if required fields are missing
    }
    
    const newId = Math.max(...events.map(e => e.id)) + 1;
    
    const eventToAdd = {
      id: newId,
      type: newEvent.type,
      date: newEvent.date,
      ...(newEvent.type === "absence" ? {
        memberId: parseInt(newEvent.memberId),
        reason: newEvent.reason
      } : {
        memberIds: [1, 2, 3, 4, 5], // Default to main roster
        name: newEvent.name
      })
    };
    
    setEvents([...events, eventToAdd]);
    
    // Reset form
    setNewEvent({
      type: "absence",
      memberId: "",
      date: "",
      reason: "",
      name: ""
    });
  };
  
  const handleRemoveEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-kuvsbook-darker text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Profile Card - Updated Design */}
          <div className="card col-span-1 bg-[#1E1A25] overflow-hidden">
            <div className="relative">
              {/* Player Avatar and Info */}
              <div className="flex flex-col items-center pt-8 pb-6 px-6">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-[#802BB1]">
                  <img 
                    src={currentUser?.avatar || defaultPlayerData.avatar} 
                    alt={currentUser?.username || defaultPlayerData.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center text-white mb-4">{currentUser?.username || defaultPlayerData.username}</h2>
                
                <div className="text-center text-gray-300 mb-4">
                  {currentUser?.role === 'admin' ? 'Head Coach' : (currentUser?.role === 'player' ? currentUser?.teamStatus || 'Player' : defaultPlayerData.role)}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 w-full">
                  <a 
                    href={currentUser?.externalLinks?.trackerNA || defaultPlayerData.externalLinks.trackerNA} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#802BB1] text-white py-2 rounded text-center font-medium hover:bg-[#9030d0] transition-colors"
                  >
                    Tracker NA
                  </a>
                  <a 
                    href={currentUser?.externalLinks?.trackerLAN || defaultPlayerData.externalLinks.trackerLAN} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#802BB1] text-white py-2 rounded text-center font-medium hover:bg-[#9030d0] transition-colors"
                  >
                    Tracker LAN
                  </a>
                </div>
              </div>
              
              {/* Team Status */}
              <div className="px-6 pb-6">
                <h3 className="uppercase text-sm font-medium text-gray-400 mb-3">TEAM STATUS</h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`${getTeamStatusColor(currentUser?.teamStatus || (currentUser?.role === 'admin' ? 'Head Coach' : defaultPlayerData.teamStatus))} px-3 py-1 rounded-sm text-sm`}>
                    {currentUser?.teamStatus || (currentUser?.role === 'admin' ? 'Head Coach' : defaultPlayerData.teamStatus)}
                  </div>
                </div>
              </div>
              
              {/* Hardware Setup */}
              <div className="px-6 pb-6">
                <h3 className="uppercase text-sm font-medium text-gray-400 mb-3">HARDWARE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Keyboard:</span>
                    <span className="text-white">{currentUser?.hardware?.keyboard || defaultPlayerData.hardware.keyboard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mouse:</span>
                    <span className="text-white">{currentUser?.hardware?.mouse || defaultPlayerData.hardware.mouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mousepad:</span>
                    <span className="text-white">{currentUser?.hardware?.mousepad || defaultPlayerData.hardware.mousepad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Headset:</span>
                    <span className="text-white">{currentUser?.hardware?.headset || defaultPlayerData.hardware.headset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monitor:</span>
                    <span className="text-white">{currentUser?.hardware?.monitor || defaultPlayerData.hardware.monitor}</span>
                  </div>
                </div>
              </div>
              
              {/* External Links */}
              <div className="px-6 pb-6">
                <h3 className="uppercase text-sm font-medium text-gray-400 mb-3">EXTERNAL LINKS</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-[#2D283E] p-2 rounded">
                    <div className="text-xs text-gray-400">VLR.gg</div>
                    <div className="font-medium truncate">{currentUser?.externalLinks?.vlr || defaultPlayerData.externalLinks.vlr}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pro Player Path Section */}
          <div className="card col-span-1 lg:col-span-2">
            <div className="p-6 bg-[#1E1A25] border-b border-gray-800">
              <h2 className="text-xl font-bold text-purple-400">Pro Player Path</h2>
              <p className="text-sm text-gray-400">Performance metrics to strive for</p>
            </div>
            
            {/* Performance Metrics - New Design */}
            <div className="grid grid-cols-3 divide-x divide-gray-800">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="text-red-400">
                    <Target className="h-10 w-10 mx-auto" />
                  </div>
                </div>
                <div className="uppercase text-xs font-medium text-purple-400 tracking-wider mb-1">PRECISION</div>
                <div className="text-3xl font-bold">26%</div>
                <div className="text-xs text-gray-400 mt-1">Headshot percentage target</div>
              </div>
              
              <div className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="text-orange-400">
                    <Zap className="h-10 w-10 mx-auto" />
                  </div>
                </div>
                <div className="uppercase text-xs font-medium text-purple-400 tracking-wider mb-1">COMBAT SCORE</div>
                <div className="text-3xl font-bold">200</div>
                <div className="text-xs text-gray-400 mt-1">Minimum ACS target</div>
              </div>
              
              <div className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="text-blue-400">
                    <Clock className="h-10 w-10 mx-auto" />
                  </div>
                </div>
                <div className="uppercase text-xs font-medium text-purple-400 tracking-wider mb-1">PLAYTIME</div>
                <div className="text-3xl font-bold">2000</div>
                <div className="text-xs text-gray-400 mt-1">Hours of total playtime</div>
              </div>
            </div>
            
            {/* Pro Level Targets - New Design */}
            <div className="p-6 bg-[#1E1A25] border-t border-gray-800">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Pro Level Targets</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 border-b border-gray-800">
                  <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full mr-4">
                    <Gamepad2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Ranked Matches</div>
                    <div className="text-sm text-gray-400">72 ranked matches per month minimum</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border-b border-gray-800">
                  <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full mr-4">
                    <Crosshair className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Deathmatch Practice</div>
                    <div className="text-sm text-gray-400">30 min to 1 hour daily deathmatch</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border-b border-gray-800">
                  <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full mr-4">
                    <Video className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Pro VOD Review</div>
                    <div className="text-sm text-gray-400">Study pro strategies and competitive scene</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3">
                  <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full mr-4">
                    <Lightbulb className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Strategy Adaptation</div>
                    <div className="text-sm text-gray-400">Incorporate pro ideas into your gameplay</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Attendance Overview - Minimalist Design */}
          <div className="card col-span-1 lg:col-span-3">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Team Attendance Overview</h2>
                
                <div className="flex items-center space-x-4">
                  {/* Current Period */}
                  <div className="text-gray-400">
                    <span>{currentPeriod}</span>
                  </div>
                  
                  {/* Filters */}
                  <div className="relative">
                    <select
                      value={attendanceFilter}
                      onChange={(e) => setAttendanceFilter(e.target.value)}
                      className="bg-kuvsbook-darker border border-gray-700 rounded px-3 py-1 pr-8 appearance-none"
                    >
                      <option value="all">All Members</option>
                      <option value="players">Players Only</option>
                      <option value="staff">Staff Only</option>
                    </select>
                    <Filter size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                  
                  {/* Edit Button */}
                  <button 
                    className="flex items-center space-x-1 bg-kuvsbook-purple px-3 py-1 rounded text-sm"
                    onClick={() => setShowAttendanceModal(true)}
                  >
                    <Edit3 size={14} />
                    <span>Manage Attendance</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Attendance Overview */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Attendance Stats */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Attendance Statistics</h3>
                
                <div className="space-y-6">
                  {filteredTeamMembers.map(member => (
                    <div 
                      key={member.id} 
                      className="bg-[#2D283E] p-4 rounded-lg cursor-pointer hover:bg-[#3D384E] transition-colors"
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {member.avatar && (
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <img 
                                src={member.avatar} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="font-medium">{member.name}</div>
                          <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getTeamStatusColor(member.teamStatus)}`}>
                            {member.teamStatus}
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${getAttendanceColor(member.attendance)}`}>
                          {member.attendance}%
                        </div>
                      </div>
                      
                      {/* Attendance Progress Bar */}
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full rounded-full ${getAttendanceBarColor(member.attendance)}`}
                          style={{ width: `${member.attendance}%` }}
                        ></div>
                      </div>
                      
                      {/* Attendance Details */}
                      <div className="flex justify-between text-sm text-gray-400">
                        <div className="flex items-center">
                          <XCircle size={14} className="text-red-500 mr-1" />
                          <span>{member.absences} absences</span>
                        </div>
                        <div className="flex items-center">
                          <Trophy size={14} className="text-blue-500 mr-1" />
                          <span>{member.tournaments} tournaments</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="text-yellow-500 mr-1" />
                          <span>{member.lates} lates</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                
                <div className="bg-[#2D283E] rounded-lg p-4">
                  <div className="space-y-4">
                    {events.map(event => {
                      const member = event.type === 'tournament' 
                        ? null 
                        : teamAttendance.find(m => m.id === event.memberId) || 
                          teamMembers.find(m => m.id === event.memberId);
                      
                      return (
                        <div key={event.id} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0 relative">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-full mr-3 ${
                              event.type === 'tournament' 
                                ? 'bg-blue-500/20' 
                                : 'bg-red-500/20'
                            }`}>
                              {event.type === 'tournament' 
                                ? <Trophy size={18} className="text-blue-500" /> 
                                : <AlertCircle size={18} className="text-red-500" />
                              }
                            </div>
                            <div>
                              <div className="font-medium">
                                {event.type === 'tournament' 
                                  ? event.name 
                                  : `${member?.name || 'Unknown'} Absence`
                                }
                              </div>
                              <div className="text-sm text-gray-400 mb-1">{event.date}</div>
                              {event.type === 'absence' && (
                                <div className="text-xs text-gray-500">Reason: {event.reason}</div>
                              )}
                              {event.type === 'tournament' && (
                                <div className="text-xs text-gray-500">
                                  {event.memberIds.length} team members participating
                                </div>
                              )}
                            </div>
                            {currentUser?.role === 'admin' && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveEvent(event.id);
                                }}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button 
                    className="w-full mt-4 bg-kuvsbook-purple/20 hover:bg-kuvsbook-purple/30 text-kuvsbook-purple py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setShowAttendanceModal(true)}
                  >
                    Add New Event
                  </button>
                </div>
                
                {/* Monthly Summary */}
                <div className="bg-[#2D283E] rounded-lg p-4 mt-6">
                  <h4 className="font-medium mb-3">Monthly Summary</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span>Average Attendance</span>
                      </div>
                      <div className="font-medium text-green-500">86%</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-blue-500 mr-2" />
                        <span>Practice Sessions</span>
                      </div>
                      <div className="font-medium">24</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Trophy size={16} className="text-yellow-500 mr-2" />
                        <span>Tournaments</span>
                      </div>
                      <div className="font-medium">3</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <XCircle size={16} className="text-red-500 mr-2" />
                        <span>Total Absences</span>
                      </div>
                      <div className="font-medium">29</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Management Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D283E] rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Attendance</h2>
              <button 
                className="p-2 rounded-full hover:bg-[#1E1A25]"
                onClick={() => setShowAttendanceModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Current Period Setting */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Current Period</h3>
              <input
                type="text"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
                className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                placeholder="e.g., May 2024"
              />
            </div>
            
            {/* Add New Event */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Add New Event</h3>
              
              <div className="bg-[#1E1A25] p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                    >
                      <option value="absence">Absence</option>
                      <option value="tournament">Tournament</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      placeholder="e.g., June 15, 2024"
                    />
                  </div>
                </div>
                
                {newEvent.type === "absence" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Team Member
                      </label>
                      <select
                        value={newEvent.memberId}
                        onChange={(e) => setNewEvent({...newEvent, memberId: e.target.value})}
                        className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      >
                        <option value="">Select a member</option>
                        {teamAttendance.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Reason
                      </label>
                      <input
                        type="text"
                        value={newEvent.reason}
                        onChange={(e) => setNewEvent({...newEvent, reason: e.target.value})}
                        className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                        placeholder="e.g., Family event, Medical appointment"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tournament Name
                    </label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      className="w-full bg-[#2D283E] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      placeholder="e.g., VCT Challengers, Valorant Champions"
                    />
                  </div>
                )}
                
                <button
                  onClick={handleAddEvent}
                  className="bg-[#802BB1] text-white py-2 px-4 rounded-md font-medium hover:bg-[#9030d0] transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add Event
                </button>
              </div>
            </div>
            
            {/* Upcoming Events List */}
            <div>
              <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
              
              <div className="bg-[#1E1A25] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1E1A25]">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Details</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {events.map(event => {
                        const member = event.type === 'tournament' 
                          ? null 
                          : teamAttendance.find(m => m.id === event.memberId) || 
                            teamMembers.find(m => m.id === event.memberId);
                        
                        return (
                          <tr key={event.id}>
                            <td className="px-4 py-3">
                              {event.type === 'tournament' ? 'Tournament' : 'Absence'}
                            </td>
                            <td className="px-4 py-3">{event.date}</td>
                            <td className="px-4 py-3">
                              {event.type === 'tournament' 
                                ? event.name 
                                : `${member?.name || 'Unknown'} - ${event.reason}`
                              }
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveEvent(event.id)}
                                className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Member Details Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D283E] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Member Details</h2>
              <button 
                className="p-2 rounded-full hover:bg-[#1E1A25]"
                onClick={() => setShowMemberModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              {selectedMember.avatar ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={selectedMember.avatar} 
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#802BB1] flex items-center justify-center mb-4">
                  <User size={40} className="text-white" />
                </div>
              )}
              
              <h3 className="text-xl font-bold">{selectedMember.name}</h3>
              <div className="text-gray-400 mb-2">{selectedMember.role}</div>
              <div className={`px-3 py-1 rounded-full text-sm ${getTeamStatusColor(selectedMember.teamStatus)}`}>
                {selectedMember.teamStatus}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">ATTENDANCE STATISTICS</h4>
                <div className="bg-[#1E1A25] p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Attendance Rate</span>
                    <span className={`font-bold ${getAttendanceColor(selectedMember.attendance)}`}>
                      {selectedMember.attendance}%
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full ${getAttendanceBarColor(selectedMember.attendance)}`}
                      style={{ width: `${selectedMember.attendance}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-red-400 font-bold">{selectedMember.absences}</div>
                      <div className="text-gray-400">Absences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{selectedMember.tournaments}</div>
                      <div className="text-gray-400">Tournaments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{selectedMember.lates}</div>
                      <div className="text-gray-400">Lates</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">UPCOMING ABSENCES</h4>
                <div className="bg-[#1E1A25] p-3 rounded-lg">
                  {events.filter(e => e.type === 'absence' && e.memberId === selectedMember.id).length > 0 ? (
                    <div className="space-y-3">
                      {events
                        .filter(e => e.type === 'absence' && e.memberId === selectedMember.id)
                        .map(event => (
                          <div key={event.id} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{event.date}</div>
                              <div className="text-sm text-gray-400">{event.reason}</div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-2">No upcoming absences</div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowMemberModal(false)}
              className="w-full mt-6 bg-[#802BB1] text-white py-2 rounded-md font-medium hover:bg-[#9030d0] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;