import { useMemo, useState } from "react";
import classNames from "classnames";
import { Button, CheckCircleSolid, ClockOutlined, FlagOutlined, TrophyOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { QuizQuestion } from "../../_interface";
import { QUIZ_INFO } from "../../mock";

interface QuizTabProps {
  questions: QuizQuestion[];
  initialAnswers: Record<string, string>;
  initialIndex: number;
}

const QuizTab = ({ questions, initialAnswers, initialIndex }: QuizTabProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const statusOf = (index: number): "answered" | "current" | "unanswered" => {
    if (index === currentIndex) return "current";
    return answers[questions[index].id] ? "answered" : "unanswered";
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correctOptionId).length,
    [answers, questions],
  );

  const handleSubmit = () => {
    notification.success({ message: `Đã nộp bài! Điểm số: ${score}/${questions.length}` });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand">
            <ClockOutlined className="h-4 w-4" />
            {QUIZ_INFO.timeLeft}
          </p>
        </div>

        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="mb-4 text-xl font-bold text-slate-800">{currentQuestion.question}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentQuestion.options.map((option, i) => {
            const selected = answers[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                className={classNames(
                  "overflow-hidden rounded-xl border-2 text-left transition-colors",
                  selected ? "border-brand" : "border-slate-100 hover:border-slate-200",
                )}
              >
                <div className="flex aspect-video items-center justify-center bg-sky-50 text-6xl">
                  {option.emoji}
                </div>
                <p className="px-3 py-2 font-medium text-slate-700">
                  {String.fromCharCode(65 + i)}. {option.label}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-800">Question Grid Overview</p>
        <div className="mb-3 flex flex-wrap gap-3">
          {questions.map((q, index) => {
            const status = statusOf(index);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={classNames(
                  "relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold",
                  status === "answered" && "bg-emerald-500 text-white",
                  status === "current" && "bg-brand text-white",
                  status === "unanswered" && "bg-slate-100 text-slate-500",
                )}
              >
                {index + 1}
                {status === "answered" && (
                  <CheckCircleSolid className="absolute -bottom-1 -right-1 h-4 w-4 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Đã trả lời
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" /> Đang làm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" /> Chưa làm
          </span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100 border-y border-slate-100">
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <TrophyOutlined className="h-4 w-4 text-amber-500" /> Best Score
            </span>
            <span className="font-semibold text-slate-800">{QUIZ_INFO.bestScore}%</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <ClockOutlined className="h-4 w-4 text-brand" /> Time Limit
            </span>
            <span className="font-semibold text-slate-800">{QUIZ_INFO.timeLimitMinutes} mins</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <FlagOutlined className="h-4 w-4 text-emerald-500" /> Total Questions
            </span>
            <span className="font-semibold text-slate-800">{questions.length}</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">Đã trả lời: {answeredCount}/{questions.length}</p>

        <Button className="mt-4 w-full bg-brand hover:bg-brand/80" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      </Card>
    </div>
  );
};

export default QuizTab;
