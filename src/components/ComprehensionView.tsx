import { ArrowRight, CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Story } from '../types/story';

interface ComprehensionViewProps {
  story: Story;
  onRestart: () => void;
  onBackToLibrary: () => void;
}

export default function ComprehensionView({ story, onRestart, onBackToLibrary }: ComprehensionViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = story.comprehensionQuestions.length;

  const score = useMemo(() => {
    return story.comprehensionQuestions.reduce((count, question) => {
      const correctOption = question.options.find((option) => option.isCorrect);
      return selectedAnswers[question.id] === correctOption?.id ? count + 1 : count;
    }, 0);
  }, [selectedAnswers, story.comprehensionQuestions]);

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (submitted) {
      return;
    }

    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#eefbf3_0%,#ffffff_100%)] p-8 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <HelpCircle className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Comprehension Check</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          What did you understand from {story.sourceTitle}?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Finish the lesson with a few quick questions. This helps turn reading support into actual understanding.
        </p>
        <p className="mt-4 text-sm font-semibold text-emerald-700">
          {answeredCount} of {totalQuestions} answered
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {story.comprehensionQuestions.map((question, index) => {
          const selectedOptionId = selectedAnswers[question.id];
          const correctOption = question.options.find((option) => option.isCorrect);

          return (
            <section
              key={question.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)]"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                  Question {index + 1}
                </p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {question.skill}
                </span>
              </div>

              <h3 className="text-xl font-bold leading-8 text-slate-900">{question.prompt}</h3>

              <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.isCorrect;
                  const showCorrect = submitted && isCorrect;
                  const showIncorrect = submitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectAnswer(question.id, option.id)}
                      className={[
                        'rounded-[1.25rem] border px-4 py-4 text-left text-sm font-semibold transition-colors',
                        isSelected ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white',
                        showCorrect ? 'border-emerald-400 bg-emerald-100 text-emerald-900' : '',
                        showIncorrect ? 'border-rose-300 bg-rose-50 text-rose-700' : '',
                      ].join(' ')}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-5 rounded-[1.25rem] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                  <p className="font-semibold text-slate-800">
                    {selectedOptionId === correctOption?.id ? 'Correct.' : `Correct answer: ${correctOption?.text}`}
                  </p>
                  {question.explanation && <p className="mt-2">{question.explanation}</p>}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {submitted && (
        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-6 text-center shadow-[0_20px_60px_-48px_rgba(22,163,74,0.45)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">Lesson Score</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {score} / {totalQuestions}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Replay the story if you want another pass, or head back to the library for your next lesson.
          </p>
        </div>
      )}

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount !== totalQuestions}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check Answers
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleTryAgain}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
        >
          <RotateCcw className="h-4 w-4" />
          Replay Story
        </button>

        <button
          type="button"
          onClick={onBackToLibrary}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Back to Library
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
