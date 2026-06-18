'use client';

import { Bookmark, Calendar, MapPin, Users } from 'lucide-react';
import { Opportunity } from '@/types';

interface Props {
  opportunity: Opportunity;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

export default function OpportunityCard({ opportunity, isSaved, onSave, onUnsave }: Props) {
  const badgeColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Business': 'badge-green',
      'STEM': 'badge-blue',
      'Social Impact': 'badge-amber',
      'Finance': 'badge-blue',
      'Programming': 'badge-blue',
      'Science': 'badge-blue',
      'Humanities': 'badge-amber',
      'University Prep': 'badge-blue',
    };
    return colors[cat] || 'badge-blue';
  };

  return (
    <div className="opp-card rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all card-hover relative">
      <div className="flex items-start justify-between mb-3">
        <span className={`card-badge inline-block rounded-[var(--radius-full)] px-2.5 py-1 text-[11px] font-semibold tracking-wide ${badgeColor(opportunity.category)}`}>
          {opportunity.category}
        </span>
        <button
          onClick={isSaved ? onUnsave : onSave}
          className={`bookmark-btn h-[34px] w-[34px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] grid place-items-center text-[16px] transition-all ${
            isSaved ? 'text-[var(--accent)] border-[var(--accent)] bg-[var(--accent-light)]' : 'text-[var(--fg-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
          }`}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <h3 className="text-[17px] font-bold text-[var(--fg)] mb-1.5 leading-tight">{opportunity.title}</h3>
      <p className="text-[13px] text-[var(--fg-secondary)] mb-3.5 leading-relaxed line-clamp-2">{opportunity.description}</p>

      <div className="flex flex-wrap gap-3 text-[12px] text-[var(--fg-muted)] mb-3.5">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {opportunity.format}
        </span>
        {opportunity.grade_min && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Grades {opportunity.grade_min}-{opportunity.grade_max}
          </span>
        )}
        {opportunity.deadline && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {new Date(opportunity.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <a
          href={opportunity.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--primary)] px-3.5 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-[var(--primary-hover)] no-underline"
        >
          Apply ↗
        </a>
      </div>
    </div>
  );
}
