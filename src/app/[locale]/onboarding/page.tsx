'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { INTERESTS, GOALS, GRADES } from '@/lib/constants';

export default function OnboardingPage() {
  const { updateProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: "What's your grade?", sub: "We'll tailor recommendations for you.", render: () => (
      <div className="flex flex-wrap gap-2.5 justify-center">
        {GRADES.map(g => (
          <button key={g} onClick={() => setGrade(g)}
            className="tag-pill rounded-full px-5 py-3 text-[15px] font-medium border-2 cursor-pointer transition-all font-sans"
            style={{
              borderColor: grade === g ? 'var(--accent)' : 'var(--border)',
              background: grade === g ? 'var(--accent)' : 'transparent',
              color: grade === g ? '#0a0a0f' : 'var(--fg-dim)',
            }}>Grade {g}</button>
        ))}
      </div>
    )},
    { title: 'What interests you?', sub: 'Pick as many as you like.', render: () => (
      <div className="flex flex-wrap gap-2.5 justify-center">
        {INTERESTS.map(i => (
          <button key={i} onClick={() => setSelectedInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
            className="tag-pill rounded-full px-5 py-3 text-[15px] font-medium border-2 cursor-pointer transition-all font-sans"
            style={{
              borderColor: selectedInterests.includes(i) ? 'var(--accent)' : 'var(--border)',
              background: selectedInterests.includes(i) ? 'var(--accent)' : 'transparent',
              color: selectedInterests.includes(i) ? '#0a0a0f' : 'var(--fg-dim)',
              fontWeight: selectedInterests.includes(i) ? 600 : 500,
            }}>{i}</button>
        ))}
      </div>
    )},
    { title: 'What are your goals?', sub: 'Select up to 3.', render: () => (
      <div className="flex flex-wrap gap-2.5 justify-center">
        {GOALS.map(g => (
          <button key={g} onClick={() => setSelectedGoals(p => p.includes(g) ? p.filter(x => x !== g) : p.length < 3 ? [...p, g] : p)}
            className="tag-pill rounded-full px-5 py-3 text-[15px] font-medium border-2 cursor-pointer transition-all font-sans"
            style={{
              borderColor: selectedGoals.includes(g) ? 'var(--accent)' : 'var(--border)',
              background: selectedGoals.includes(g) ? 'var(--accent)' : 'transparent',
              color: selectedGoals.includes(g) ? '#0a0a0f' : 'var(--fg-dim)',
              fontWeight: selectedGoals.includes(g) ? 600 : 500,
            }}>{g}</button>
        ))}
      </div>
    )},
  ];

  const canProceed = () => {
    if (step === 0) return grade > 0;
    if (step === 1) return selectedInterests.length > 0;
    if (step === 2) return selectedGoals.length > 0;
    return false;
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    setLoading(true);
    await updateProfile({ grade, interests: selectedInterests, goals: selectedGoals });
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-0" style={{ background: 'var(--bg)' }}>
      <div className="glass glass-xl max-w-[520px] w-full p-6 sm:p-10 md:p-12 text-center">
        {/* Dots */}
        <div className="flex justify-center gap-2 sm:gap-2.5 mb-5 sm:mb-7">
          {steps.map((_, i) => (
            <span key={i} className="h-2 rounded transition-all"
              style={{
                width: i === step ? '24px' : '8px',
                background: i <= step ? 'var(--accent)' : 'var(--border)',
                borderRadius: i === step ? '4px' : '50%',
              }} />
          ))}
        </div>

        {/* Step content */}
        <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-bold mb-2" style={{ color: 'var(--fg)' }}>{steps[step].title}</h2>
        <p className="mb-5 sm:mb-7 text-[14px] sm:text-[16px]" style={{ color: 'var(--fg-dim)' }}>{steps[step].sub}</p>
        {steps[step].render()}

        {/* Navigation */}
        <div className="flex gap-2 sm:gap-3 justify-center mt-5 sm:mt-7">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold cursor-pointer font-sans transition-all"
              style={{ background: 'transparent', color: 'var(--fg)', border: '1.5px solid var(--border-strong)' }}>
              Back
            </button>
          )}
          <button onClick={handleNext} disabled={!canProceed() || loading}
            className="rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold cursor-pointer font-sans transition-all disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#0a0a0f', boxShadow: '0 0 40px var(--accent-glow)' }}>
            {loading ? 'Saving...' : step === steps.length - 1 ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
