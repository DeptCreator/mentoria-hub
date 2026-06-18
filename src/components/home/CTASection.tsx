'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="px-6 py-[60px] pb-[100px]" style={{ background: 'var(--bg)' }}>
      <div className="glass glass-xl max-w-[600px] mx-auto p-10 text-center">
        <h3 className="font-display text-[2rem] font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Join Mentoria
        </h3>
        <p className="mb-6" style={{ color: 'var(--fg-dim)' }}>
          Get personalized recommendations straight to your inbox.
        </p>
        <Link
          href="/onboarding"
          className="btn-gold inline-flex items-center gap-2 no-underline"
        >
          Get Started →
        </Link>
      </div>
    </section>
  );
}
