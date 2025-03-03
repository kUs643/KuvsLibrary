import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Plus, Edit, Save, X, Upload, Trash2,
  MessageSquare, Share, BookOpen, Layers, List, Menu, ArrowUp, Maximize
} from 'lucide-react';

// Maps data
const maps = [
  { id: 1, name: "Haven", image: "https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest/scale-to-width-down/1000?cb=20200620202335" },
  { id: 2, name: "Bind", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000" },
  { id: 3, name: "Split", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000" },
  { id: 4, name: "Ascent", image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000" },
  { id: 5, name: "Icebox", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000" },
  { id: 6, name: "Breeze", image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000" },
  { id: 7, name: "Fracture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000" },
  { id: 8, name: "Pearl", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000" },
  { id: 9, name: "Lotus", image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000" },
  { id: 10, name: "Sunset", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000" },
  { id: 11, name: "Abyss", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000" }
];

// Initial strategies data
const initialStrategies = {
  1: [ // Haven strategies
    {
      id: 1,
      title: "A Site Fast Execute",
      image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000",
      description: "This strategy focuses on a fast A site execute with coordinated utility. The team should smoke off Heaven and A Link, then flash through A Short and A Long simultaneously. The goal is to overwhelm defenders before they can rotate.",
      steps: [
        "Smoke Heaven and A Link",
        "Flash through A Short and A Long",
        "Entry through both entrances simultaneously",
        "Plant default behind the box",
        "Set up crossfires post-plant"
      ],
      team: "Aggressive",
      side: "Attack",
      comments: [
        { id: 1, author: "KUV", text: "Make sure to coordinate the flashes properly, we need perfect timing here.", timestamp: "2 days ago", likes: 3 },
        { id: 2, author: "Phantom", text: "I'll take care of the Heaven smoke, Specter can handle A Link.", timestamp: "1 day ago", likes: 1 }
      ],
      images: [
        "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    },
    {
      id: 2,
      title: "Default Defense Setup",
      image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000",
      description: "A standard defensive setup for Haven that provides good coverage of all sites while maintaining flexibility for rotations. This setup focuses on information gathering and delaying attackers.",
      steps: [
        "Position 2 players on A site (one Heaven, one Short)",
        "Position 1 player on B site (watching Mid)",
        "Position 2 players on C site (one Long, one Garage)",
        "Gather information before committing to rotations",
        "Use utility to delay pushes and buy time for rotations"
      ],
      team: "Defensive",
      side: "Defense",
      comments: [
        { id: 1, author: "Ghost", text: "I prefer to play from Heaven on A site for better angles.", timestamp: "3 days ago", likes: 2 }
      ],
      images: [
        "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    }
  ],
  2: [ // Bind strategies
    {
      id: 1,
      title: "Pistol Round Attack",
      image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000",
      description: "A fast-paced pistol round strategy for Bind that focuses on taking control of A Short and overwhelming the site. This strategy relies on speed and coordination to catch defenders off guard.",
      steps: [
        "Smoke Heaven and A Bath",
        "Flash through A Short",
        "Rush as a team through A Short",
        "Clear site corners quickly",
        "Plant default and hold angles"
      ],
      team: "Pistol",
      side: "Attack",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    },
    {
      id: 2,
      title: "Anti-Eco B Defense",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000",
      description: "A defensive setup for Bind designed specifically to counter eco pushes on B site. This strategy focuses on using utility efficiently and playing for retakes if necessary.",
      steps: [
        "Position 3 players on B site (one Hookah, one Elbow, one Back site)",
        "Position 2 players on A site (ready to rotate)",
        "Use minimal utility to counter the eco push",
        "Play for trades and avoid giving away free kills",
        "Retake if necessary with full utility"
      ],
      team: "Anti Eco",
      side: "Defense",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    }
  ],
  3: [ // Split strategies
    {
      id: 1,
      title: "Mid to B Split",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000",
      description: "A strategic split through Mid to B site. This strategy focuses on controlling Mid before executing onto B site.",
      steps: [
        "Smoke Mid Connector and Heaven",
        "Take Mid control",
        "Split through B Main and Mid",
        "Clear site with utility",
        "Plant default and hold crossfires"
      ],
      team: "Tactical",
      side: "Attack",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    },
    {
      id: 2,
      title: "A Site Adaptation",
      image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000",
      description: "An adaptive approach to attacking A site on Split. This strategy provides options based on the defensive setup encountered.",
      steps: [
        "Take Ramps control with minimal utility",
        "Gather information about defensive positioning",
        "Adapt execution based on defender setup",
        "Option 1: Fast A Main push if site is lightly defended",
        "Option 2: Split through A Main and Heaven if heavily defended"
      ],
      team: "Adaptation",
      side: "Attack",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    }
  ],
  4: [ // Ascent strategies
    {
      id: 1,
      title: "B Main to B Site",
      image: "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000",
      description: "A direct approach through B Main to take B site. This strategy relies on utility usage to clear angles and create space.",
      steps: [
        "Smoke CT and Market",
        "Flash through B Main",
        "Clear site corners",
        "Plant default",
        "Hold post-plant positions"
      ],
      team: "Aggressive",
      side: "Attack",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    }
  ],
  5: [ // Icebox strategies
    {
      id: 1,
      title: "A Site Execute",
      image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000",
      description: "A coordinated execute onto A site. This strategy focuses on using utility to clear angles and create space for the team.",
      steps: [
        "Smoke Screens and Rafters",
        "Use utility to clear Nest",
        "Take control of site",
        "Plant default",
        "Hold post-plant positions"
      ],
      team: "Tactical",
      side: "Attack",
      comments: [],
      images: [
        "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000"
      ],
      currentImageIndex: 0
    }
  ]
};

// Initial playbooks data
const initialPlaybooks = [
  {
    id: 1,
    name: "VCT Masters",
    maps: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    name: "Challengers",
    maps: [1, 3, 6, 7, 8]
  }
];

function Playbook() {
  const [playbooks, setPlaybooks] = useState(initialPlaybooks);
  const [currentPlaybookId, setCurrentPlaybookId] = useState(1);
  const [currentMapId, setCurrentMapId] = useState(1);
  const [strategies, setStrategies] = useState(initialStrategies);
  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState(null);
  const [editedSteps, setEditedSteps] = useState([]);
  const [editedImages, setEditedImages] = useState([]);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [newPlaybookName, setNewPlaybookName] = useState("");
  const [selectedMapIds, setSelectedMapIds] = useState<number[]>([]);
  const [editingPlaybook, setEditingPlaybook] = useState<null | {id: number, name: string}>(null);
  const [newComment, setNewComment] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [showStrategiesPopup, setShowStrategiesPopup] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPlaybook = playbooks.find(p => p.id === currentPlaybookId) || playbooks[0];
  const availableMaps = maps.filter(map => currentPlaybook.maps.includes(map.id));
  const currentMap = maps.find(map => map.id === currentMapId) || availableMaps[0];
  const currentMapStrategies = strategies[currentMapId] || [];
  const currentStrategy = currentMapStrategies.length > 0 ? currentMapStrategies[currentStrategyIndex] : null;

  // Initialize editedStrategy, editedSteps, and editedImages when currentStrategy changes
  useEffect(() => {
    if (currentStrategy) {
      setEditedStrategy(currentStrategy);
      setEditedSteps(currentStrategy.steps);
      setEditedImages(currentStrategy.images || [currentStrategy.image]);
    }
  }, [currentStrategy]);

  // Filter strategies based on filter
  const filteredStrategies = currentMapStrategies.filter(strategy => {
    const matchesFilter = strategyFilter === "all" || 
      (strategyFilter === "attack" && strategy.side === "Attack") ||
      (strategyFilter === "defense" && strategy.side === "Defense") ||
      (strategyFilter === strategy.team.toLowerCase());
    
    return matchesFilter;
  });

  const nextImage = () => {
    if (!isEditing && currentStrategy && currentStrategy.images && currentStrategy.images.length > 1) {
      const updatedStrategies = {...strategies};
      const currentImages = currentStrategy.images;
      const nextIndex = (currentStrategy.currentImageIndex + 1) % currentImages.length;
      
      updatedStrategies[currentMapId][currentStrategyIndex] = {
        ...currentStrategy,
        currentImageIndex: nextIndex
      };
      
      setStrategies(updatedStrategies);
    }
  };

  const prevImage = () => {
    if (!isEditing && currentStrategy && currentStrategy.images && currentStrategy.images.length > 1) {
      const updatedStrategies = {...strategies};
      const currentImages = currentStrategy.images;
      const prevIndex = (currentStrategy.currentImageIndex - 1 + currentImages.length) % currentImages.length;
      
      updatedStrategies[currentMapId][currentStrategyIndex] = {
        ...currentStrategy,
        currentImageIndex: prevIndex
      };
      
      setStrategies(updatedStrategies);
    }
  };

  const handleMapChange = (mapId: number) => {
    if (!isEditing) {
      setCurrentMapId(mapId);
      setCurrentStrategyIndex(0);
    }
  };

  const handlePlaybookChange = (playbookId: number) => {
    if (!isEditing) {
      setCurrentPlaybookId(playbookId);
      const newPlaybook = playbooks.find(p => p.id === playbookId) || playbooks[0];
      // Set current map to the first map in the new playbook
      if (newPlaybook.maps.length > 0) {
        setCurrentMapId(newPlaybook.maps[0]);
      }
      setCurrentStrategyIndex(0);
    }
  };

  const handleStrategySelect = (index: number) => {
    if (!isEditing) {
      setCurrentStrategyIndex(index);
      setShowStrategiesPopup(false);
    }
  };

  const handleEditClick = () => {
    if (currentStrategy) {
      setIsEditing(true);
      setEditedStrategy({...currentStrategy});
      setEditedSteps([...currentStrategy.steps]);
      setEditedImages(currentStrategy.images || [currentStrategy.image]);
    }
  };

  const handleSaveClick = () => {
    if (editedStrategy && currentMapStrategies.length > 0) {
      const updatedStrategies = {...strategies};
      updatedStrategies[currentMapId][currentStrategyIndex] = {
        ...editedStrategy,
        steps: editedSteps,
        images: editedImages,
        image: editedImages[0], // Set the first image as the main image
        currentImageIndex: 0
      };
      setStrategies(updatedStrategies);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (currentStrategy) {
      setEditedStrategy({...currentStrategy});
      setEditedSteps([...currentStrategy.steps]);
      setEditedImages(currentStrategy.images || [currentStrategy.image]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage = event.target.result as string;
          setEditedImages([...editedImages, newImage]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (editedImages.length > 1) {
      const newImages = [...editedImages];
      newImages.splice(index, 1);
      setEditedImages(newImages);
    }
  };

  const handleAddStep = () => {
    setEditedSteps([...editedSteps, "New step"]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...editedSteps];
    newSteps.splice(index, 1);
    setEditedSteps(newSteps);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...editedSteps];
    newSteps[index] = value;
    setEditedSteps(newSteps);
  };

  const handleAddStrategy = () => {
    const newStrategy = {
      id: currentMapStrategies.length + 1,
      title: "New Strategy",
      image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000",
      description: "Add your strategy description here.",
      steps: ["Add your first step here"],
      team: "Tactical",
      side: "Attack",
      comments: [],
      images: ["https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000"],
      currentImageIndex: 0
    };
    
    const updatedStrategies = {...strategies};
    updatedStrategies[currentMapId] = [...currentMapStrategies, newStrategy];
    
    setStrategies(updatedStrategies);
    setCurrentStrategyIndex(currentMapStrategies.length);
    setIsEditing(true);
    setEditedStrategy(newStrategy);
    setEditedSteps(newStrategy.steps);
    setEditedImages(newStrategy.images);
  };

  const handleCreatePlaybook = () => {
    setShowPlaybookModal(true);
    setNewPlaybookName("");
    setSelectedMapIds([]);
    setEditingPlaybook(null);
  };

  const handleEditPlaybook = () => {
    const playbook = playbooks.find(p => p.id === currentPlaybookId);
    if (playbook) {
      setEditingPlaybook(playbook);
      setNewPlaybookName(playbook.name);
      setSelectedMapIds([...playbook.maps]);
      setShowPlaybookModal(true);
    }
  };

  const handleSavePlaybook = () => {
    if (newPlaybookName.trim() === "" || selectedMapIds.length === 0) {
      return; // Don't save if name is empty or no maps selected
    }

    if (editingPlaybook) {
      // Update existing playbook
      const updatedPlaybooks = playbooks.map(p => 
        p.id === editingPlaybook.id 
          ? { ...p, name: newPlaybookName, maps: selectedMapIds } 
          : p
      );
      setPlaybooks(updatedPlaybooks);
    } else {
      // Create new playbook
      const newPlaybook = {
        id: playbooks.length + 1,
        name: newPlaybookName,
        maps: selectedMapIds
      };
      setPlaybooks([...playbooks, newPlaybook]);
      setCurrentPlaybookId(newPlaybook.id);
    }
    
    setShowPlaybookModal(false);
  };

  const handleDeletePlaybook = () => {
    if (editingPlaybook && playbooks.length > 1) {
      const updatedPlaybooks = playbooks.filter(p => p.id !== editingPlaybook.id);
      setPlaybooks(updatedPlaybooks);
      setCurrentPlaybookId(updatedPlaybooks[0].id);
      setShowPlaybookModal(false);
    }
  };

  const handleDeleteStrategy = () => {
    if (currentMapStrategies.length > 0) {
      const updatedStrategies = {...strategies};
      updatedStrategies[currentMapId] = currentMapStrategies.filter((_, index) => index !== currentStrategyIndex);
      setStrategies(updatedStrategies);
      
      if (currentStrategyIndex >= updatedStrategies[currentMapId].length) {
        setCurrentStrategyIndex(Math.max(0, updatedStrategies[currentMapId].length - 1));
      }
    }
  };

  const toggleMapSelection = (mapId: number) => {
    if (selectedMapIds.includes(mapId)) {
      setSelectedMapIds(selectedMapIds.filter(id => id !== mapId));
    } else {
      setSelectedMapIds([...selectedMapIds, mapId]);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === "" || !currentStrategy) return;
    
    const updatedStrategies = {...strategies};
    const currentComments = currentStrategy.comments || [];
    
    const newCommentObj = {
      id: currentComments.length + 1,
      author: "You", // In a real app, this would be the current user's name
      text: newComment,
      timestamp: "Just now",
      likes: 0
    };
    
    updatedStrategies[currentMapId][currentStrategyIndex] = {
      ...currentStrategy,
      comments: [...currentComments, newCommentObj]
    };
    
    setStrategies(updatedStrategies);
    setNewComment("");
  };

  const handleDeleteComment = (commentId: number) => {
    if (!currentStrategy) return;
    
    const updatedStrategies = {...strategies};
    const currentComments = currentStrategy.comments || [];
    
    updatedStrategies[currentMapId][currentStrategyIndex] = {
      ...currentStrategy,
      comments: currentComments.filter(comment => comment.id !== commentId)
    };
    
    setStrategies(updatedStrategies);
  };

  return (
    <div className="min-h-screen bg-kuvsbook-darker text-white">
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Playbook Selector Card */}
          <div className="bg-[#2D283E] rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">PLAYBOOK</h3>
            <select
              value={currentPlaybookId}
              onChange={(e) => handlePlaybookChange(Number(e.target.value))}
              className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg px-4 py-3 appearance-none cursor-pointer text-lg font-medium"
            >
              {playbooks.map(playbook => (
                <option key={playbook.id} value={playbook.id}>{playbook.name}</option>
              ))}
            </select>
          </div>
          
          {/* Map Selector Card */}
          <div className="bg-[#2D283E] rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">MAP</h3>
            <select
              value={currentMapId}
              onChange={(e) => handleMapChange(Number(e.target.value))}
              className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg px-4 py-3 appearance-none cursor-pointer text-lg font-medium"
            >
              {availableMaps.map(map => (
                <option key={map.id} value={map.id}>{map.name}</option>
              ))}
            </select>
          </div>
          
          {/* Action Buttons Card */}
          <div className="bg-[#2D283E] rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">ACTIONS</h3>
            <div className="flex gap-4">
              <button 
                onClick={handleCreatePlaybook}
                className="flex-1 bg-[#1E1A25] hover:bg-[#2D283E] border border-[#564F6F] rounded-lg p-3 flex items-center justify-center transition-colors"
                title="Create New Playbook"
              >
                <Plus size={24} className="text-[#802BB1]" />
              </button>
              <button 
                onClick={handleEditPlaybook}
                className="flex-1 bg-[#1E1A25] hover:bg-[#2D283E] border border-[#564F6F] rounded-lg p-3 flex items-center justify-center transition-colors"
                title="Edit Current Playbook"
              >
                <Edit size={24} className="text-[#802BB1]" />
              </button>
            </div>
          </div>
        </div>

        {/* Strategy Carousel Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{currentMap?.name} Strategies</h2>
            <div className="flex gap-3">
              {currentMapStrategies.length > 0 && (
                <button 
                  onClick={handleDeleteStrategy}
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition-all"
                  disabled={isEditing}
                >
                  <Trash2 size={18} />
                  Delete Strategy
                </button>
              )}
              <button 
                onClick={handleEditClick}
                className="bg-[#2D283E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3D384E] transition-all"
                disabled={isEditing || currentMapStrategies.length === 0}
              >
                <Edit size={18} />
                Edit Strategy
              </button>
              <button 
                onClick={handleAddStrategy}
                className="bg-[#802BB1] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#9030d0] transition-all"
                disabled={isEditing}
              >
                <Plus size={18} />
                Add Strategy
              </button>
            </div>
          </div>
          
          {currentMapStrategies.length > 0 && currentStrategy ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#2D283E] rounded-xl overflow-hidden shadow-lg">
              {/* Carousel */}
              <div className="lg:col-span-7 relative">
                {isEditing ? (
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Strategy Images</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {editedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Strategy image ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          {editedImages.length > 1 && (
                            <button 
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500/80 p-1 rounded-full text-white hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#802BB1] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#9030d0] transition-all mx-auto"
                    >
                      <Upload size={18} />
                      Add Image
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden"
                    />
                  </div>
                ) : (
                  <>
                    <div className="relative h-[500px]">
                      <img 
                        src={currentStrategy.images ? currentStrategy.images[currentStrategy.currentImageIndex || 0] : currentStrategy.image} 
                        alt={currentStrategy.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Buttons - Only show if there are multiple images */}
                      {currentStrategy.images && currentStrategy.images.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-all"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-all"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}
                      
                      {/* Fullscreen button */}
                      <button 
                        onClick={() => setShowFullImageModal(true)}
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-all"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Strategy Description */}
              <div className="lg:col-span-5 p-6 flex flex-col">
                {isEditing && editedStrategy ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={editedStrategy.title}
                        onChange={(e) => setEditedStrategy({...editedStrategy, title: e.target.value})}
                        className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-1">Type</label>
                        <select
                          value={editedStrategy.team}
                          onChange={(e) => setEditedStrategy({...editedStrategy, team: e.target.value})}
                          className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                        >
                          <option value="Aggressive">Aggressive</option>
                          <option value="Tactical">Tactical</option>
                          <option value="Defensive">Defensive</option>
                          <option value="Eco">Eco</option>
                          <option value="Default">Default</option>
                          <option value="Pistol">Pistol</option>
                          <option value="Anti Eco">Anti Eco</option>
                          <option value="Adaptation">Adaptation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-1">Side</label>
                        <select
                          value={editedStrategy.side}
                          onChange={(e) => setEditedStrategy({...editedStrategy, side: e.target.value})}
                          className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                        >
                          <option value="Attack">Attack</option>
                          <option value="Defense">Defense</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-1">Description</label>
                      <textarea 
                        value={editedStrategy.description}
                        onChange={(e) => setEditedStrategy({...editedStrategy, description: e.target.value})}
                        className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-[#ECE8E1]/60">Execution Steps</label>
                        <button 
                          onClick={handleAddStep}
                          className="text-[#802BB1] text-sm flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Step
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedSteps.map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              value={step}
                              onChange={(e) => handleStepChange(index, e.target.value)}
                              className="flex-1 bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                            />
                            <button 
                              onClick={() => handleRemoveStep(index)}
                              className="bg-[#802BB1]/10 p-2 rounded-lg hover:bg-[#802BB1]/20"
                            >
                              <X size={18} className="text-[#802BB1]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={handleSaveClick}
                        className="bg-[#802BB1] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#9030d0] transition-all"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button 
                        onClick={handleCancelClick}
                        className="bg-[#1E1A25] text-[#ECE8E1] px-4 py-2 rounded-lg hover:bg-[#2D283E] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  currentStrategy && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">{currentStrategy.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#ECE8E1]/60">{currentStrategy.team} • {currentStrategy.side}</span>
                        </div>
                      </div>
                      <p className="text-[#ECE8E1]/80 mb-6">{currentStrategy.description}</p>
                      
                      <h4 className="text-lg font-semibold mb-3">Execution Steps:</h4>
                      <ol className="space-y-2 text-[#ECE8E1]/70 list-decimal pl-5">
                        {currentStrategy.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#2D283E] rounded-xl p-10 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-4">No Strategies Yet</h3>
              <p className="text-[#ECE8E1]/70 mb-6">Create your first strategy for {currentMap?.name} by clicking the "Add Strategy" button.</p>
              <button 
                onClick={handleAddStrategy}
                className="bg-[#802BB1] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#9030d0] transition-all mx-auto"
              >
                <Plus size={20} />
                Add First Strategy
              </button>
            </div>
          )}
          
          {/* Comments Section */}
          {currentMapStrategies.length > 0 && currentStrategy && !isEditing && (
            <div className="mt-8 bg-[#2D283E] rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Team Discussion</h3>
              
              <div className="space-y-4 mb-6">
                {currentStrategy.comments && currentStrategy.comments.length > 0 ? (
                  currentStrategy.comments.map(comment => (
                    <div key={comment.id} className="bg-[#1E1A25] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#802BB1]/20 flex items-center justify-center text-[#802BB1] font-bold">
                            {comment.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-[#ECE8E1]/80 mt-1">{comment.text}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#ECE8E1]/60">
                    No comments yet. Be the first to add a comment!
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                />
                <button 
                  onClick={handleAddComment}
                  className="bg-[#802BB1] text-white px-4 py-2 rounded-lg hover:bg-[#9030d0] transition-all"
                  disabled={newComment.trim() === ""}
                >
                  Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playbook Modal */}
      {showPlaybookModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D283E] rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingPlaybook ? "Edit Playbook" : "Create New Playbook"}
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-2">Playbook Name</label>
              <input 
                type="text" 
                value={newPlaybookName}
                onChange={(e) => setNewPlaybookName(e.target.value)}
                placeholder="e.g., VCT Masters, Challengers, Scrims"
                className="w-full bg-[#1E1A25] border border-[#564F6F] rounded-lg p-3 text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#ECE8E1]/60 mb-2">Select Maps</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {maps.map(map => (
                  <div 
                    key={map.id}
                    onClick={() => toggleMapSelection(map.id)}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedMapIds.includes(map.id) 
                        ? 'border-[#802BB1] bg-[#802BB1]/10' 
                        : 'border-[#564F6F] bg-[#1E1A25] hover:bg-[#1E1A25]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm border ${
                        selectedMapIds.includes(map.id) 
                          ? 'bg-[#802BB1] border-[#802BB1]' 
                          : 'border-[#ECE8E1]/40'
                      }`}>
                        {selectedMapIds.includes(map.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span>{map.name}</span>
                    </div>
                   </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between gap-3 mt-8">
              <div>
                {editingPlaybook && playbooks.length > 1 && (
                  <button 
                    onClick={handleDeletePlaybook}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={18} />
                    Delete Playbook
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPlaybookModal(false)}
                  className="px-4 py-2 rounded-lg hover:bg-[#1E1A25] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePlaybook}
                  className="bg-[#802BB1] text-white px-6 py-2 rounded-lg hover:bg-[#9030d0] transition-all"
                  disabled={newPlaybookName.trim() === "" || selectedMapIds.length === 0}
                >
                  {editingPlaybook ? "Update Playbook" : "Create Playbook"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategies Popup */}
      {showStrategiesPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 md:items-center">
          <div className="bg-[#2D283E] rounded-t-xl md:rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">All {currentMap?.name} Strategies</h2>
              <button 
                onClick={() => setShowStrategiesPopup(false)}
                className="p-2 rounded-full hover:bg-[#1E1A25]"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {filteredStrategies.map((strategy, index) => (
                <div 
                  key={index}
                  onClick={() => handleStrategySelect(index)}
                  className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-[#1E1A25] transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={strategy.image} 
                      alt={strategy.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{strategy.title}</h3>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${
                        strategy.side === "Attack" ? "bg-[#FF4655]/20 text-[#FF4655]" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {strategy.side}
                      </div>
                    </div>
                    <p className="text-sm text-[#ECE8E1]/60 line-clamp-1">{strategy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImageModal && currentStrategy && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            <button 
              onClick={() => setShowFullImageModal(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-all z-10"
            >
              <X size={24} />
            </button>
            <img 
              src={currentStrategy.images ? currentStrategy.images[currentStrategy.currentImageIndex || 0] : currentStrategy.image} 
              alt={currentStrategy.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Floating Button for Strategies */}
      <button
        onClick={() => setShowStrategiesPopup(true)}
        className="fixed bottom-6 right-6 bg-[#802BB1] text-white p-4 rounded-full shadow-lg hover:bg-[#9030d0] transition-colors z-40"
      >
        <List size={24} />
      </button>
    </div>
  );
}

export default Playbook;