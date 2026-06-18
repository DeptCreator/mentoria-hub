'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-[60px] pb-20 sm:pb-[100px]" style={{ background: 'var(--bg)' }}>
      <div className="glass glass-xl max-w-[600px] mx-auto p-6 sm:p-10 text-center">
        <h3 className="font-display text-[clamp(1.5rem,5vw,2rem)] font-bold mb-3" style={{ color: 'var(--fg)' }}>Join Mentoria</h3>
        <p className="text-[14px] sm:text-[16px] mb-5 sm:mb-6" style={{ color: 'var(--fg-dim)' }}>
          Get personalized recommendations straight to your inbox.
        </p>
        <Link
          href="/onboarding"
          className="btn-gold inline-flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          Get Started →
        </Link>
      </div>
    </section>
  );
}
