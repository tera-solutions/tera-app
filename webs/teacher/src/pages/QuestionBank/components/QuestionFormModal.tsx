import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import TextArea from "@tera/components/dof/Control/TextArea";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import { QuestionService } from "@tera/modules/education";

import type { QuestionAnswerRow, QuestionRow } from "../_interface";
import {
  DEFAULT_ANSWER_OPTIONS,
  QUESTION_DIFFICULTY_OPTIONS,
  QUESTION_SKILL_OPTIONS,
  QUESTION_TYPE_OPTIONS,
} from "../constants";
import AnswerOptions from "./AnswerOptions";

interface QuestionFormValues {
  question_type: string;
  skill: string;
  difficulty: string;
  score: number;
  content: string;
  explanation?: string;
}

interface QuestionFormModalProps {
  open: boolean;
  editing?: QuestionRow | null;
  onClose: () => void;
}

const DEFAULT_VALUES: QuestionFormValues = {
  question_type: "single_choice",
  skill: "grammar",
  difficulty: "easy",
  score: 1,
  content: "",
  explanation: "",
};

const ANSWER_BACKED_TYPES = [
  "single_choice",
  "multiple_choice",
  "true_false",
  "matching",
  "ordering",
  "fill_blank",
  "short_answer",
  "listening",
];
const SINGLE_CORRECT_TYPES = ["single_choice", "true_false"];

const QuestionFormModal = ({ open, editing, onClose }: QuestionFormModalProps) => {
  const form = useForm<QuestionFormValues>({ mode: "onChange", defaultValues: DEFAULT_VALUES });
  const [answers, setAnswers] = useState<QuestionAnswerRow[]>(DEFAULT_ANSWER_OPTIONS);

  // The list row carries no explanation/answers, so the full question is fetched
  // when editing to prefill the explanation field and answer options.
  const detailQuery = QuestionService.useQuestionDetail(
    { id: editing?.id ?? "" },
    { enabled: !!editing?.id && open },
  );
  const detail = detailQuery.data?.data;

  useEffect(() => {
    if (!open) return;
    if (!editing) {
      form.reset(DEFAULT_VALUES);
      setAnswers(DEFAULT_ANSWER_OPTIONS);
      return;
    }

    // Seed the basic fields from the list row immediately, then enrich with the
    // full detail (explanation + real answers) once it arrives. Every field must
    // stay a defined string/number — tera-dls inputs crash on an undefined value.
    form.reset({
      question_type: detail?.question_type ?? editing.type ?? DEFAULT_VALUES.question_type,
      skill: detail?.skill ?? editing.skill ?? DEFAULT_VALUES.skill,
      difficulty: detail?.difficulty ?? editing.difficulty ?? DEFAULT_VALUES.difficulty,
      score: Number(detail?.score ?? editing.score) || DEFAULT_VALUES.score,
      content: detail?.content ?? editing.content ?? "",
      explanation: detail?.explanation ?? "",
    });

    if (detail) {
      const rows: QuestionAnswerRow[] = (detail.answers ?? []).map((a: any) => ({
        answer_key: a.answer_key ?? "",
        answer_content: a.answer_content ?? "",
        is_correct: !!a.is_correct,
      }));
      setAnswers(rows.length ? rows : DEFAULT_ANSWER_OPTIONS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing, detail]);

  const { mutate: createQuestion, isPending: isCreating } = QuestionService.useQuestionCreate();
  const { mutate: updateQuestion, isPending: isUpdating } = QuestionService.useQuestionUpdate();
  const isSubmitting = isCreating || isUpdating;

  const questionType = form.watch("question_type");
  const isAnswerBacked = ANSWER_BACKED_TYPES.includes(questionType);

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    setAnswers(DEFAULT_ANSWER_OPTIONS);
    onClose();
  };

  const handleSubmit = (values: QuestionFormValues) => {
    const params = {
      ...values,
      score: Number(values.score),
      explanation: values.explanation || undefined,
      answers: isAnswerBacked ? answers.filter((a) => a.answer_content.trim()) : undefined,
    };

    const onSuccess = () => {
      notification.success({ message: editing ? "Cập nhật câu hỏi thành công" : "Thêm câu hỏi thành công" });
      handleClose();
    };
    const onError = (error: any) =>
      notification.error({ message: error?.data?.msg ?? error?.message ?? "Không thể lưu câu hỏi" });

    if (editing) {
      updateQuestion({ id: editing.id, params }, { onSuccess, onError });
    } else {
      createQuestion({ params }, { onSuccess, onError });
    }
  };

  return (
    <Modal
      title={editing ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
      open={open}
      className="!w-[95%] xmd:!w-[640px]"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={handleClose}
      onOk={() => form.handleSubmit(handleSubmit)()}
      destroyOnClose
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormTeraItem label="Môn học" name="skill">
            <Controller
              control={form.control}
              name="skill"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={QUESTION_SKILL_OPTIONS.filter((o) => o.value)} />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Dạng câu hỏi" name="question_type">
            <Controller
              control={form.control}
              name="question_type"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={QUESTION_TYPE_OPTIONS.filter((o) => o.value)} />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Độ khó" name="difficulty">
            <Controller
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={QUESTION_DIFFICULTY_OPTIONS.filter((o) => o.value)} />
              )}
            />
          </FormTeraItem>
          <FormTeraItem label="Điểm số" name="score" rules={[{ required: "Vui lòng nhập điểm số" }]}>
            <InputNumber min={0.5} step={0.5} className="w-full" />
          </FormTeraItem>
        </div>

        <FormTeraItem
          label="Nội dung câu hỏi"
          name="content"
          rules={[{ required: "Vui lòng nhập nội dung câu hỏi" }]}
        >
          <TextArea placeholder="Nhập nội dung câu hỏi..." rows={3} />
        </FormTeraItem>

        {isAnswerBacked && (
          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Đáp án</p>
            <AnswerOptions
              value={answers}
              onChange={setAnswers}
              singleCorrect={SINGLE_CORRECT_TYPES.includes(questionType)}
            />
          </div>
        )}

        <FormTeraItem label="Giải thích (tùy chọn)" name="explanation">
          <TextArea placeholder="Giải thích đáp án..." rows={2} />
        </FormTeraItem>
      </FormTera>
    </Modal>
  );
};

export default QuestionFormModal;
