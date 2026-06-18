'use client';

import { CATEGORIES, FORMATS, GRADES } from '@/lib/constants';

interface Props {
  filters: any;
  onChange: (filters: any) => void;
}

export default function OpportunityFilters({ filters, onChange }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
          <select
            value={filters.format || ''}
            onChange={(e) => onChange({ ...filters, format: e.target.value || undefined })}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Formats</option>
            {FORMATS.map(fmt => (
              <option key={fmt} value={fmt}>{fmt.charAt(0).toUpperCase() + fmt.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
          <select
            value={filters.grade || ''}
            onChange={(e) => onChange({ ...filters, grade: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Grades</option>
            {GRADES.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onChange({})}
          className="w-full rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
