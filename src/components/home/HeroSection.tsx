'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.png" alt="" className="w-full h-full object-cover opacity-60" />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.85) 100%)',
      }} />
      {/* Brand watermark */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
        <span className="font-display text-[clamp(6rem,18vw,14rem)] font-black" style={{ color: 'var(--fg)' }}>MENTORIA</span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto">
        <div className="glass glass-xl p-10 md:p-14 animate-fadeIn">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] mb-4" style={{ color: 'var(--fg)' }}>
            Discover Your<br />
            <span style={{ color: 'var(--accent)' }}>Educational Path</span>
          </h1>
          <p className="text-[18px] mb-8 leading-relaxed" style={{ color: 'var(--fg-dim)' }}>
            Find competitions, scholarships, and courses tailored to your goals. 
            Learn at your own pace with AI-powered guidance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/opportunities"
              className="btn-gold inline-flex items-center gap-2 no-underline"
            >
              Find Opportunities →
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold no-underline transition-all"
              style={{ background: 'transparent', color: 'var(--fg)', border: '1.5px solid var(--border-strong)' }}
            >
              Start Learning
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex flex-col items-center gap-2" style={{ animation: 'scrollDot 2s infinite' }}>
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: 'var(--border-strong)' }}>
            <div className="w-1 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>
          <span className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Scroll</span>
        </div>
      </div>
    </section>
  );
}
