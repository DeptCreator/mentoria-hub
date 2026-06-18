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
      'Social Impact': 'badge-gold',
      'Finance': 'badge-coral',
      'Programming': 'badge-blue',
      'Science': 'badge-green',
      'English': 'badge-gold',
      'University Prep': 'badge-coral',
    };
    return colors[cat] || 'badge-gold';
  };

  return (
    <div className="glass glass-lg card-hover p-6 flex flex-col gap-4"
      style={{ transition: 'all 0.3s ease' }}
      onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
    >
      {/* Header image */}
      <div className="w-full h-[140px] rounded-[var(--radius-sm)] overflow-hidden mb-2"
        style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(130,160,220,0.15))' }}
      >
        <div className="w-full h-full flex items-center justify-center text-[48px]">
          {opportunity.category === 'STEM' ? '🔬' : 
           opportunity.category === 'Business' ? '💼' :
           opportunity.category === 'Programming' ? '💻' :
           opportunity.category === 'English' ? '📚' :
           opportunity.category === 'Science' ? '🔭' : '🎯'}
        </div>
      </div>

      {/* Badge + Save */}
      <div className="flex items-center justify-between">
        <span className={`badge ${badgeColor(opportunity.category)}`}>
          {opportunity.category}
        </span>
        <button
          onClick={() => isSaved ? onUnsave() : onSave()}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
          style={{ background: isSaved ? 'var(--accent)' : 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Bookmark className="w-4 h-4" style={{ color: isSaved ? '#0a0a0f' : 'var(--fg-dim)', fill: isSaved ? '#0a0a0f' : 'none' }} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-[18px] leading-tight" style={{ color: 'var(--fg)' }}>
        {opportunity.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: 'var(--fg-dim)' }}>
        {opportunity.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-[13px]" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {opportunity.format}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          Grades {opportunity.grade_min}-{opportunity.grade_max}
        </span>
        {opportunity.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <a
          href={opportunity.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[14px] font-semibold no-underline transition-all"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e0c080'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)'; }}
        >
          View Details →
        </a>
      </div>
    </div>
  );
}
