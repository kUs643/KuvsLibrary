import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Plus, Edit, Save, X, Upload, Trash2,
  MessageSquare, Share, BookOpen, Layers, List, Menu, ArrowUp, Maximize
} from 'lucide-react';
import { usePlaybooks, useStrategies, useStrategyImages, useComments } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

// Maps data remains the same
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

function Playbook() {
  // Get user session
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Supabase hooks
  const { playbooks, loading: loadingPlaybooks, createPlaybook, updatePlaybook, deletePlaybook } = usePlaybooks();
  const [currentPlaybookId, setCurrentPlaybookId] = useState('');
  const [currentMapId, setCurrentMapId] = useState(1);
  const { strategies, loading: loadingStrategies, createStrategy, updateStrategy, deleteStrategy } = useStrategies(currentPlaybookId);
  const [currentStrategyId, setCurrentStrategyId] = useState('');
  const { images, loading: loadingImages, addImage, deleteImage } = useStrategyImages(currentStrategyId);
  const { comments, loading: loadingComments, addComment, deleteComment } = useComments(currentStrategyId);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState(null);
  const [editedSteps, setEditedSteps] = useState([]);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [newPlaybookName, setNewPlaybookName] = useState("");
  const [selectedMapIds, setSelectedMapIds] = useState<number[]>([]);
  const [editingPlaybook, setEditingPlaybook] = useState<null | {id: string, name: string}>(null);
  const [newComment, setNewComment] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [showStrategiesPopup, setShowStrategiesPopup] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial playbook when data loads
  useEffect(() => {
    if (playbooks.length > 0 && !currentPlaybookId) {
      setCurrentPlaybookId(playbooks[0].id);
    }
  }, [playbooks]);

  // Set initial strategy when data loads
  useEffect(() => {
    if (strategies.length > 0 && !currentStrategyId) {
      setCurrentStrategyId(strategies[0].id);
    }
  }, [strategies]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentStrategyId) {
      try {
        await addImage(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Handle strategy save
  const handleSaveStrategy = async () => {
    if (!editedStrategy || !currentStrategyId) return;

    try {
      await updateStrategy(currentStrategyId, {
        title: editedStrategy.title,
        description: editedStrategy.description,
        team: editedStrategy.team,
        side: editedStrategy.side,
        steps: editedSteps
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };

  // Handle new playbook creation
  const handleCreatePlaybook = async () => {
    if (!session?.user?.id || !newPlaybookName.trim()) return;

    try {
      const newPlaybook = await createPlaybook(newPlaybookName, session.user.id);
      setCurrentPlaybookId(newPlaybook.id);
      setShowPlaybookModal(false);
      setNewPlaybookName('');
    } catch (error) {
      console.error('Error creating playbook:', error);
    }
  };

  // Loading state
  if (loadingPlaybooks || loadingStrategies) {
    return (
      <div className="min-h-screen bg-kuvsbook-darker text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading playbook...</p>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  // Keep all the existing JSX and UI logic, just update the data handling to use Supabase

  return (
    <div className="min-h-screen bg-kuvsbook-darker text-white">
      {/* Keep existing JSX structure */}
    </div>
  );
}

export default Playbook;