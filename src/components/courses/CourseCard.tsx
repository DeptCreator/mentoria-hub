'use client';

import { BookOpen, Clock, BarChart } from 'lucide-react';
import { Course } from '@/types';
import Link from 'next/link';

interface Props {
  course: Course;
  isEnrolled: boolean;
  progress?: number;
  onEnroll: () => void;
}

export default function CourseCard({ course, isEnrolled, progress, onEnroll }: Props) {
  const levelBadge = (level: string) => {
    const badges: Record<string, { class: string; color: string }> = {
      'beginner': { class: 'badge-green', color: '#63b388' },
      'intermediate': { class: 'badge-gold', color: 'var(--accent)' },
      'advanced': { class: 'badge-coral', color: '#dc7864' },
    };
    return badges[level] || badges.beginner;
  };

  const badge = levelBadge(course.level);
  const pct = progress || 0;

  return (
    <div className="glass glass-lg card-hover p-6 flex flex-col gap-4"
      style={{ transition: 'all 0.3s ease' }}
      onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
    >
      {/* Thumbnail */}
      <div className="w-full h-[160px] rounded-[var(--radius-sm)] overflow-hidden mb-2"
        style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.12), rgba(130,160,220,0.12))' }}
      >
        <div className="w-full h-full flex items-center justify-center text-[64px]">
          {course.category === 'Math' ? '📐' : 
           course.category === 'English' ? '📖' :
           course.category === 'Physics' ? '⚡' :
           course.category === 'Biology' ? '🧬' :
           course.category === 'Economics' ? '📈' :
           course.category === 'Programming' ? '💻' : '📚'}
        </div>
      </div>

      {/* Badge + Bookmark */}
      <div className="flex items-center justify-between">
        <span className={`badge ${badge.class}`}>
          {course.level}
        </span>
        <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <svg className="w-4 h-4" style={{ color: 'var(--fg-dim)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-[18px] leading-tight" style={{ color: 'var(--fg)' }}>
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: 'var(--fg-dim)' }}>
        {course.description}
      </p>

      {/* Instructor */}
      <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[12px]"
          style={{ background: 'var(--surface)' }}
        >
          👤
        </div>
        Mentoria Team
      </div>

      {/* Progress or Meta */}
      {isEnrolled ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[13px]">
            <span style={{ color: 'var(--fg-dim)' }}>{pct}% complete</span>
            <span style={{ color: 'var(--muted)' }}>{course.lessons?.length || 0} lessons</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: pct + '%' }} />
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="btn-gold w-full text-center no-underline inline-block"
          >
            {pct === 100 ? 'Review' : 'Continue Learning'}
          </Link>
        </div>
      ) : (
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-4 text-[13px]" style={{ color: 'var(--muted)' }}>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {course.lessons?.length || 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              4 weeks
            </span>
          </div>
          <button
            onClick={onEnroll}
            className="w-full btn-gold text-center"
          >
            Enroll Now
          </button>
        </div>
      )}
    </div>
  );
}
