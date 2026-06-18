'use client';

import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import CourseCard from './CourseCard';

export default function CourseList() {
  const { courses, loading, error, enroll, getEnrollment, isEnrolled, fetchEnrollments } = useCourses();
  const { user, isAuthenticated } = useAuth();

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    await enroll(user.id, courseId);
  };

  if (loading) return <div className="py-10 text-center">Loading courses...</div>;
  if (error) return <div className="py-10 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Mentoria Courses</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={isEnrolled(course.id)}
            progress={getEnrollment(course.id)?.progress_percent}
            onEnroll={() => handleEnroll(course.id)}
          />
        ))}
      </div>
    </div>
  );
}
