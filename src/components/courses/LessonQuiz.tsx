'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types';
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';

interface Props {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function LessonQuiz({ questions, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = selectedAnswers.reduce((acc, answer, i) => {
        return acc + (answer === questions[i].correct ? 1 : 0);
      }, 0);
      setShowResults(true);
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  const correct = selectedAnswers.reduce((acc, answer, i) => {
    return acc + (answer === questions[i].correct ? 1 : 0);
  }, 0);
  const percentage = Math.round((correct / questions.length) * 100);

  if (showResults) {
    return (
      <div className="glass glass-xl p-5 sm:p-8 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(201,169,110,0.15)' }}>
          <Trophy className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'var(--accent)' }} />
        </div>
        <h3 className="font-display text-[20px] sm:text-[24px] font-bold mb-2" style={{ color: 'var(--fg)' }}>Quiz Results</h3>
        <p className="text-[36px] sm:text-[48px] font-black mb-1" style={{ color: percentage >= 70 ? '#63b388' : '#dc7864' }}>
          {percentage}%
        </p>
        <p className="text-[13px] sm:text-[14px] mb-5 sm:mb-6" style={{ color: 'var(--fg-dim)' }}>{correct} out of {questions.length} correct</p>
        <div className="flex flex-col gap-2 text-left max-w-md mx-auto">
          {questions.map((q, i) => {
            const isCorrect = selectedAnswers[i] === q.correct;
            return (
              <div key={i} className="p-2.5 sm:p-3 rounded-lg flex items-start gap-2 sm:gap-3" style={{ background: 'var(--surface)' }}>
                {isCorrect ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#63b388' }} /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#dc7864' }} />}
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-medium" style={{ color: 'var(--fg)' }}>{q.question}</p>
                  <p className="text-[11px] sm:text-[12px]" style={{ color: isCorrect ? '#63b388' : '#dc7864' }}>
                    Your answer: {q.options[selectedAnswers[i]] || 'Skipped'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selected = selectedAnswers[currentQuestion];

  return (
    <div className="glass p-4 sm:p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="h-1.5 w-20 sm:w-24 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      <h3 className="font-bold text-[17px] sm:text-[20px] mb-4 sm:mb-6" style={{ color: 'var(--fg)' }}>{question.question}</h3>

      <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="w-full text-left p-3 sm:p-4 rounded-lg transition-all flex items-center gap-2.5 sm:gap-3 active-press"
            style={{
              background: selected === i ? 'var(--surface)' : 'transparent',
              border: selected === i ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              color: selected === i ? 'var(--fg)' : 'var(--fg-dim)',
            }}
          >
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-[12px] font-bold shrink-0"
              style={{
                background: selected === i ? 'var(--accent)' : 'var(--surface)',
                color: selected === i ? '#0a0a0f' : 'var(--fg-dim)',
              }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-[14px] sm:text-[15px]">{option}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === undefined}
        className="btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-40 w-full sm:w-auto"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
