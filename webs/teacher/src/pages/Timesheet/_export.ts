import { downloadCsv } from "_common/utils/csv";

import type { TimesheetSessionRow } from "./_interface";
import { formatDuration } from "./_utils";

export const exportTimesheetCsv = (
  rows: TimesheetSessionRow[],
  getLearningTypeLabel: (value?: string | null) => string,
) => {
  const header = ["Ngày", "Lớp", "Hình thức", "Thời gian", "Giờ giảng", "Có mặt/Tổng", "Đánh giá"];
  const body = rows.map((r) => [
    r.sessionDate ?? "",
    r.className ?? "",
    r.learningType ? getLearningTypeLabel(r.learningType) : "",
    r.startTime && r.endTime ? `${r.startTime.slice(0, 5)} - ${r.endTime.slice(0, 5)}` : "",
    formatDuration(r.hours),
    `${r.presentCount}/${r.attendancesCount}`,
    r.averageRating ?? "",
  ]);

  downloadCsv(`bang-cong-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...body]);
};
