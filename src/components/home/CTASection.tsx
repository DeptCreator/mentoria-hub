'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-blue-600 py-20 dark:bg-blue-800">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Join Mentoria
        </h2>
        <p className="mb-8 text-lg text-blue-100">
          Create a profile and get personalized recommendations today
        </p>
        <Link
          href="/onboarding"
          className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition hover:bg-gray-100"
        >
          Start for Free
        </Link>
      </div>
    </section>
  );
}
