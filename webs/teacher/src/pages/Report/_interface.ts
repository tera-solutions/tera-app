export interface ReportOverview {
  totalStudents: number;
  totalSessions: number;
  attendanceRate: number;
  avgScore: number;
  homeworkCompletionRate: number;
  teachingMinutes: number;
}

export interface ScoreByClassPoint {
  classId: number;
  className: string;
  avgScore: number | null;
}

export interface AttendanceBreakdown {
  present: number;
  late: number;
  absent: number;
  excused: number;
  total: number;
}

export interface ScoreDistribution {
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

export interface HomeworkStatus {
  submitted: number;
  pending: number;
  overdue: number;
  total: number;
}

export interface ActivitySummary {
  homeworkAssigned: number;
  homeworkSubmitted: number;
  homeworkGraded: number;
  materialsShared: number;
}

export interface WeeklySessionPoint {
  weekStart: string;
  totalSessions: number;
}

export interface TeacherReportData {
  overview: ReportOverview;
  scoreByClass: ScoreByClassPoint[];
  attendanceBreakdown: AttendanceBreakdown;
  scoreDistribution: ScoreDistribution;
  homeworkStatus: HomeworkStatus;
  activity: ActivitySummary;
  weeklySessions: WeeklySessionPoint[];
}
