'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import LessonPlayer from '@/components/courses/LessonPlayer';
import LessonQuiz from '@/components/courses/LessonQuiz';
import Certificate from '@/components/courses/Certificate';
import Link from 'next/link';
import { CheckCircle, ChevronLeft, Lock, PlayCircle, Trophy, BookOpen, Award } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { courses, enroll, getEnrollment, isEnrolled, updateProgress, fetchEnrollments, loading } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [activeLesson, setActiveLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  const course = courses.find(c => c.id === courseId);
  const enrollment = getEnrollment(courseId);
  const lessons = course?.lessons || [];
  const currentLesson = lessons[activeLesson];
  const allCompleted = lessons.length > 0 && lessons.every(l => completedLessons.has(l.id));

  useEffect(() => {
    if (user && isEnrolled(courseId)) {
      fetchEnrollments(user.id);
    }
  }, [user, courseId, isEnrolled, fetchEnrollments]);

  const handleEnroll = async () => {
    if (!user) return;
    await enroll(user.id, courseId);
  };

  const handleLessonComplete = async () => {
    if (!user || !currentLesson) return;

    await updateProgress(user.id, currentLesson.id, {
      is_completed: true,
      is_video_watched: true,
    });

    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));

    if (currentLesson.quiz_questions && currentLesson.quiz_questions.length > 0) {
      setShowQuiz(true);
    } else if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const handleQuizComplete = async (score: number) => {
    if (!user || !currentLesson) return;

    await updateProgress(user.id, currentLesson.id, { quiz_score: score });
    setQuizScores(prev => ({ ...prev, [currentLesson.id]: score }));
    setShowQuiz(false);

    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="h-8 w-64 rounded shimmer mb-8" />
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="aspect-video rounded shimmer" />
            <div className="h-[400px] rounded shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[14px] font-medium mb-6 no-underline transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--fg-dim)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Courses
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          {/* Main content */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="badge-blue">{course.category}</span>
                <span className="badge-gold">{course.level}</span>
              </div>
              <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-2" style={{ color: 'var(--fg)' }}>
                {course.title}
              </h1>
              <p className="text-[16px]" style={{ color: 'var(--fg-dim)' }}>{course.description}</p>
            </div>

            {!isEnrolled(courseId) ? (
              <div className="glass glass-xl p-8 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(201,169,110,0.15)' }}>
                  <Lock className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-bold text-[20px] mb-2" style={{ color: 'var(--fg)' }}>Enroll to access lessons</h3>
                <p className="mb-6" style={{ color: 'var(--fg-dim)' }}>Start learning today and track your progress.</p>
                <button onClick={handleEnroll} className="btn-gold">
                  {isAuthenticated ? 'Enroll Now' : 'Sign In to Enroll'}
                </button>
              </div>
            ) : (
              <>
                {allCompleted ? (
                  <Certificate
                    courseName={course.title}
                    studentName={user?.email?.split('@')[0] || 'Student'}
                    completionDate={new Date().toLocaleDateString()}
                    certificateNumber={`MH-${courseId.slice(0, 6).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`}
                  />
                ) : (
                  <>
                    {showQuiz && currentLesson ? (
                      <LessonQuiz questions={currentLesson.quiz_questions || []} onComplete={handleQuizComplete} />
                    ) : currentLesson ? (
                      <LessonPlayer lesson={currentLesson} onComplete={handleLessonComplete} />
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {enrollment && (
              <div className="glass p-5" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-semibold" style={{ color: 'var(--fg)' }}>Course Progress</span>
                  <span className="font-bold" style={{ color: enrollment.progress_percent === 100 ? '#63b388' : 'var(--accent)' }}>
                    {enrollment.progress_percent}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${enrollment.progress_percent}%`, background: enrollment.progress_percent === 100 ? '#63b388' : '' }} />
                </div>
                {enrollment.progress_percent === 100 && (
                  <div className="flex items-center gap-2 mt-3 text-[13px]" style={{ color: '#63b388' }}>
                    <Trophy className="w-4 h-4" /> Course completed!
                  </div>
                )}
              </div>
            )}

            <div className="glass p-5" style={{ borderRadius: 'var(--radius-lg)' }}>
              <h3 className="font-bold text-[16px] mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                Lessons ({lessons.length})
              </h3>
              <div className="flex flex-col gap-2">
                {lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isActive = index === activeLesson;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => { setActiveLesson(index); setShowQuiz(false); }}
                      disabled={!isEnrolled(courseId)}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                        isActive ? 'bg-[var(--surface)] border border-[var(--accent)]' : 'hover:bg-[var(--surface)]'
                      }`}
                      style={{ border: isActive ? '1px solid var(--accent)' : '1px solid transparent' }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                        style={{
                          background: isCompleted ? '#63b388' : isActive ? 'var(--accent)' : 'var(--surface)',
                          color: isCompleted || isActive ? '#0a0a0f' : 'var(--fg-dim)',
                        }}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-medium truncate ${isActive ? 'text-[var(--accent)]' : 'text-[var(--fg)]'}`}>
                          {lesson.title}
                        </p>
                        {quizScores[lesson.id] !== undefined && (
                          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>Quiz: {quizScores[lesson.id]}%</p>
                        )}
                      </div>
                      {!isEnrolled(courseId) && <Lock className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass p-5" style={{ borderRadius: 'var(--radius-lg)' }}>
              <h3 className="font-bold text-[16px] mb-3 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                <Award className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                What you'll earn
              </h3>
              <ul className="text-[14px] space-y-2" style={{ color: 'var(--fg-dim)' }}>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: '#63b388' }} /> Certificate of completion</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: '#63b388' }} /> Practical knowledge</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" style={{ color: '#63b388' }} /> Progress tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
