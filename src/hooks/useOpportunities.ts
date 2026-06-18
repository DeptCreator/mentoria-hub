'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Opportunity, SavedOpportunity } from '@/types';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      let query = supabaseBrowser.from('opportunities').select('*');
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.format) {
        query = query.eq('format', filters.format);
      }
      if (filters?.grade) {
        query = query.lte('grade_min', filters.grade).gte('grade_max', filters.grade);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setOpportunities(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedOpportunities = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('saved_opportunities')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      setSavedOpportunities(data || []);
    } catch (err: any) {
      console.error('Error fetching saved opportunities:', err);
    }
  }, []);

  const saveOpportunity = useCallback(async (userId: string, opportunityId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('saved_opportunities')
        .insert({ user_id: userId, opportunity_id: opportunityId })
        .select()
        .single();
      
      if (error) throw error;
      setSavedOpportunities(prev => [...prev, data]);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }, []);

  const unsaveOpportunity = useCallback(async (userId: string, opportunityId: string) => {
    try {
      const { error } = await supabaseBrowser
        .from('saved_opportunities')
        .delete()
        .eq('user_id', userId)
        .eq('opportunity_id', opportunityId);
      
      if (error) throw error;
      setSavedOpportunities(prev => prev.filter(so => so.opportunity_id !== opportunityId));
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }, []);

  const isSaved = useCallback((opportunityId: string) => {
    return savedOpportunities.some(so => so.opportunity_id === opportunityId);
  }, [savedOpportunities]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    savedOpportunities,
    loading,
    error,
    fetchOpportunities,
    fetchSavedOpportunities,
    saveOpportunity,
    unsaveOpportunity,
    isSaved,
  };
}
