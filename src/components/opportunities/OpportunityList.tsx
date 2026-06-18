'use client';

import { useState, useEffect } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import OpportunityCard from './OpportunityCard';
import OpportunityFilters from './OpportunityFilters';
import { SkeletonGrid } from '@/components/layout/Skeleton';
import { Search } from 'lucide-react';

export default function OpportunityList() {
  const { user, isAuthenticated } = useAuth();
  const {
    opportunities,
    savedOpportunities,
    loading,
    error,
    fetchOpportunities,
    saveOpportunity,
    unsaveOpportunity,
    isSaved,
    fetchSavedOpportunities,
  } = useOpportunities();
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOpportunities(filters);
  }, [filters, fetchOpportunities]);

  useEffect(() => {
    if (user) fetchSavedOpportunities(user.id);
  }, [user, fetchSavedOpportunities]);

  const handleSave = async (opportunityId: string) => {
    if (!user) return;
    await saveOpportunity(user.id, opportunityId);
  };

  const handleUnsave = async (opportunityId: string) => {
    if (!user) return;
    await unsaveOpportunity(user.id, opportunityId);
  };

  const filtered = opportunities.filter(o => {
    if (filters.category && o.category !== filters.category) return false;
    if (filters.format && o.format !== filters.format) return false;
    if (filters.grade) {
      const grade = Number(filters.grade);
      const min = o.grade_min ?? 0;
      const max = o.grade_max ?? 12;
      if (grade < min || grade > max) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${o.title} ${o.description} ${o.category}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="h-8 w-64 rounded shimmer mb-8" />
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="h-[400px] rounded shimmer" />
            <SkeletonGrid count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[100px] px-6 pb-16 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="glass glass-xl p-8 text-center max-w-md">
          <p className="text-red-400 mb-2">Error loading opportunities</p>
          <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent)' }}>Explore</div>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold mb-2" style={{ color: 'var(--fg)' }}>Opportunities</h2>
          <p className="max-w-[600px]" style={{ color: 'var(--fg-dim)' }}>
            Competitions, internships, scholarships, and programs curated for your profile.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr] items-start">
          <OpportunityFilters filters={filters} onChange={setFilters} />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px]" style={{ color: 'var(--muted)' }}>
                {filtered.length} opportunity{filtered.length !== 1 ? 'ies' : 'y'} found
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 stagger-children">
                {filtered.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isSaved={isSaved(opportunity.id)}
                    onSave={() => handleSave(opportunity.id)}
                    onUnsave={() => handleUnsave(opportunity.id)}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="glass p-10 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
                <p className="text-[18px] font-semibold mb-1" style={{ color: 'var(--fg)' }}>No opportunities found</p>
                <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
