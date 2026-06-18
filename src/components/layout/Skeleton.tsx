'use client';

export default function SkeletonCard() {
  return (
    <div className="glass glass-lg p-6 animate-pulse"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="w-full h-[140px] rounded-[var(--radius-sm)] mb-4" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--border)' }} />
      <div className="h-6 w-3/4 rounded mb-2" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-full rounded mb-1" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-2/3 rounded mb-4" style={{ background: 'var(--border)' }} />
      <div className="flex gap-2 mb-3">
        <div className="h-3 w-16 rounded" style={{ background: 'var(--border)' }} />
        <div className="h-3 w-16 rounded" style={{ background: 'var(--border)' }} />
      </div>
      <div className="h-10 w-full rounded-full mt-2" style={{ background: 'var(--border)' }} />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded" style={{ background: 'var(--border)' }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-6" style={{ background: 'var(--surface)' }}>
            <div className="h-10 w-10 rounded-lg mb-3" style={{ background: 'var(--border)' }} />
            <div className="h-6 w-16 rounded mb-1" style={{ background: 'var(--border)' }} />
            <div className="h-4 w-24 rounded" style={{ background: 'var(--border)' }} />
          </div>
        ))}
      </div>
      <div className="h-64 glass rounded-[var(--radius-lg)]" style={{ background: 'var(--surface)' }} />
    </div>
  );
}
