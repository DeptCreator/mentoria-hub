'use client';

import { useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import CourseCard from './CourseCard';
import { SkeletonGrid } from '@/components/layout/Skeleton';
import { Search, Filter } from 'lucide-react';
import { LEVELS, CATEGORIES } from '@/lib/constants';

export default function CourseList() {
  const { user, isAuthenticated } = useAuth();
  const { courses, enrollments, loading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const filtered = courses.filter(c => {
    if (category !== 'all' && c.category !== category) return false;
    if (level !== 'all' && c.level !== level) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${c.title} ${c.description} ${c.category}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const getProgress = (courseId: string) => {
    const e = enrollments.find(e => e.course_id === courseId);
    return e?.progress_percent || 0;
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="h-8 w-64 rounded shimmer mb-8" />
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="glass glass-xl p-6 sm:p-8 text-center max-w-md">
          <p className="text-red-400 mb-2">Error loading courses</p>
          <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent)' }}>Learn</div>
          <h2 className="font-display text-[clamp(1.75rem,6vw,3rem)] font-bold mb-2" style={{ color: 'var(--fg)' }}>Courses</h2>
          <p className="max-w-[600px] text-[14px] sm:text-[16px]" style={{ color: 'var(--fg-dim)' }}>
            Self-paced courses with video lessons, quizzes, and certificates.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input pl-9 pr-8 appearance-none cursor-pointer w-full"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="glass-input pr-8 appearance-none cursor-pointer flex-1 sm:flex-none"
            >
              <option value="all">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] sm:text-[14px]" style={{ color: 'var(--muted)' }}>
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
          </span>
          {isAuthenticated && (
            <span className="text-[13px] sm:text-[14px]" style={{ color: 'var(--accent)' }}>
              {enrollments.length} enrolled
            </span>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled(course.id)}
                progress={getProgress(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass p-6 sm:p-10 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
            <p className="text-[16px] sm:text-[18px] font-semibold mb-1" style={{ color: 'var(--fg)' }}>No courses found</p>
            <p className="text-[13px] sm:text-[14px]" style={{ color: 'var(--fg-dim)' }}>Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
