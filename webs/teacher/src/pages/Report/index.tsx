import { useMemo } from "react";
import moment from "moment";
import {
  AcademicCapOutlined,
  ArrowDownTrayOutlined,
  Button,
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  ClockOutlined,
  RangePicker,
  StarOutlined,
  UsersOutlined,
  notification,
} from "tera-dls";

import Card from "_common/components/Card";
import ClassroomSelect from "_common/components/ClassroomSelect";
import DonutStatsCard from "_common/components/DonutStatsCard";
import StatisticCard from "_common/components/StatisticCard";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { TeacherReportService } from "@tera/modules/education";

import { toTeacherReport, formatMinutesAsHours } from "./_utils";
import ScoreByClassChart from "./components/ScoreByClassChart";
import ActivityOverTimeChart from "./components/ActivityOverTimeChart";

const Report = () => {
  const [filters, setFilters] = useUrlFilters(
    {
      classId: { type: "number", default: undefined as number | undefined, param: "class_id" },
      dateFrom: {
        type: "string",
        default: moment().startOf("month").format("YYYY-MM-DD"),
        param: "date_from",
      },
      dateTo: { type: "string", default: moment().format("YYYY-MM-DD"), param: "date_to" },
    },
    { syncDefaultsOnMount: true },
  );

  const reportQuery = TeacherReportService.useTeacherReportSummary({
    class_id: filters.classId,
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
  });
  const report = useMemo(() => toTeacherReport(reportQuery.data), [reportQuery.data]);
  const isLoading = reportQuery.isLoading;

  const attendanceLegend = [
    { key: "present", label: "Có mặt", color: "#10b981", value: report.attendanceBreakdown.present },
    { key: "excused", label: "Nghỉ có phép", color: "#0ea5e9", value: report.attendanceBreakdown.excused },
    { key: "absent", label: "Nghỉ không phép", color: "#ef4444", value: report.attendanceBreakdown.absent },
  ];

  const homeworkLegend = [
    { key: "submitted", label: "Đã nộp", color: "#10b981", value: report.homeworkStatus.submitted },
    { key: "pending", label: "Chưa nộp", color: "#f59e0b", value: report.homeworkStatus.pending },
    { key: "overdue", label: "Quá hạn", color: "#ef4444", value: report.homeworkStatus.overdue },
  ];

  const scoreLegend = [
    { key: "excellent", label: "Xuất sắc (9 - 10)", color: "#10b981", value: report.scoreDistribution.excellent },
    { key: "good", label: "Khá (7 - 8.9)", color: "#0ea5e9", value: report.scoreDistribution.good },
    { key: "average", label: "Trung bình (5 - 6.9)", color: "#f59e0b", value: report.scoreDistribution.average },
    { key: "weak", label: "Yếu (< 5)", color: "#ef4444", value: report.scoreDistribution.weak },
  ];
  const totalScored = Object.values(report.scoreDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Báo cáo</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Tổng quan hoạt động giảng dạy và kết quả học tập của các lớp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClassroomSelect
            value={filters.classId}
            onChange={(v) => setFilters({ classId: v ? Number(v) : undefined })}
            placeholder="Tất cả lớp"
            allowClear
          />
          <RangePicker
            inputReadOnly
            value={[moment(filters.dateFrom), moment(filters.dateTo)]}
            format="DD/MM/YYYY"
            suffixIcon={<CalendarDaysOutlined className="h-3.5 w-3.5 text-slate-400" />}
            onChange={(dates: any) => {
              if (!dates?.[0] || !dates?.[1]) return;
              setFilters({
                dateFrom: moment(dates[0]).format("YYYY-MM-DD"),
                dateTo: moment(dates[1]).format("YYYY-MM-DD"),
              });
            }}
          />
          <Button
            outlined
            icon={<ArrowDownTrayOutlined />}
            onClick={() => notification.warning({ message: "Tính năng đang được phát triển" })}
            className="whitespace-nowrap text-brand border-brand hover:bg-brand"
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatisticCard
          icon={<UsersOutlined />}
          value={report.overview.totalStudents}
          label="Tổng số học viên"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={report.overview.totalSessions}
          label="Số buổi dạy"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ClipboardDocumentCheckOutlined />}
          value={`${report.overview.attendanceRate}%`}
          label="Tỷ lệ chuyên cần"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<StarOutlined />}
          value={`${report.overview.avgScore}/10`}
          label="Điểm TB chung"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${report.overview.homeworkCompletionRate}%`}
          label="Tỷ lệ hoàn thành bài tập"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ClockOutlined />}
          value={formatMinutesAsHours(report.overview.teachingMinutes)}
          label="Thời gian giảng dạy"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ScoreByClassChart points={report.scoreByClass} loading={isLoading} />
        <DonutStatsCard
          title="Tỷ lệ chuyên cần"
          centerValue={`${report.overview.attendanceRate}%`}
          centerCaption="Tổng chuyên cần"
          loading={isLoading}
          legend={attendanceLegend}
        />
        <DonutStatsCard
          title="Bài tập theo trạng thái"
          centerValue={String(report.homeworkStatus.total)}
          centerCaption="Tổng bài tập"
          loading={isLoading}
          legend={homeworkLegend}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ActivityOverTimeChart points={report.weeklySessions} loading={isLoading} />
        <DonutStatsCard
          title="Phân loại điểm"
          centerValue={String(totalScored)}
          centerCaption="Học viên"
          loading={isLoading}
          legend={scoreLegend}
        />
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Hoạt động học tập</p>
          <div className="flex flex-col divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Bài tập đã giao</span>
              <span className="font-semibold text-slate-800">{report.activity.homeworkAssigned}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Bài tập đã nộp</span>
              <span className="font-semibold text-slate-800">{report.activity.homeworkSubmitted}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Bài tập đã chấm</span>
              <span className="font-semibold text-slate-800">{report.activity.homeworkGraded}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Report;
