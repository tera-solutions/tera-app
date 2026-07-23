import { useState } from "react";
import { Input, InputNumber, notification, Select, TextArea } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { FileAPI } from "@tera/api/common/FileAPI";
import { ExamService } from "@tera/modules/education";

import { QUESTION_DIFFICULTY_OPTIONS, QUESTION_SKILL_OPTIONS } from "pages/QuestionBank/constants";

const QUESTION_TYPE_OPTIONS = [
  { value: "single_choice", label: "Một đáp án" },
  { value: "multiple_choice", label: "Nhiều đáp án" },
  { value: "fill_blank", label: "Điền khuyết" },
  { value: "matching", label: "Nối" },
  { value: "essay", label: "Tự luận" },
  { value: "speaking", label: "Nói" },
  { value: "listening", label: "Nghe" },
  { value: "paper_upload", label: "Đề giấy / PDF" },
];

interface Props {
  open: boolean;
  examId: number | null;
  onClose: () => void;
}

const empty = {
  question_type: "single_choice",
  skill: "grammar",
  difficulty: "medium",
  content: "",
  score: "1",
};

const AddExamQuestionModal = ({ open, examId, onClose }: Props) => {
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const [uploadedFile, setUploadedFile] = useState<{ id: number | string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const { mutate: addQuestion, isPending } = ExamService.useExamQuestionAdd();

  const isPaperUpload = form.question_type === "paper_upload";

  const handleClose = () => {
    setForm(empty);
    setUploadedFile(null);
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await FileAPI.upload(file);
      setUploadedFile({ id: uploaded.id, name: uploaded.name });
    } catch (err: any) {
      notification.error({ message: err?.msg ?? err?.message ?? "Tải file lên thất bại" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!examId) return;
    if (isPaperUpload && !uploadedFile) {
      notification.warning({ message: "Vui lòng tải lên file đề (PDF/ảnh)" });
      return;
    }
    if (!isPaperUpload && !form.content.trim()) {
      notification.warning({ message: "Vui lòng nhập nội dung câu hỏi" });
      return;
    }

    const params: Record<string, unknown> = {
      question_type: form.question_type,
      skill: form.skill,
      difficulty: form.difficulty,
      score: Number(form.score || 0),
      content: isPaperUpload ? null : form.content.trim(),
      file_id: isPaperUpload ? uploadedFile?.id : null,
      file_name: isPaperUpload ? uploadedFile?.name : null,
    };

    addQuestion(
      { id: examId, params },
      {
        onSuccess: () => {
          notification.success({ message: "Đã thêm câu hỏi" });
          handleClose();
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể thêm câu hỏi" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Thêm câu hỏi"
      titleEdit="Thêm câu hỏi"
      className="!w-[95%] xmd:!w-[520px]"
      confirmLoading={isPending || uploading}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Dạng câu hỏi</FieldLabel>
          <Select
            value={form.question_type}
            options={QUESTION_TYPE_OPTIONS}
            onChange={(v: any) => set({ question_type: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Môn học</FieldLabel>
            <Select
              value={form.skill}
              options={QUESTION_SKILL_OPTIONS.filter((o) => o.value)}
              onChange={(v: any) => set({ skill: v })}
            />
          </div>
          <div>
            <FieldLabel>Độ khó</FieldLabel>
            <Select
              value={form.difficulty}
              options={QUESTION_DIFFICULTY_OPTIONS.filter((o) => o.value)}
              onChange={(v: any) => set({ difficulty: v })}
            />
          </div>
        </div>

        {isPaperUpload ? (
          <div>
            <FieldLabel required>File đề (PDF/ảnh)</FieldLabel>
            <Input type="file" accept="application/pdf,image/*" onChange={handleFileSelect} disabled={uploading} />
            {uploadedFile && (
              <p className="mt-1 text-xs text-emerald-600">Đã tải lên: {uploadedFile.name}</p>
            )}
          </div>
        ) : (
          <div>
            <FieldLabel required>Nội dung câu hỏi</FieldLabel>
            <TextArea
              className="w-full"
              rows={3}
              value={form.content}
              onChange={(e) => set({ content: e.target.value })}
            />
          </div>
        )}

        <div>
          <FieldLabel required>Điểm</FieldLabel>
          <InputNumber
            min={0}
            className="w-full"
            value={form.score ? Number(form.score) : undefined}
            onChange={(v) => set({ score: v == null ? "" : String(v) })}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default AddExamQuestionModal;
