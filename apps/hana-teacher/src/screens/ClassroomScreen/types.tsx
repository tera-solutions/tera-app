export interface ClassItem {
  id: string;
  name: string;

  level: string;
  ageGroup: string;

  room: string;
  branch: string;

  startTime: string;
  endTime: string;

  schedule: string;

  students: number;
  totalStudents: number;

  color: string;

  image: string;

  attendanceRate?: number;

  homeworkCount?: number;

  lessonPlanCount?: number;
}