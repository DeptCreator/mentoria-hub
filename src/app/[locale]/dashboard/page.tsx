'use client';

import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCourses } from '@/hooks/useCourses';
import { useEffect } from 'react';
import Link from 'next/link';
import { SkeletonDashboard } from '@/components/layout/Skeleton';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { savedOpportunities, fetchSavedOpportunities } = useOpportunities();
  const { courses, enrollments, fetchEnrollments } = useCourses();

  useEffect(() => {
    if (user) {
      fetchSavedOpportunities(user.id);
      fetchEnrollments(user.id);
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6" style={{ background: 'var(--bg)' }}>
        <div className="glass glass-xl p-6 sm:p-10 text-center max-w-md">
          <h1 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Please sign in</h1>
          <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>Login to track your progress and saved opportunities.</p>
        </div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const upcomingDeadlines = savedOpportunities
    .map(so => so.opportunity)
    .filter(o => o?.deadline)
    .sort((a, b) => new Date(a!.deadline!).getTime() - new Date(b!.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen pt-[88px] sm:pt-[100px] px-4 sm:px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1300px] mx-auto">
        <h2 className="font-display text-[clamp(1.75rem,6vw,3rem)] font-bold mb-2" style={{ color: 'var(--fg)' }}>Dashboard</h2>
        <p className="mb-6 sm:mb-8 text-[14px] sm:text-[16px]" style={{ color: 'var(--fg-dim)' }}>Welcome back! Here's your progress.</p>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-7">
          {/* My Courses */}
          <div className="glass p-4 sm:p-6 sm:col-span-2 lg:col-span-2" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[16px] sm:text-[18px] mb-3 sm:mb-4" style={{ color: 'var(--fg)' }}>My Courses</h3>
            {enrolledCourses.length > 0 ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                {enrolledCourses.map(course => {
                  const enrollment = enrollments.find(e => e.course_id === course.id);
                  const pct = enrollment?.progress_percent || 0;
                  return (
                    <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 py-2" style={{ borderBottom: pct < 100 ? '1px solid var(--border)' : 'none' }}>
                      <div className="min-w-0">
                        <strong className="text-[14px] sm:text-[16px]" style={{ color: 'var(--fg)' }}>{course.title}</strong>
                        <br /><span className="text-[12px] sm:text-[13px]" style={{ color: 'var(--muted)' }}>{pct}% complete</span>
                      </div>
                      <div className="w-full sm:w-[160px]">
                        <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%', background: pct === 100 ? '#63b388' : '' }}></div></div>
                      </div>
                      <Link href={`/courses/${course.id}`} className="rounded-full px-4 py-1.5 text-[12px] sm:text-[13px] font-semibold no-underline transition-all text-center" style={{ background: 'var(--accent)', color: '#0a0a0f' }}>{pct === 100 ? 'Review' : 'Continue'}</Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>No enrolled courses yet.</p>
            )}
          </div>

          {/* Saved */}
          <div className="glass p-4 sm:p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[16px] sm:text-[18px] mb-3 sm:mb-4" style={{ color: 'var(--fg)' }}>Saved</h3>
            {savedOpportunities.length > 0 ? (
              <div className="flex flex-col gap-3">
                {savedOpportunities.slice(0, 5).map(so => (
                  <div key={so.id} className="text-[13px] sm:text-[14px] py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--fg)' }}>{so.opportunity?.title}</strong>
                    {so.opportunity?.deadline && <><br /><span className="text-[11px] sm:text-[12px]" style={{ color: 'var(--muted)' }}>Deadline: {new Date(so.opportunity.deadline).toLocaleDateString()}</span></>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>No saved opportunities.</p>
            )}
          </div>

          {/* Deadlines */}
          <div className="glass p-4 sm:p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[16px] sm:text-[18px] mb-3 sm:mb-4" style={{ color: 'var(--fg)' }}>Upcoming Deadlines</h3>
            {upcomingDeadlines.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {upcomingDeadlines.map(o => (
                  <div key={o!.id} className="flex gap-2 sm:gap-3 items-start text-[13px] sm:text-[14px]">
                    <span className="text-[18px] sm:text-[20px] shrink-0">📅</span>
                    <span className="leading-tight"><strong>{new Date(o!.deadline!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong> — {o!.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>No upcoming deadlines.</p>
            )}
          </div>

          {/* Achievements */}
          <div className="glass p-4 sm:p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[16px] sm:text-[18px] mb-3 sm:mb-4" style={{ color: 'var(--fg)' }}>Achievements</h3>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[14px] sm:rounded-[16px] flex items-center justify-center text-[24px] sm:text-[28px]" style={{ background: 'rgba(201,169,110,0.15)' }} title="5-day streak">🔥</div>
              <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[14px] sm:rounded-[16px] flex items-center justify-center text-[24px] sm:text-[28px]" style={{ background: 'rgba(99,179,136,0.15)' }} title="First course completed">🎓</div>
              <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[14px] sm:rounded-[16px] flex items-center justify-center text-[24px] sm:text-[28px]" style={{ background: 'rgba(130,160,220,0.15)' }} title="10 quizzes passed">⭐</div>
            </div>
          </div>

          {/* Certificates */}
          <div className="glass p-4 sm:p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[16px] sm:text-[18px] mb-3 sm:mb-4" style={{ color: 'var(--fg)' }}>Certificates</h3>
            <p className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>Complete courses to earn certificates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
