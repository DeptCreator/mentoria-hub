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

  if (loading) return <div className="py-10 text-center">Loading opportunities...</div>;
  if (error) return <div className="py-10 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Educational Opportunities</h1>
      
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <OpportunityFilters filters={filters} onChange={handleFilterChange} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isSaved={isSaved(opportunity.id)}
                onSave={() => handleSave(opportunity.id)}
                onUnsave={() => handleUnsave(opportunity.id)}
              />
            ))}
          </div>
          
          {opportunities.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No opportunities found matching your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
