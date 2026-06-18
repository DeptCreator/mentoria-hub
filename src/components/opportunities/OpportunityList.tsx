'use client';

import { useState, useEffect } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import OpportunityCard from './OpportunityCard';
import OpportunityFilters from './OpportunityFilters';
import { SkeletonGrid } from '@/components/layout/Skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16" style={{ background: 'var(--bg)' }}>
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
      <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="glass glass-xl p-6 sm:p-8 text-center max-w-md">
          <p className="text-red-400 mb-2">Error loading opportunities</p>
          <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent)' }}>Explore</div>
          <h2 className="font-display text-[clamp(1.75rem,6vw,3rem)] font-bold mb-2" style={{ color: 'var(--fg)' }}>Opportunities</h2>
          <p className="max-w-[600px] text-[14px] sm:text-[16px]" style={{ color: 'var(--fg-dim)' }}>
            Competitions, internships, scholarships, and programs curated for your profile.
          </p>
        </div>

        {/* Search + mobile filter toggle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center active-press shrink-0"
            style={{ background: 'var(--surface)', color: 'var(--fg)' }}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr] items-start">
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <OpportunityFilters filters={filters} onChange={setFilters} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] sm:text-[14px]" style={{ color: 'var(--muted)' }}>
                {filtered.length} opportunity{filtered.length !== 1 ? 'ies' : 'y'} found
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 stagger-children">
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
              <div className="glass p-6 sm:p-10 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
                <p className="text-[16px] sm:text-[18px] font-semibold mb-1" style={{ color: 'var(--fg)' }}>No opportunities found</p>
                <p className="text-[13px] sm:text-[14px]" style={{ color: 'var(--fg-dim)' }}>Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
