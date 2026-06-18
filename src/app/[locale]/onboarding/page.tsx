'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { INTERESTS, GOALS, GRADES } from '@/lib/constants';

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState(9);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    await updateProfile({
      grade,
      interests: selectedInterests,
      goals: selectedGoals,
    });
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Mentoria Hub</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Let's personalize your experience</p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What grade are you in?</h2>
          <div className="grid grid-cols-3 gap-4">
            {GRADES.map(g => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`rounded-lg border-2 p-4 text-center transition ${
                  grade === g
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What are you interested in?</h2>
          <p className="text-sm text-gray-500">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedInterests.includes(interest)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedInterests.length === 0}
              className="flex-1 rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What are your goals?</h2>
          <p className="text-sm text-gray-500">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedGoals.includes(goal)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={selectedGoals.length === 0 || loading}
              className="flex-1 rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
