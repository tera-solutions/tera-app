import type { ClassStudent } from "pages/ClassroomDetail/_interface";
import type { AttendanceRecord } from "pages/ClassroomDetail/_interface";

import type { AttendanceRow, AttendanceSummaryCounts } from "./_interface";
import { DEFAULT_STATUS } from "./constants";

/**
 * Builds the editable grid rows from the full class roster plus whatever
 * attendance records already exist for the selected session. Students with
 * no record yet default to Present (task spec) but stay non-`dirty` so an
 * untouched session doesn't get saved as "everyone present" by accident.
 */
export const toAttendanceRows = (
  roster: ClassStudent[],
  records: AttendanceRecord[],
): AttendanceRow[] => {
  const byStudent = new Map(records.map((r) => [r.student_id, r]));
  return roster.map((student) => {
    const record = byStudent.get(student.id);
    return {
      student_id: student.id,
      name: student.name,
      avatar: student.avatar,
      code: student.code,
      record_id: record?.id ?? null,
      status: record?.status ?? DEFAULT_STATUS,
      time: "",
      dirty: false,
    };
  });
};

export const summarizeAttendance = (
  rows: AttendanceRow[],
): AttendanceSummaryCounts => ({
  present: rows.filter((r) => r.status === "present").length,
  late: rows.filter((r) => r.status === "late").length,
  absent: rows.filter((r) => r.status === "absent").length,
  total: rows.length,
});
