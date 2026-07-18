import { downloadCsv } from "_common/utils/csv";

import type { TeacherReportData } from "./_interface";
import { formatMinutesAsHours } from "./_utils";

/**
 * Xuất CSV phía client từ báo cáo đã tải — `teacher-report/summary` là route
 * duy nhất của module Report, backend không có route export riêng.
 */
export const exportReportCsv = (report: TeacherReportData, dateFrom: string, dateTo: string) => {
  const rows: (string | number)[][] = [
    ["Báo cáo giảng dạy", `${dateFrom} - ${dateTo}`],
    [],
    ["Tổng quan"],
    ["Tổng số học viên", report.overview.totalStudents],
    ["Số buổi dạy", report.overview.totalSessions],
    ["Tỷ lệ chuyên cần (%)", report.overview.attendanceRate],
    ["Điểm TB chung", report.overview.avgScore],
    ["Tỷ lệ hoàn thành bài tập (%)", report.overview.homeworkCompletionRate],
    ["Thời gian giảng dạy", formatMinutesAsHours(report.overview.teachingMinutes)],
    [],
    ["Chuyên cần", "Số lượng"],
    ["Có mặt", report.attendanceBreakdown.present],
    ["Đi trễ", report.attendanceBreakdown.late],
    ["Nghỉ có phép", report.attendanceBreakdown.excused],
    ["Nghỉ không phép", report.attendanceBreakdown.absent],
    [],
    ["Phân loại điểm", "Số học viên"],
    ["Xuất sắc (9 - 10)", report.scoreDistribution.excellent],
    ["Khá (7 - 8.9)", report.scoreDistribution.good],
    ["Trung bình (5 - 6.9)", report.scoreDistribution.average],
    ["Yếu (< 5)", report.scoreDistribution.weak],
    [],
    ["Bài tập", "Số lượng"],
    ["Đã giao", report.activity.homeworkAssigned],
    ["Đã nộp", report.activity.homeworkSubmitted],
    ["Đã chấm", report.activity.homeworkGraded],
    [],
    ["Điểm trung bình theo lớp"],
    ["Lớp", "Điểm TB"],
    ...report.scoreByClass.map((c) => [c.className, c.avgScore]),
  ];

  downloadCsv(`bao-cao-giang-day-${dateFrom}_${dateTo}.csv`, rows);
};
