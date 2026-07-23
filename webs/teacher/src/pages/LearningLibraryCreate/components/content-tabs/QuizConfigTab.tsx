import { Button, Input, InputNumber, PlusOutlined, Radio, TrashOutlined } from "tera-dls";

import type { QuizQuestionDraft } from "../../_interface";

interface QuizConfigTabProps {
  questions: QuizQuestionDraft[];
  timeLimitMinutes: number;
  onChangeTimeLimit: (minutes: number) => void;
  onChangeQuestion: (id: string, patch: Partial<QuizQuestionDraft>) => void;
  onChangeOption: (questionId: string, optionId: string, text: string) => void;
  onSelectCorrectOption: (questionId: string, optionId: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
}

const QuizConfigTab = ({
  questions,
  timeLimitMinutes,
  onChangeTimeLimit,
  onChangeQuestion,
  onChangeOption,
  onSelectCorrectOption,
  onAddQuestion,
  onRemoveQuestion,
}: QuizConfigTabProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-slate-50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Thời gian làm bài (phút)</span>
        <InputNumber
          min={1}
          value={timeLimitMinutes}
          onChange={(value: any) => onChangeTimeLimit(Number(value) || 1)}
          className="w-20"
        />
      </div>
      <span className="text-sm text-slate-500">
        Số câu hỏi: <span className="font-semibold text-slate-700">{questions.length}</span>
      </span>
    </div>

    {questions.map((question, qIndex) => (
      <div key={question.id} className="rounded-xl border border-slate-100 p-3">
        <div className="mb-2 flex items-start gap-2">
          <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
            {qIndex + 1}
          </span>
          <Input
            value={question.question}
            onChange={(e) => onChangeQuestion(question.id, { question: e.target.value })}
            placeholder="Nhập câu hỏi..."
            className="flex-1"
          />
          {questions.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveQuestion(question.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
            >
              <TrashOutlined className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="ml-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options.map((option, oIndex) => (
            <label key={option.id} className="flex items-center gap-2">
              <Radio
                name={`correct-${question.id}`}
                checked={question.correctOptionId === option.id}
                onChange={() => onSelectCorrectOption(question.id, option.id)}
              />
              <Input
                value={option.text}
                onChange={(e) => onChangeOption(question.id, option.id, e.target.value)}
                placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                className="flex-1"
              />
            </label>
          ))}
        </div>
      </div>
    ))}

    <Button
      outlined
      icon={<PlusOutlined />}
      className="self-start border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
      onClick={onAddQuestion}
    >
      Thêm câu hỏi
    </Button>
  </div>
);

export default QuizConfigTab;
