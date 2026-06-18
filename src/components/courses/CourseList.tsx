'use client';

import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import CourseCard from './CourseCard';
import { SkeletonGrid } from '@/components/layout/Skeleton';

export default function CourseList() {
  const { courses, loading, error, enroll, getEnrollment, isEnrolled, fetchEnrollments } = useCourses();
  const { user, isAuthenticated } = useAuth();

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    await enroll(user.id, courseId);
  };

  if (loading) return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="h-8 w-48 rounded mb-8 animate-pulse" style={{ background: 'var(--border)' }} />
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}><p style={{ color: '#dc7864' }}>{error}</p></div>;

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold" style={{ color: 'var(--fg)' }}>Courses</h2>
            <p style={{ color: 'var(--fg-dim)' }}>Self-paced learning with video lessons and quizzes</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Design', 'Development', 'Business'].map(tab => (
              <button key={tab} className="tag-pill selected" style={{ fontSize: '13px', padding: '6px 14px' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {courses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled(course.id)}
                progress={getEnrollment(course.id)?.progress_percent}
                onEnroll={() => handleEnroll(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--fg-dim)' }}>No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
