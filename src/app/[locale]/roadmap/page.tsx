'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, BookOpen, Compass, CheckCircle } from 'lucide-react';

const ROADMAP_STAGES = [
  {
    grade: 9,
    title: 'Foundation Year',
    description: 'Build strong academic foundations and explore interests',
    milestones: [
      'Identify core interests and strengths',
      'Join 2-3 extracurricular activities',
      'Start building academic portfolio',
      'Explore different subject areas',
    ],
  },
  {
    grade: 10,
    title: 'Exploration Year',
    description: 'Deepen knowledge and start preparing for competitions',
    milestones: [
      'Participate in first competitions',
      'Develop specialized skills',
      'Build relationships with mentors',
      'Start SAT/IELTS preparation',
    ],
  },
  {
    grade: 11,
    title: 'Acceleration Year',
    description: 'Focus on university preparation and advanced programs',
    milestones: [
      'Take SAT/IELTS exams',
      'Apply to summer programs',
      'Build strong application portfolio',
      'Leadership roles in activities',
    ],
  },
  {
    grade: 12,
    title: 'Application Year',
    description: 'Final preparations and university applications',
    milestones: [
      'Complete university applications',
      'Apply for scholarships',
      'Finalize recommendation letters',
      'Prepare for interviews',
    ],
  },
];

export default function RoadmapPage() {
  const { profile } = useAuth();
  const { courses } = useCourses();
  const { opportunities } = useOpportunities();
  const [activeGrade, setActiveGrade] = useState(profile?.grade || 9);

  const stage = ROADMAP_STAGES.find(s => s.grade === activeGrade);
  const recommendedCourses = courses.filter(c => 
    c.category === (profile?.interests?.[0] || 'STEM')
  ).slice(0, 3);
  
  const recommendedOpportunities = opportunities.filter(o => 
    o.grade_min && o.grade_max && activeGrade >= o.grade_min && activeGrade <= o.grade_max
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        My Educational Path
      </h1>

      {/* Timeline */}
      <div className="mb-12 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200 dark:bg-gray-700" />
        <div className="relative flex justify-between">
          {ROADMAP_STAGES.map((s) => (
            <button
              key={s.grade}
              onClick={() => setActiveGrade(s.grade)}
              className={`flex flex-col items-center gap-2 transition ${
                activeGrade === s.grade ? 'scale-110' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${
                activeGrade === s.grade
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : activeGrade > s.grade
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800'
              }`}>
                {activeGrade > s.grade ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-lg font-bold">{s.grade}</span>
                )}
              </div>
              <span className={`text-sm font-medium ${
                activeGrade === s.grade ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`}>
                Grade {s.grade}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Details */}
      {stage && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Milestones */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals</h2>
            </div>
            <ul className="space-y-3">
              {stage.milestones.map((milestone, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Courses */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Courses</h2>
            </div>
            {recommendedCourses.length > 0 ? (
              <div className="space-y-3">
                {recommendedCourses.map(course => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.level}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recommendations yet</p>
            )}
          </div>

          {/* Recommended Opportunities */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Opportunities</h2>
            </div>
            {recommendedOpportunities.length > 0 ? (
              <div className="space-y-3">
                {recommendedOpportunities.map(opp => (
                  <Link
                    key={opp.id}
                    href="/opportunities"
                    className="block rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{opp.title}</p>
                    <p className="text-sm text-gray-500">{opp.category} • {opp.format}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No opportunities for this grade</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
