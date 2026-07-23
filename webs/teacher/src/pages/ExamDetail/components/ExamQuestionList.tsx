import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import Table, { TableColumn } from "_common/components/Table";

import type { ExamQuestionRow } from "../_interface";
import {
  QUESTION_DIFFICULTY_BADGE,
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_SKILL_LABELS,
  QUESTION_TYPE_LABELS,
} from "pages/QuestionBank/constants";

interface ExamQuestionListProps {
  questions: ExamQuestionRow[];
  loading?: boolean;
}

/** Exam-owned questions support one type beyond the Question Bank's own enum
 * (exam.md addendum: "upload đề giấy/PDF") — labelled locally so it doesn't
 * leak into the Question Bank's create form, which doesn't support it. */
const EXAM_ONLY_TYPE_LABELS: Record<string, string> = {
  paper_upload: "Đề giấy / PDF",
};

/** Questions embedded in the exam (snapshotted from the Question Bank when the
 * exam was generated — see `GenerateExamService`) — this is what lets a
 * teacher see what's actually inside an exam without leaving the page. */
const ExamQuestionList = ({ questions, loading }: ExamQuestionListProps) => {
  if (!loading && questions.length === 0) {
    return (
      <EmptyState
        description="Bài kiểm tra chưa có câu hỏi nào. Dùng chức năng sinh đề tự động từ Ngân hàng câu hỏi để thêm câu hỏi."
        className="py-6"
      />
    );
  }

  const columns: TableColumn<ExamQuestionRow>[] = [
    {
      key: "no",
      title: "#",
      headerClassName: "w-10",
      render: (_row, index) => index + 1,
    },
    {
      key: "content",
      title: "Nội dung câu hỏi",
      render: (row) =>
        row.question_type === "paper_upload" ? (
          row.file_url ? (
            <a
              href={row.file_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand hover:underline"
            >
              {row.file_name || "Xem file đề"}
            </a>
          ) : (
            <span className="text-slate-400">Chưa có file</span>
          )
        ) : (
          <p className="line-clamp-2 max-w-md font-medium text-slate-800">{row.content}</p>
        ),
    },
    {
      key: "skill",
      title: "Môn học",
      render: (row) => QUESTION_SKILL_LABELS[row.skill as keyof typeof QUESTION_SKILL_LABELS] ?? row.skill,
    },
    {
      key: "type",
      title: "Dạng câu hỏi",
      render: (row) =>
        EXAM_ONLY_TYPE_LABELS[row.question_type] ??
        QUESTION_TYPE_LABELS[row.question_type as keyof typeof QUESTION_TYPE_LABELS] ??
        row.question_type,
    },
    {
      key: "difficulty",
      title: "Độ khó",
      render: (row) => (
        <Badge
          className={`px-2.5 py-1 text-xs ${
            QUESTION_DIFFICULTY_BADGE[row.difficulty as keyof typeof QUESTION_DIFFICULTY_BADGE] ??
            "bg-slate-100 text-slate-500"
          }`}
        >
          {QUESTION_DIFFICULTY_LABELS[row.difficulty as keyof typeof QUESTION_DIFFICULTY_LABELS] ?? row.difficulty}
        </Badge>
      ),
    },
    {
      key: "score",
      title: "Điểm",
      render: (row) => row.score || "—",
    },
    {
      key: "answer_key",
      title: "Đáp án đúng",
      render: (row) => (row.answer_key.length ? row.answer_key.join(", ") : "—"),
    },
  ];

  return (
    <Table
      columns={columns}
      data={questions}
      rowKey={(row) => row.id}
      isLoading={loading}
      emptyText="Bài kiểm tra chưa có câu hỏi nào"
      minWidthClassName="min-w-160"
    />
  );
};

export default ExamQuestionList;
