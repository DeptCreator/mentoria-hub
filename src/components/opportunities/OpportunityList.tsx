'use client';

import { useState } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import OpportunityCard from './OpportunityCard';
import OpportunityFilters from './OpportunityFilters';

export default function OpportunityList() {
  const { opportunities, loading, error, saveOpportunity, unsaveOpportunity, isSaved, fetchOpportunities } = useOpportunities();
  const { user, isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({});

  const handleSave = async (opportunityId: string) => {
    if (!user) return;
    await saveOpportunity(user.id, opportunityId);
  };

  const handleUnsave = async (opportunityId: string) => {
    if (!user) return;
    await unsaveOpportunity(user.id, opportunityId);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchOpportunities(newFilters);
  };

  if (loading) return <div className="py-20 text-center text-[var(--fg-muted)]">Loading opportunities...</div>;
  if (error) return <div className="py-20 text-center text-[var(--danger)]">Error: {error}</div>;

  return (
    <div className="container-page">
      <div className="grid grid-cols-[260px_1fr] gap-8 py-10 max-lg:grid-cols-1">
        <div className="max-lg:static">
          <OpportunityFilters filters={filters} onChange={handleFilterChange} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 content-start">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isSaved={isSaved(opportunity.id)}
              onSave={() => handleSave(opportunity.id)}
              onUnsave={() => handleUnsave(opportunity.id)}
            />
          ))}

          {opportunities.length === 0 && (
            <div className="col-span-full text-center py-20 text-[var(--fg-muted)]">
              <div className="text-[48px] mb-4">🔍</div>
              <h3 className="text-[20px] text-[var(--fg-secondary)] mb-2">No opportunities found</h3>
              <p className="text-[14px]">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
