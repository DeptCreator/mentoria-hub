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

      {/* Glass hero card */}
      <div className="relative z-10 w-full max-w-[720px] mx-auto px-6 py-12 text-center"
        style={{
          background: 'var(--surface)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}>
        <div className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Educational Platform
        </div>
        <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] font-black leading-[0.9] tracking-tight mb-3" style={{ color: 'var(--fg)' }}>
          Discover Your<br />Educational Path
        </h1>
        <p className="font-display text-[clamp(1.2rem,2.5vw,1.8rem)] italic mb-8" style={{ color: 'var(--fg-dim)' }}>
          Curated opportunities, structured courses, and AI‑powered guidance — all in one place.
        </p>
        <div className="flex gap-3.5 flex-wrap justify-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-full px-8 py-[14px] text-[15px] font-semibold no-underline transition-all font-sans"
            style={{
              background: 'var(--accent)',
              color: '#0a0a0f',
              boxShadow: '0 0 40px var(--accent-glow)',
            }}
            onMouseOver={e => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 50px var(--accent-glow)'; }}
            onMouseOut={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 40px var(--accent-glow)'; }}
          >
            Find Opportunities
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full px-8 py-[14px] text-[15px] font-semibold no-underline transition-all font-sans"
            style={{
              background: 'transparent',
              color: 'var(--fg)',
              border: '1.5px solid var(--border-strong)',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
          >
            Start Learning
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ opacity: 0.6 }}>
        <span className="text-[12px] tracking-[0.08em] uppercase font-sans" style={{ color: 'var(--fg-dim)' }}>Scroll</span>
        <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '1.5px solid var(--border-strong)' }}>
          <div className="w-[3px] h-2 rounded-full" style={{ background: 'var(--fg)', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
