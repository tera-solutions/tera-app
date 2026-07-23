import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { InputNumber, notification, PlusOutlined, Select, TrashOutlined } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import CourseSelect from "_common/components/CourseSelect";
import LevelSelect from "_common/components/LevelSelect";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useMeta } from "_common/hooks/useMeta";
import { QuestionService } from "@tera/modules/education";

import { QUESTION_DIFFICULTY_OPTIONS, QUESTION_SKILL_OPTIONS } from "pages/QuestionBank/constants";
import { EXAM_TYPE_META } from "../constants";

interface DifficultyBucket {
  difficulty: string;
  count: number;
}

interface GenerateExamFormValues {
  exam_name: string;
  exam_type: string;
  course_id?: number;
  level_id?: number;
  duration: number;
  passing_score: number;
  skill: string;
}

const DEFAULT_VALUES: GenerateExamFormValues = {
  exam_name: "",
  exam_type: "final",
  course_id: undefined,
  level_id: undefined,
  duration: 60,
  passing_score: 60,
  skill: "grammar",
};

const DIFFICULTY_OPTIONS = QUESTION_DIFFICULTY_OPTIONS.filter((o) => o.value);

interface GenerateExamModalProps {
  open: boolean;
  onClose: () => void;
}

/** Draws ACTIVE bank questions by skill/difficulty into a brand-new exam
 * (`POST /edu/question/generate-exam`) — the only way today to actually
 * populate an exam's question list from the Question Bank. */
const GenerateExamModal = ({ open, onClose }: GenerateExamModalProps) => {
  const navigate = useNavigate();
  const { getOptions } = useMeta();
  const form = useForm<GenerateExamFormValues>({ mode: "onChange", defaultValues: DEFAULT_VALUES });
  const [buckets, setBuckets] = useState<DifficultyBucket[]>([{ difficulty: "medium", count: 10 }]);

  const { mutate: generateExam, isPending } = QuestionService.useGenerateExam();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    setBuckets([{ difficulty: "medium", count: 10 }]);
    onClose();
  };

  const addBucket = () => setBuckets((prev) => [...prev, { difficulty: "medium", count: 5 }]);
  const removeBucket = (index: number) => setBuckets((prev) => prev.filter((_, i) => i !== index));
  const updateBucket = (index: number, patch: Partial<DifficultyBucket>) =>
    setBuckets((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));

  const handleSubmit = (values: GenerateExamFormValues) => {
    if (buckets.some((b) => !b.count || b.count <= 0)) {
      notification.warning({ message: "Số lượng câu hỏi mỗi mức độ khó phải lớn hơn 0" });
      return;
    }

    generateExam(
      {
        params: {
          exam_name: values.exam_name,
          exam_type: values.exam_type,
          course_id: values.course_id,
          level_id: values.level_id,
          duration: values.duration,
          passing_score: values.passing_score,
          skill: values.skill,
          difficulties: buckets,
        },
      },
      {
        onSuccess: (res: any) => {
          const newId = res?.data?.id;
          notification.success({ message: "Đã sinh đề thi từ ngân hàng câu hỏi" });
          handleClose();
          if (newId) navigate(`${PATHS.exam}/${newId}`);
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể sinh đề thi",
          });
        },
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Sinh đề thi từ ngân hàng câu hỏi"
      titleEdit="Sinh đề thi từ ngân hàng câu hỏi"
      className="!w-[95%] xmd:!w-[560px]"
      okText="Sinh đề thi"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Tên đề thi"
          name="exam_name"
          rules={[{ required: "Vui lòng nhập tên đề thi" }]}
        >
          <Input placeholder="VD: Grammar Quiz — Starter" />
        </FormTeraItem>

        <div className="grid grid-cols-2 gap-x-4">
          <FormTeraItem label="Loại bài kiểm tra" name="exam_type">
            <Controller
              control={form.control}
              name="exam_type"
              render={({ field }) => (
                <Select value={field.value} options={getOptions(EXAM_TYPE_META)} onChange={field.onChange} />
              )}
            />
          </FormTeraItem>

          <FormTeraItem
            label="Thời lượng (phút)"
            name="duration"
            rules={[{ required: "Vui lòng nhập thời lượng" }, { min: { value: 1, message: "Phải lớn hơn 0" } }]}
          >
            <InputNumber min={1} className="w-full" />
          </FormTeraItem>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <FormTeraItem label="Khóa học (tùy chọn)" name="course_id">
            <Controller
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <CourseSelect
                  value={field.value}
                  onChange={(v) => field.onChange(v != null ? Number(v) : undefined)}
                  allowClear
                />
              )}
            />
          </FormTeraItem>

          <FormTeraItem label="Hạng thứ (tùy chọn)" name="level_id">
            <Controller
              control={form.control}
              name="level_id"
              render={({ field }) => (
                <LevelSelect
                  value={field.value}
                  onChange={(v) => field.onChange(v != null ? Number(v) : undefined)}
                  allowClear
                />
              )}
            />
          </FormTeraItem>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <FormTeraItem label="Kỹ năng" name="skill" rules={[{ required: "Vui lòng chọn kỹ năng" }]}>
            <Controller
              control={form.control}
              name="skill"
              render={({ field }) => (
                <Select
                  value={field.value}
                  options={QUESTION_SKILL_OPTIONS.filter((o) => o.value)}
                  onChange={field.onChange}
                />
              )}
            />
          </FormTeraItem>

          <FormTeraItem
            label="Điểm đạt"
            name="passing_score"
            rules={[{ required: "Vui lòng nhập điểm đạt" }]}
          >
            <InputNumber min={0} className="w-full" />
          </FormTeraItem>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            Số lượng câu hỏi theo độ khó
          </label>
          <div className="flex flex-col gap-2">
            {buckets.map((bucket, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  className="min-w-0 flex-1"
                  value={bucket.difficulty}
                  options={DIFFICULTY_OPTIONS}
                  onChange={(v) => updateBucket(index, { difficulty: v as string })}
                />
                <InputNumber
                  className="w-24 shrink-0"
                  min={1}
                  value={bucket.count}
                  onChange={(v) => typeof v === "number" && updateBucket(index, { count: v })}
                />
                <button
                  type="button"
                  title="Xóa mức độ"
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
              Thêm mức độ
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Hệ thống sẽ tự động chọn các câu hỏi đang hoạt động (đã duyệt) trong ngân hàng câu hỏi, ưu
            tiên câu hỏi ít được sử dụng.
          </p>
        </div>
      </FormTera>
    </FormScaff>
  );
};

export default GenerateExamModal;
