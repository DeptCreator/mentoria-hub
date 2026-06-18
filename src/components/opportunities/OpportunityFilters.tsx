'use client';

import { CATEGORIES, FORMATS } from '@/lib/constants';

interface Props {
  filters: any;
  onChange: (filters: any) => void;
}

export default function OpportunityFilters({ filters, onChange }: Props) {
  const pills = [
    { label: 'All', value: 'all' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
  ];

  return (
    <aside className="sidebar rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 h-fit sticky top-[88px]">
      <h4 className="text-[14px] font-bold uppercase tracking-wider text-[var(--fg-muted)] mb-4">
        Filters
      </h4>

      <div className="filter-group mb-5">
        <label className="block text-[13px] font-semibold text-[var(--fg-secondary)] mb-1.5">Category</label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => onChange({ ...filters, category: e.target.value === 'all' ? undefined : e.target.value })}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--fg)]"
        >
          <option value="all">All</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group mb-5">
        <label className="block text-[13px] font-semibold text-[var(--fg-secondary)] mb-1.5">Grade</label>
        <div className="flex flex-wrap gap-1.5">
          {pills.map(p => (
            <button
              key={p.value}
              onClick={() => onChange({ ...filters, grade: p.value === 'all' ? undefined : parseInt(p.value) })}
              className={`filter-pill rounded-[var(--radius-full)] px-3 py-1.5 text-[12px] font-medium border transition-all cursor-pointer ${
                (p.value === 'all' && !filters.grade) || filters.grade === parseInt(p.value)
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--fg-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group mb-5">
        <label className="block text-[13px] font-semibold text-[var(--fg-secondary)] mb-1.5">Format</label>
        <select
          value={filters.format || 'all'}
          onChange={(e) => onChange({ ...filters, format: e.target.value === 'all' ? undefined : e.target.value })}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--fg)]"
        >
          <option value="all">All</option>
          {FORMATS.map(fmt => (
            <option key={fmt} value={fmt}>{fmt.charAt(0).toUpperCase() + fmt.slice(1)}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onChange({})}
        className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-4 py-2 text-[13px] font-medium text-[var(--fg)] transition-all hover:bg-[var(--surface-hover)]"
      >
        Reset Filters
      </button>
    </aside>
  );
}
