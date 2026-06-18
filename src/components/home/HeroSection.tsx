'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Discover a World of<br />
          <span className="text-blue-600 dark:text-blue-400">Educational Opportunities</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Find competitions, courses, and programs that help you grow. 
          Learn at your own pace with a personalized AI assistant.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/opportunities"
            className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          >
            Find Opportunities
          </Link>
          <Link
            href="/courses"
            className="rounded-full border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </section>
  );
}
