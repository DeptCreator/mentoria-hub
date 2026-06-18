'use client';

const features = [
  { icon: '🎯', title: 'Opportunities', desc: 'Curated competitions, internships, and scholarships tailored to your profile.' },
  { icon: '📚', title: 'Async Courses', desc: 'Self-paced learning with video lessons, quizzes, and certificates.' },
  { icon: '🤖', title: 'AI Assistant Jarvis', desc: 'Voice-powered AI that answers questions and suggests next steps.' },
  { icon: '🗺', title: 'Roadmap', desc: 'Personalized grade-by-grade plan showing goals, courses, and deadlines.' },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-20 max-md:py-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent)' }}>Why Mentoria</div>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold" style={{ color: 'var(--fg)' }}>
            Everything you need to grow
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass glass-lg card-hover p-7 transition-all"
              style={{ transition: 'all 0.35s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mb-4"
                style={{ background: 'rgba(201,169,110,0.12)', color: 'var(--accent)' }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-[18px] mb-1.5" style={{ color: 'var(--fg)' }}>{f.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
