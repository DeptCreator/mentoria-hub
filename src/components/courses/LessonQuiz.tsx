'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types';

interface Props {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function LessonQuiz({ questions, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (answerIndex: number) => {
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

  if (showResults) {
    const correct = selectedAnswers.reduce((acc, answer, i) => {
      return acc + (answer === questions[i].correct ? 1 : 0);
    }, 0);
    const percentage = Math.round((correct / questions.length) * 100);

    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Quiz Results</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{percentage}%</p>
        <p className="text-gray-600 dark:text-gray-400">{correct} out of {questions.length} correct</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{question.question}</h3>

      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              selectedAnswers[currentQuestion] === i
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedAnswers[currentQuestion] === undefined}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </button>
    </div>
  );
}
