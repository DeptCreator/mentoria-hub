'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ROADMAP_STAGES = [
  { grade: 9, title: 'Foundation Year', description: 'Build strong academic foundations and explore interests',
    milestones: ['Identify core interests and strengths', 'Join 2-3 extracurricular activities', 'Start building academic portfolio', 'Explore different subject areas'] },
  { grade: 10, title: 'Exploration Year', description: 'Deepen knowledge and start preparing for competitions',
    milestones: ['Participate in first competitions', 'Develop specialized skills', 'Build relationships with mentors', 'Start SAT/IELTS preparation'] },
  { grade: 11, title: 'Acceleration Year', description: 'Focus on university preparation and advanced programs',
    milestones: ['Take SAT/IELTS exams', 'Apply to summer programs', 'Build strong application portfolio', 'Leadership roles in activities'] },
  { grade: 12, title: 'Application Year', description: 'Final preparations and university applications',
    milestones: ['Complete university applications', 'Apply for scholarships', 'Finalize recommendation letters', 'Prepare for interviews'] },
];

export default function RoadmapPage() {
  const { profile } = useAuth();
  const { courses } = useCourses();
  const { opportunities } = useOpportunities();
  const [activeGrade, setActiveGrade] = useState(profile?.grade || 9);

  const stage = ROADMAP_STAGES.find(s => s.grade === activeGrade);
  const recommendedCourses = courses.filter(c => c.category === (profile?.interests?.[0] || 'STEM')).slice(0, 3);
  const recommendedOpportunities = opportunities.filter(o => o.grade_min && o.grade_max && activeGrade >= o.grade_min && activeGrade <= o.grade_max).slice(0, 3);

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold mb-2 text-center" style={{ color: 'var(--fg)' }}>Your Roadmap</h2>
        <p className="text-center mb-10" style={{ color: 'var(--fg-dim)' }}>Grade-by-grade plan for high school success.</p>

        {/* Timeline */}
        <div className="flex justify-between items-start gap-4 mb-10 overflow-x-auto pb-4 flex-wrap" id="roadmapTimeline">
          {ROADMAP_STAGES.map((s) => {
            const isActive = activeGrade === s.grade;
            const isDone = activeGrade > s.grade;
            return (
              <div key={s.grade} className="text-center flex-1 min-w-[120px] cursor-pointer" onClick={() => setActiveGrade(s.grade)}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-[20px] font-bold transition-all"
                  style={{
                    background: isDone ? '#63b388' : isActive ? 'var(--accent)' : 'var(--surface)',
                    color: isDone || isActive ? '#0a0a0f' : 'var(--fg-dim)',
                    border: !isDone && !isActive ? '2px solid var(--border-strong)' : 'none',
                    boxShadow: isActive ? '0 0 24px var(--accent-glow)' : 'none',
                  }}>
                  {isDone ? '✓' : s.grade}
                </div>
                <div style={{ fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--fg)' }}>Grade {s.grade}</div>
                <div className="text-[12px]" style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}>
                  {isDone ? 'Completed' : isActive ? 'Current' : 'Upcoming'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        {stage && (
          <div className="glass p-7" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-bold text-[1.3rem] mb-4" style={{ color: 'var(--fg)' }}>Grade {activeGrade} — Focus Areas</h3>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="p-4 rounded-xl" style={{ background: 'var(--surface)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Goals</h4>
                <ul className="list-none flex flex-col gap-1.5 text-[14px]" style={{ color: 'var(--fg-dim)' }}>
                  {stage.milestones.map((m, i) => <li key={i}>• {m}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--surface)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Courses</h4>
                {recommendedCourses.length > 0 ? (
                  <ul className="list-none flex flex-col gap-1.5 text-[14px]" style={{ color: 'var(--fg-dim)' }}>
                    {recommendedCourses.map(c => <li key={c.id}>• <Link href={`/courses/${c.id}`} style={{ color: 'var(--accent)' }}>{c.title}</Link></li>)}
                  </ul>
                ) : <p className="text-[14px]" style={{ color: 'var(--muted)' }}>No recommendations yet.</p>}
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--surface)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Opportunities</h4>
                {recommendedOpportunities.length > 0 ? (
                  <ul className="list-none flex flex-col gap-1.5 text-[14px]" style={{ color: 'var(--fg-dim)' }}>
                    {recommendedOpportunities.map(o => <li key={o.id}>• <Link href="/opportunities" style={{ color: 'var(--accent)' }}>{o.title}</Link></li>)}
                  </ul>
                ) : <p className="text-[14px]" style={{ color: 'var(--muted)' }}>No opportunities for this grade.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
