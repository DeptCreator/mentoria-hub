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
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          {course.level}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{course.category}</span>
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{course.description}</p>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" /> {course.lessons?.length || 0} lessons
        </span>
        {course.duration_hours && (
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {course.duration_hours} hours
          </span>
        )}
      </div>

      {isEnrolled && progress !== undefined && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isEnrolled ? (
        <Link
          href={`/courses/${course.id}`}
          className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {progress !== undefined && progress > 0 && progress < 100 ? 'Continue' : progress === 100 ? 'Completed' : 'Start Learning'}
        </Link>
      ) : (
        <button
          onClick={onEnroll}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
}
