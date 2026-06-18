'use client';

import { useState } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import OpportunityCard from './OpportunityCard';
import OpportunityFilters from './OpportunityFilters';
import { SkeletonGrid } from '@/components/layout/Skeleton';

export default function OpportunityList() {
  const { opportunities, loading, error, saveOpportunity, unsaveOpportunity, isSaved, fetchOpportunities } = useOpportunities();
  const { user, isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({ category: 'all', grade: 'all', format: 'all' });

  const filtered = opportunities.filter(o => {
    if (filters.category !== 'all' && o.category !== filters.category) return false;
    if (filters.grade !== 'all' && (o.grade_min || 0) > parseInt(filters.grade)) return false;
    if (filters.grade !== 'all' && (o.grade_max || 12) < parseInt(filters.grade)) return false;
    if (filters.format !== 'all' && o.format !== filters.format) return false;
    return true;
  });

  const handleSave = async (oppId: string) => {
    if (!user) return;
    await saveOpportunity(user.id, oppId);
  };

  const handleUnsave = async (oppId: string) => {
    if (!user) return;
    await unsaveOpportunity(user.id, oppId);
  };

  if (loading) return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="h-8 w-64 rounded mb-8 animate-pulse" style={{ background: 'var(--border)' }} />
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}><p style={{ color: '#dc7864' }}>{error}</p></div>;

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold" style={{ color: 'var(--fg)' }}>Educational Opportunities</h2>
            <p style={{ color: 'var(--fg-dim)' }}>Find competitions, scholarships, and internships</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Competitions', 'Scholarships', 'Internships'].map(tab => (
              <button key={tab} className="tag-pill selected" style={{ fontSize: '13px', padding: '6px 14px' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="lg:w-[260px] flex-shrink-0">
            <OpportunityFilters filters={filters} onChange={setFilters} />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={isSaved(opp.id)}
                    onSave={() => handleSave(opp.id)}
                    onUnsave={() => handleUnsave(opp.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass p-12 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--fg-dim)' }}>No opportunities match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
