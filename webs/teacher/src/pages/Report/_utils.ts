import type { TeacherReportData } from "./_interface";

const EMPTY: TeacherReportData = {
  overview: {
    totalStudents: 0,
    totalSessions: 0,
    attendanceRate: 0,
    avgScore: 0,
    homeworkCompletionRate: 0,
    teachingMinutes: 0,
  },
  scoreByClass: [],
  attendanceBreakdown: { present: 0, late: 0, absent: 0, excused: 0, total: 0 },
  scoreDistribution: { excellent: 0, good: 0, average: 0, weak: 0 },
  homeworkStatus: { submitted: 0, pending: 0, overdue: 0, total: 0 },
  activity: { homeworkAssigned: 0, homeworkSubmitted: 0, homeworkGraded: 0, materialsShared: 0 },
  weeklySessions: [],
};

export const toTeacherReport = (raw: any): TeacherReportData => {
  const data = raw?.data;
  if (!data) return EMPTY;

  return {
    overview: {
      totalStudents: data.overview?.total_students ?? 0,
      totalSessions: data.overview?.total_sessions ?? 0,
      attendanceRate: data.overview?.attendance_rate ?? 0,
      avgScore: data.overview?.avg_score ?? 0,
      homeworkCompletionRate: data.overview?.homework_completion_rate ?? 0,
      teachingMinutes: data.overview?.teaching_minutes ?? 0,
    },
    scoreByClass: (data.score_by_class ?? []).map((item: any) => ({
      classId: item.class_id,
      className: item.class_name,
      avgScore: item.avg_score,
    })),
    attendanceBreakdown: {
      present: data.attendance_breakdown?.present ?? 0,
      late: data.attendance_breakdown?.late ?? 0,
      absent: data.attendance_breakdown?.absent ?? 0,
      excused: data.attendance_breakdown?.excused ?? 0,
      total: data.attendance_breakdown?.total ?? 0,
    },
    scoreDistribution: {
      excellent: data.score_distribution?.excellent ?? 0,
      good: data.score_distribution?.good ?? 0,
      average: data.score_distribution?.average ?? 0,
      weak: data.score_distribution?.weak ?? 0,
    },
    homeworkStatus: {
      submitted: data.homework_status?.submitted ?? 0,
      pending: data.homework_status?.pending ?? 0,
      overdue: data.homework_status?.overdue ?? 0,
      total: data.homework_status?.total ?? 0,
    },
    activity: {
      homeworkAssigned: data.activity?.homework_assigned ?? 0,
      homeworkSubmitted: data.activity?.homework_submitted ?? 0,
      homeworkGraded: data.activity?.homework_graded ?? 0,
      materialsShared: data.activity?.materials_shared ?? 0,
    },
    weeklySessions: (data.weekly_sessions ?? []).map((item: any) => ({
      weekStart: item.week_start,
      totalSessions: item.total_sessions,
    })),
  };
};

export const formatMinutesAsHours = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};
