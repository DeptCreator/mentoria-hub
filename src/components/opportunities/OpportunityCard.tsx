'use client';

import { Bookmark, Calendar, Users, ExternalLink } from 'lucide-react';
import { Opportunity } from '@/types';

interface Props {
  opportunity: Opportunity;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
  isAuthenticated: boolean;
}

export default function OpportunityCard({ opportunity, isSaved, onSave, onUnsave, isAuthenticated }: Props) {
  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No deadline';

  const formatBadge = (format: string) => format?.charAt(0).toUpperCase() + format?.slice(1) || 'Online';

  return (
    <div className="glass glass-lg card-hover p-6 flex flex-col gap-4 transition-all hover-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="badge-gold">{opportunity.category}</span>
            <span className="badge-blue">{formatBadge(opportunity.format)}</span>
            {opportunity.grade_min && (
              <span className="badge-green">Grades {opportunity.grade_min}-{opportunity.grade_max || opportunity.grade_min}</span>
            )}
          </div>
          <h3 className="font-bold text-[18px] leading-tight" style={{ color: 'var(--fg)' }}>{opportunity.title}</h3>
        </div>
        {isAuthenticated && (
          <button
            onClick={isSaved ? onUnsave : onSave}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active-press"
            style={{
              background: isSaved ? 'var(--accent)' : 'var(--surface)',
              border: isSaved ? 'none' : '1px solid var(--border)',
              color: isSaved ? '#0a0a0f' : 'var(--fg-dim)',
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            title={isSaved ? 'Saved' : 'Save'}
          >
            <Bookmark className="w-4.5 h-4.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: 'var(--fg-dim)' }}>
        {opportunity.description}
      </p>

      <div className="flex flex-col gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {deadline}</span>
        </div>
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="flex items-start gap-2">
            <Users className="w-3.5 h-3.5 mt-0.5" />
            <span className="line-clamp-2">{opportunity.requirements.join(', ')}</span>
          </div>
        )}
      </div>

      <a
        href={opportunity.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold w-full justify-center mt-auto inline-flex items-center gap-2 no-underline"
      >
        Apply Now
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
