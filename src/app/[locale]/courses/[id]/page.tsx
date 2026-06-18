'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import LessonPlayer from '@/components/courses/LessonPlayer';
import LessonQuiz from '@/components/courses/LessonQuiz';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { courses, enroll, getEnrollment, isEnrolled, updateProgress, getLessonProgress, fetchEnrollments } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<any>({});
  const [showQuiz, setShowQuiz] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const enrollment = getEnrollment(courseId);

  useEffect(() => {
    if (user && isEnrolled(courseId)) {
      fetchEnrollments(user.id);
    }
  }, [user, courseId, isEnrolled]);

  const handleEnroll = async () => {
    if (!user) return;
    await enroll(user.id, courseId);
  };

  const handleLessonComplete = async () => {
    if (!user || !course) return;
    const lesson = course.lessons?.[activeLesson];
    if (!lesson) return;

    await updateProgress(user.id, lesson.id, {
      is_completed: true,
      is_video_watched: true,
    });

    setLessonProgress((prev: any) => ({
      ...prev,
      [lesson.id]: { is_completed: true }
    }));

    if (lesson.quiz_questions && lesson.quiz_questions.length > 0) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = async (score: number) => {
    if (!user || !course) return;
    const lesson = course.lessons?.[activeLesson];
    if (!lesson) return;

    await updateProgress(user.id, lesson.id, {
      quiz_score: score,
    });

    setShowQuiz(false);
    if (activeLesson < (course.lessons?.length || 0) - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  if (!course) return <div className="py-10 text-center">Loading course...</div>;

  const lessons = course.lessons || [];
  const currentLesson = lessons[activeLesson];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href="/courses" className="text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Courses
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{course.description}</p>
      </div>

      {!isEnrolled(courseId) ? (
        <div className="rounded-lg bg-blue-50 p-6 text-center dark:bg-blue-900/20">
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">Enroll to access lessons</p>
          <button
            onClick={handleEnroll}
            className="rounded bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
          >
            Enroll Now
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentLesson && (
              <div>
                {showQuiz ? (
                  <LessonQuiz
                    questions={currentLesson.quiz_questions}
                    onComplete={handleQuizComplete}
                  />
                ) : (
                  <LessonPlayer
                    lesson={currentLesson}
                    onComplete={handleLessonComplete}
                  />
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Lessons</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => { setActiveLesson(index); setShowQuiz(false); }}
                    className={`w-full rounded-lg p-3 text-left transition ${
                      index === activeLesson
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{index + 1}. {lesson.title}</span>
                      {lessonProgress[lesson.id]?.is_completed && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {enrollment && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{enrollment.progress_percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${enrollment.progress_percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
