'use client';

import { BookOpen, Clock, BarChart, PlayCircle } from 'lucide-react';
import { Course } from '@/types';
import Link from 'next/link';

interface Props {
  course: Course;
  isEnrolled: boolean;
  progress: number;
}

export default function CourseCard({ course, isEnrolled, progress }: Props) {
  const lessonsCount = course.lessons?.length || 0;
  const level = course.level || 'beginner';
  const levelColors: Record<string, { bg: string; color: string }> = {
    beginner: { bg: 'rgba(99,179,136,0.18)', color: '#63b388' },
    intermediate: { bg: 'rgba(201,169,110,0.18)', color: '#c9a96e' },
    advanced: { bg: 'rgba(220,120,100,0.18)', color: '#dc7864' },
  };
  const l = levelColors[level] || levelColors.beginner;

  return (
    <Link
      href={`/courses/${course.id}`}
      className="glass glass-lg card-hover p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 transition-all hover-lift no-underline group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full" style={{ background: l.bg, color: l.color }}>
              {level}
            </span>
            <span className="badge-blue text-[11px] sm:text-[12px]">{course.category}</span>
          </div>
          <h3 className="font-bold text-[16px] sm:text-[18px] leading-tight group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--fg)' }}>
            {course.title}
          </h3>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--accent)' }} />
        </div>
      </div>

      <p className="text-[13px] sm:text-[14px] leading-relaxed line-clamp-2" style={{ color: 'var(--fg-dim)' }}>
        {course.description}
      </p>

      <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px]" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {course.duration_hours || `${lessonsCount * 2}h`}
        </span>
        <span className="flex items-center gap-1">
          <PlayCircle className="w-3.5 h-3.5" />
          {lessonsCount} lessons
        </span>
      </div>

      {isEnrolled ? (
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2 text-[13px]">
            <span style={{ color: 'var(--muted)' }}>Progress</span>
            <span className="font-semibold" style={{ color: progress === 100 ? '#63b388' : 'var(--accent)' }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? '#63b388' : '' }} />
          </div>
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
              {progress === 100 ? 'Completed 🎉' : 'Continue Learning →'}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-2">
          <span className="btn-gold w-full justify-center inline-flex items-center gap-2" style={{ pointerEvents: 'none' }}>
            Enroll Now
          </span>
        </div>
      )}
    </Link>
  );
}
