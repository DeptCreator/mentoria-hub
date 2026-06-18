'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { MOCK_OPPORTUNITIES } from '@/lib/mock-data';
import { Opportunity, SavedOpportunity } from '@/types';

function isNotFound(error: any) {
  return error?.code === 'PGRST116' || error?.message?.includes('404') || error?.message?.includes('relation') || error?.code === '42P01';
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const fetchOpportunities = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
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
      
      if (error) {
        if (isNotFound(error)) {
          setUseMock(true);
          setOpportunities(MOCK_OPPORTUNITIES);
        } else {
          throw error;
        }
      } else {
        setOpportunities(data || []);
        setUseMock(false);
      }
    } catch (err: any) {
      setError(err.message);
      setUseMock(true);
      setOpportunities(MOCK_OPPORTUNITIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedOpportunities = useCallback(async (userId: string) => {
    try {
      if (useMock) {
        setSavedOpportunities([]);
        return;
      }
      const { data, error } = await supabaseBrowser
        .from('saved_opportunities')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      setSavedOpportunities(data || []);
    } catch (err: any) {
      console.error('Error fetching saved opportunities:', err);
      setSavedOpportunities([]);
    }
  }, [useMock]);

  const saveOpportunity = useCallback(async (userId: string, opportunityId: string) => {
    try {
      if (useMock) {
        const opportunity = opportunities.find(o => o.id === opportunityId);
        if (!opportunity) return { data: null, error: new Error('Not found') };
        const saved: SavedOpportunity = {
          id: `mock-saved-${opportunityId}`,
          user_id: userId,
          opportunity_id: opportunityId,
          created_at: new Date().toISOString(),
          opportunity,
        };
        setSavedOpportunities(prev => [...prev, saved]);
        return { data: saved, error: null };
      }
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
  }, [useMock, opportunities]);

  const unsaveOpportunity = useCallback(async (userId: string, opportunityId: string) => {
    try {
      if (useMock) {
        setSavedOpportunities(prev => prev.filter(so => so.opportunity_id !== opportunityId));
        return { error: null };
      }
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
  }, [useMock]);

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
