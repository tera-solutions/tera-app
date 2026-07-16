import { Input, PlusOutlined, TrashOutlined } from "tera-dls";

import type { QuestionAnswerRow } from "../_interface";

interface AnswerOptionsProps {
  value: QuestionAnswerRow[];
  onChange: (next: QuestionAnswerRow[]) => void;
  /** true_false / single_choice: chỉ 1 đáp án đúng — chọn radio thay vì checkbox. */
  singleCorrect?: boolean;
}

const nextKey = (index: number) => String.fromCharCode(65 + index);

const AnswerOptions = ({ value, onChange, singleCorrect }: AnswerOptionsProps) => {
  const handleContentChange = (index: number, content: string) => {
    const next = [...value];
    next[index] = { ...next[index], answer_content: content };
    onChange(next);
  };

  const handleCorrectToggle = (index: number) => {
    const next = value.map((a, i) =>
      singleCorrect ? { ...a, is_correct: i === index } : i === index ? { ...a, is_correct: !a.is_correct } : a,
    );
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...value, { answer_key: nextKey(value.length), answer_content: "", is_correct: false }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index).map((a, i) => ({ ...a, answer_key: nextKey(i) })));
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((answer, index) => (
        <div key={index} className="flex items-center gap-2">
          <button
            type="button"
            title="Đáp án đúng"
            onClick={() => handleCorrectToggle(index)}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
              answer.is_correct
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-300 text-slate-400"
            }`}
          >
            {answer.answer_key}
          </button>
          <Input
            className="flex-1"
            value={answer.answer_content}
            placeholder={`Đáp án ${answer.answer_key}`}
            onChange={(e) => handleContentChange(index, e.target.value)}
          />
          <button
            type="button"
            title="Xóa"
            onClick={() => handleRemove(index)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-4 [&_svg]:w-4"
          >
            <TrashOutlined />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs font-medium text-brand hover:bg-sky-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
      >
        <PlusOutlined /> Thêm đáp án
      </button>
    </div>
  );
};

export default AnswerOptions;
