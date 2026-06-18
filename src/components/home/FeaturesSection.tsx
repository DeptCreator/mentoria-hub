'use client';

import { BookOpen, Compass, Mic2, Map } from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Educational Opportunities',
    description: 'Competitions, olympiads, internships, and programs tailored to your interests',
  },
  {
    icon: BookOpen,
    title: 'Async Courses',
    description: 'Learn at your own pace with video lessons and quizzes',
  },
  {
    icon: Mic2,
    title: 'AI Assistant Jarvis',
    description: 'Voice assistant for recommendations and answering questions',
  },
  {
    icon: Map,
    title: 'Personal Roadmap',
    description: 'Visual development plan from Grade 9 to Grade 11',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          What We Offer
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <feature.icon className="mb-4 h-10 w-10 text-blue-600 dark:text-blue-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
