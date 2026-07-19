import { useState } from "react";
import { InputNumber, notification, PlusOutlined, Select, TrashOutlined } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import { PlacementTestService } from "@tera/modules/education";

import { QUESTION_DIFFICULTY_OPTIONS, QUESTION_SKILL_OPTIONS } from "pages/QuestionBank/constants";

interface QuestionBucket {
  skill: string;
  difficulty: string;
  count: number;
}

const SKILL_OPTIONS = QUESTION_SKILL_OPTIONS.filter((o) => o.value);
const DIFFICULTY_OPTIONS = QUESTION_DIFFICULTY_OPTIONS.filter((o) => o.value);

interface GeneratePlacementTestQuestionsModalProps {
  open: boolean;
  testId: number | null;
  testTitle?: string;
  onClose: () => void;
}

/** Draws bank questions into an existing placement test's question set
 * (`POST /edu/placement-test/generate-questions/:id`) — appends, doesn't
 * replace what's already attached. */
const GeneratePlacementTestQuestionsModal = ({
  open,
  testId,
  testTitle,
  onClose,
}: GeneratePlacementTestQuestionsModalProps) => {
  const [buckets, setBuckets] = useState<QuestionBucket[]>([
    { skill: "grammar", difficulty: "medium", count: 5 },
  ]);
  const { mutate: generate, isPending } = PlacementTestService.usePlacementTestGenerateQuestions();

  const handleClose = () => {
    setBuckets([{ skill: "grammar", difficulty: "medium", count: 5 }]);
    onClose();
  };

  const addBucket = () => setBuckets((prev) => [...prev, { skill: "grammar", difficulty: "medium", count: 5 }]);
  const removeBucket = (index: number) => setBuckets((prev) => prev.filter((_, i) => i !== index));
  const updateBucket = (index: number, patch: Partial<QuestionBucket>) =>
    setBuckets((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));

  const handleSubmit = () => {
    if (!testId) return;
    if (buckets.some((b) => !b.count || b.count <= 0)) {
      notification.warning({ message: "Số lượng câu hỏi mỗi mục phải lớn hơn 0" });
      return;
    }

    generate(
      { id: testId, params: { buckets } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã thêm câu hỏi vào bài kiểm tra" });
          handleClose();
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể thêm câu hỏi",
          }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate={`Thêm câu hỏi cho "${testTitle ?? "bài kiểm tra"}"`}
      titleEdit={`Thêm câu hỏi cho "${testTitle ?? "bài kiểm tra"}"`}
      className="!w-[95%] xmd:!w-[520px]"
      okText="Thêm câu hỏi"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="flex flex-col gap-2">
        {buckets.map((bucket, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              className="min-w-0 flex-1"
              value={bucket.skill}
              options={SKILL_OPTIONS}
              onChange={(v) => updateBucket(index, { skill: v as string })}
            />
            <Select
              className="min-w-0 flex-1"
              value={bucket.difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={(v) => updateBucket(index, { difficulty: v as string })}
            />
            <InputNumber
              className="w-20 shrink-0"
              min={1}
              value={bucket.count}
              onChange={(v) => typeof v === "number" && updateBucket(index, { count: v })}
            />
            <button
              type="button"
              title="Xóa"
              onClick={() => removeBucket(index)}
              disabled={buckets.length === 1}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4 [&_svg]:w-4"
            >
              <TrashOutlined />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBucket}
          className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
        >
          <PlusOutlined />
          Thêm kỹ năng
        </button>
        <p className="mt-1 text-xs text-slate-400">
          Hệ thống chọn câu hỏi đang hoạt động trong ngân hàng câu hỏi, ưu tiên trình độ CEFR của bài
          kiểm tra và câu hỏi ít được sử dụng.
        </p>
      </div>
    </FormScaff>
  );
};

export default GeneratePlacementTestQuestionsModal;
