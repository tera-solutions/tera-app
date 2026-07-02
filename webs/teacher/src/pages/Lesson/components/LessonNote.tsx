import { useEffect, useRef, useState } from "react";
import { CheckCircleOutlined } from "tera-dls";
import { LessonService } from "@tera/modules/education";

import { NOTE_AUTOSAVE_DELAY, NOTE_MAX_LENGTH } from "../constants";

type SaveState = "idle" | "saving" | "saved" | "error";

interface LessonNoteProps {
  lessonId: number;
  initialNote: string;
}

/**
 * Personal note editor that debounces changes and auto-saves the lesson note.
 * The last successfully persisted value is tracked to avoid redundant requests.
 */
const LessonNote = ({ lessonId, initialNote }: LessonNoteProps) => {
  const [note, setNote] = useState(initialNote);
  const [state, setState] = useState<SaveState>("idle");
  const savedRef = useRef(initialNote);

  const { mutate: update } = LessonService.useLessonUpdate();

  // Reset when the underlying lesson changes.
  useEffect(() => {
    setNote(initialNote);
    savedRef.current = initialNote;
    setState("idle");
  }, [initialNote, lessonId]);

  useEffect(() => {
    if (!lessonId || note === savedRef.current) return;

    setState("saving");
    const timer = setTimeout(() => {
      update(
        { id: lessonId, params: { lesson_note: note } },
        {
          onSuccess: () => {
            savedRef.current = note;
            setState("saved");
          },
          onError: () => setState("error"),
        },
      );
    }, NOTE_AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [note, lessonId, update]);

  return (
    <div>
      <textarea
        value={note}
        maxLength={NOTE_MAX_LENGTH}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Thêm ghi chú cho bài học này..."
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
      />
      <div className="mt-1 h-4 text-xs">
        {state === "saving" && <span className="text-slate-400">Đang lưu...</span>}
        {state === "saved" && (
          <span className="flex items-center gap-1 text-emerald-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
            <CheckCircleOutlined />
            Đã lưu
          </span>
        )}
        {state === "error" && (
          <span className="text-red-500">Lưu thất bại, thử lại sau.</span>
        )}
      </div>
    </div>
  );
};

export default LessonNote;
