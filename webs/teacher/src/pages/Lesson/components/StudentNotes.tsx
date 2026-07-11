import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircleOutlined, StarSolid, UserOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import { StudentService, ClassSessionFeedbackService } from "@tera/modules/education";
import { toClassStudentResult } from "pages/ClassroomDetail/_utils";

import { NOTE_AUTOSAVE_DELAY, NOTE_MAX_LENGTH } from "../constants";

interface StudentNotesProps {
  classId: number | null;
  sessionId: number | null;
}

interface StudentNoteRowProps {
  sessionId: number;
  student: { id: number; name: string; avatar: string };
  initialRating: number | null;
  initialComment: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const StudentNoteRow = ({
  sessionId,
  student,
  initialRating,
  initialComment,
}: StudentNoteRowProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [state, setState] = useState<SaveState>("idle");
  const savedRef = useRef({ rating: initialRating, comment: initialComment });

  const { mutate: upsert } = ClassSessionFeedbackService.useUpsertClassSessionFeedback();

  useEffect(() => {
    savedRef.current = { rating: initialRating, comment: initialComment };
    setRating(initialRating);
    setComment(initialComment);
    setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id, sessionId]);

  useEffect(() => {
    if (rating === savedRef.current.rating && comment === savedRef.current.comment) return;

    setState("saving");
    const timer = setTimeout(() => {
      upsert(
        {
          params: {
            session_id: sessionId,
            student_id: student.id,
            rating: rating ?? undefined,
            comment: comment || undefined,
          },
        } as any,
        {
          onSuccess: () => {
            savedRef.current = { rating, comment };
            setState("saved");
          },
          onError: () => setState("error"),
        },
      );
    }, NOTE_AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating, comment]);

  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 p-3">
      <Avatar
        src={student.avatar}
        alt={student.name}
        sizeClassName="h-9 w-9 shrink-0"
        fallbackIcon={<UserOutlined />}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-700">{student.name}</p>
          <div className="flex shrink-0 items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(rating === v ? null : v)}
                className={
                  "[&_svg]:h-4 [&_svg]:w-4 " +
                  ((rating ?? 0) >= v ? "text-amber-400" : "text-slate-200 hover:text-amber-300")
                }
              >
                <StarSolid />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          maxLength={NOTE_MAX_LENGTH}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ghi chú riêng cho học viên này..."
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
        />
        <div className="mt-1 h-4 text-xs">
          {state === "saving" && <span className="text-slate-400">Đang lưu...</span>}
          {state === "saved" && (
            <span className="flex items-center gap-1 text-emerald-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
              <CheckCircleOutlined />
              Đã lưu
            </span>
          )}
          {state === "error" && <span className="text-red-500">Lưu thất bại, thử lại sau.</span>}
        </div>
      </div>
    </div>
  );
};

const StudentNotes = ({ classId, sessionId }: StudentNotesProps) => {
  const rosterQuery = StudentService.useStudentList(
    { params: { class_id: classId ?? 0, per_page: 200 } },
    { enabled: !!classId },
  );
  const roster = useMemo(
    () => toClassStudentResult(rosterQuery.data?.data).items,
    [rosterQuery.data],
  );

  const feedbackParams = { session_id: sessionId ?? 0, per_page: 200 };
  const feedbackQuery = ClassSessionFeedbackService.useClassSessionFeedbackList(
    { params: feedbackParams },
    { enabled: !!sessionId },
  );
  const feedbackByStudent = useMemo(() => {
    const items = feedbackQuery.data?.data?.items ?? [];
    return new Map<number, { rating: number | null; comment: string }>(
      items.map((f: any) => [f.student_id, { rating: f.rating ?? null, comment: f.comment ?? "" }]),
    );
  }, [feedbackQuery.data]);

  if (!sessionId) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Buổi học này chưa gắn với buổi điểm danh nào.
      </p>
    );
  }

  if (rosterQuery.isLoading || feedbackQuery.isLoading) {
    return <p className="py-8 text-center text-sm text-slate-400">Đang tải...</p>;
  }

  if (roster.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">Lớp chưa có học viên nào.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {roster.map((student) => {
        const existing = feedbackByStudent.get(student.id);
        return (
          <StudentNoteRow
            key={student.id}
            sessionId={sessionId}
            student={student}
            initialRating={existing?.rating ?? null}
            initialComment={existing?.comment ?? ""}
          />
        );
      })}
    </div>
  );
};

export default StudentNotes;
