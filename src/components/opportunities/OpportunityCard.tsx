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
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {opportunity.category}
        </div>
        <button
          onClick={isSaved ? onUnsave : onSave}
          className={`rounded p-2 transition ${isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
        >
          <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{opportunity.title}</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{opportunity.description}</p>

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {opportunity.format}
        </span>
        {opportunity.grade_min && (
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Grades {opportunity.grade_min}-{opportunity.grade_max}
          </span>
        )}
        {opportunity.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {new Date(opportunity.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {opportunity.requirements.length > 0 && (
        <div className="mb-4">
          <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Requirements:</p>
          <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
            {opportunity.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={opportunity.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Apply Now
      </a>
    </div>
  );
}
