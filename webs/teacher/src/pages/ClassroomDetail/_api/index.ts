import EduApi from "_common/api/edu";

import type {
  AttendanceRecord,
  ClassroomDetailResult,
  ClassSession,
  ClassStudentParams,
  ClassStudentResult,
} from "../_interface";
import {
  normalizeAttendance,
  normalizeDetail,
  normalizeSessions,
  normalizeStudents,
} from "../normalize";

export interface SessionRange {
  date_from: string;
  date_to: string;
}

const ClassroomDetailApi = {
  getDetail: async (id: number | string): Promise<ClassroomDetailResult> =>
    normalizeDetail(await EduApi.classRoomDetail(id)),

  getSessions: async (
    classId: number,
    range: SessionRange,
  ): Promise<ClassSession[]> =>
    normalizeSessions(
      await EduApi.timetableCalendar({ class_id: classId, ...range }),
    ),

  getAttendance: async (classId: number): Promise<AttendanceRecord[]> =>
    normalizeAttendance(
      await EduApi.attendanceList({ class_id: classId, per_page: 100 }),
    ),

  // `class_id` is passed through so the list is class-scoped once the backend
  // honours the filter (currently it returns all students).
  getStudents: async ({
    class_id,
    search,
    status,
    page = 1,
    per_page = 10,
  }: ClassStudentParams): Promise<ClassStudentResult> =>
    normalizeStudents(
      await EduApi.studentList({
        class_id,
        page,
        per_page,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      }),
    ),
};

export default ClassroomDetailApi;
