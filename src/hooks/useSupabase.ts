import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import { uploadStrategyImage, deleteStrategyImage } from '../lib/supabase';

export function usePlaybooks() {
  const [playbooks, setPlaybooks] = useState<Database['public']['Tables']['playbooks']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  async function fetchPlaybooks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaybooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch playbooks'));
      console.error('Error fetching playbooks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createPlaybook(name: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('playbooks')
        .insert([{ name, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setPlaybooks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating playbook:', err);
      throw err instanceof Error ? err : new Error('Failed to create playbook');
    }
  }

  async function updatePlaybook(id: string, name: string) {
    try {
      const { data, error } = await supabase
        .from('playbooks')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPlaybooks(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating playbook:', err);
      throw err instanceof Error ? err : new Error('Failed to update playbook');
    }
  }

  async function deletePlaybook(id: string) {
    try {
      const { error } = await supabase
        .from('playbooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlaybooks(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting playbook:', err);
      throw err instanceof Error ? err : new Error('Failed to delete playbook');
    }
  }

  return {
    playbooks,
    loading,
    error,
    createPlaybook,
    updatePlaybook,
    deletePlaybook,
    refreshPlaybooks: fetchPlaybooks
  };
}

export function useStrategies(playbookId: string) {
  const [strategies, setStrategies] = useState<Database['public']['Tables']['strategies']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (playbookId) {
      fetchStrategies();
    }
  }, [playbookId]);

  async function fetchStrategies() {
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select(`
          *,
          strategy_images (*)
        `)
        .eq('playbook_id', playbookId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStrategies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch strategies'));
    } finally {
      setLoading(false);
    }
  }

  async function createStrategy(strategy: Database['public']['Tables']['strategies']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('strategies')
        .insert([strategy])
        .select()
        .single();

      if (error) throw error;
      setStrategies(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create strategy');
    }
  }

  async function updateStrategy(
    id: string,
    updates: Database['public']['Tables']['strategies']['Update']
  ) {
    try {
      const { data, error } = await supabase
        .from('strategies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setStrategies(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update strategy');
    }
  }

  async function deleteStrategy(id: string) {
    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStrategies(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete strategy');
    }
  }

  return {
    strategies,
    loading,
    error,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    refreshStrategies: fetchStrategies
  };
}

export function useStrategyImages(strategyId: string) {
  const [images, setImages] = useState<Database['public']['Tables']['strategy_images']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (strategyId) {
      fetchImages();
    }
  }, [strategyId]);

  async function fetchImages() {
    try {
      const { data, error } = await supabase
        .from('strategy_images')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
    } finally {
      setLoading(false);
    }
  }

  async function addImage(file: File) {
    try {
      const url = await uploadStrategyImage(file, strategyId);
      if (!url) throw new Error('Failed to upload image');

      const { data, error } = await supabase
        .from('strategy_images')
        .insert([{
          strategy_id: strategyId,
          image_url: url,
          storage_path: `strategy-images/${strategyId}/${file.name}`
        }])
        .select()
        .single();

      if (error) throw error;
      setImages(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add image');
    }
  }

  async function deleteImage(id: string, storagePath: string) {
    try {
      await deleteStrategyImage(storagePath);
      
      const { error } = await supabase
        .from('strategy_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete image');
    }
  }

  return {
    images,
    loading,
    error,
    addImage,
    deleteImage,
    refreshImages: fetchImages
  };
}

export function useComments(strategyId: string) {
  const [comments, setComments] = useState<Database['public']['Tables']['comments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (strategyId) {
      fetchComments();
    }
  }, [strategyId]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setLoading(false);
    }
  }

  async function addComment(text: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          strategy_id: strategyId,
          user_id: userId,
          text
        }])
        .select()
        .single();

      if (error) throw error;
      setComments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add comment');
    }
  }

  async function deleteComment(id: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete comment');
    }
  }

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refreshComments: fetchComments
  };
}