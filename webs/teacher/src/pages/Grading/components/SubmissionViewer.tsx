import moment from "moment";
import { DocumentTextOutlined } from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import WidgetState from "_common/components/WidgetState";

import type { SubmissionDetail } from "../_interface";

interface SubmissionViewerProps {
  submission: SubmissionDetail | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasSelection: boolean;
}

const SubmissionViewer = ({
  submission,
  isLoading,
  isError,
  onRetry,
  hasSelection,
}: SubmissionViewerProps) => {
  if (!hasSelection) {
    return (
      <Card>
        <EmptyState description="Chọn một học viên để xem bài nộp" className="py-16" />
      </Card>
    );
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Bài nộp của học viên</p>
      <WidgetState isLoading={isLoading} isError={isError} onRetry={onRetry}>
        {submission && (
          <div className="flex flex-col gap-4">
            {submission.submitted_at && (
              <p className="text-xs text-slate-400">
                Nộp lúc {moment(submission.submitted_at).format("DD/MM/YYYY HH:mm")}
              </p>
            )}

            {submission.answer && (
              <div className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700">
                {submission.answer}
              </div>
            )}

            {submission.files.length > 0 && (
              <div className="flex flex-col gap-2">
                {submission.files
                  .filter((f) => f.type === "image")
                  .map((file, i) => (
                    <img
                      key={i}
                      src={file.url}
                      alt={file.name ?? "Hình ảnh bài nộp"}
                      className="max-h-80 w-full rounded-xl border border-slate-100 object-contain"
                    />
                  ))}
                {submission.files
                  .filter((f) => f.type !== "image")
                  .map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-brand hover:bg-sky-50"
                    >
                      <DocumentTextOutlined className="h-4 w-4" />
                      {file.name ?? "Tệp đính kèm"}
                    </a>
                  ))}
              </div>
            )}

            {!submission.answer && submission.files.length === 0 && (
              <EmptyState description="Học viên chưa nộp nội dung" className="py-8" />
            )}
          </div>
        )}
      </WidgetState>
    </Card>
  );
};

export default SubmissionViewer;
