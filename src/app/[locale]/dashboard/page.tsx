'use client';

import { useAuth } from '@/hooks/useAuth';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCourses } from '@/hooks/useCourses';
import { useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen, Trophy, Award, Calendar } from 'lucide-react';

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
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please sign in to view your dashboard</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Login to track your progress and saved opportunities</p>
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* My Courses */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h2>
          </div>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {enrolledCourses.map(course => {
                const enrollment = enrollments.find(e => e.course_id === course.id);
                return (
                  <div key={course.id} className="flex items-center justify-between">
                    <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {course.title}
                    </Link>
                    <span className="text-sm text-gray-500">{enrollment?.progress_percent || 0}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No enrolled courses yet</p>
          )}
        </div>

        {/* Saved Opportunities */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Opportunities</h2>
          </div>
          {savedOpportunities.length > 0 ? (
            <div className="space-y-3">
              {savedOpportunities.slice(0, 5).map(so => (
                <div key={so.id} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{so.opportunity?.title}</span>
                  <span className="text-sm text-gray-500">{so.opportunity?.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No saved opportunities</p>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
          </div>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map(opportunity => (
                <div key={opportunity!.id} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{opportunity!.title}</span>
                  <span className="text-sm text-red-500">{new Date(opportunity!.deadline!).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
          )}
        </div>

        {/* Achievements */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Complete courses to earn achievements</p>
        </div>

        {/* Certificates */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Certificates</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Complete courses to earn certificates</p>
        </div>
      </div>
    </div>
  );
}
