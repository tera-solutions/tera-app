// ─── Classroom (step 1) ─────────────────────────────────────────────────────

export interface ClassRoomSchedule {
  weekday?: number; // 2=T2 … 7=T7, 8=CN
  start_time?: string;
  end_time?: string;
}

export interface ClassRoomResponse {
  id: number;
  name: string;
  course_id?: number | null;
  course?: { id: number; name: string } | null;
  room?: { id?: number; name?: string } | null;
  total_students?: number;
  max_capacity?: number | null;
  schedules?: ClassRoomSchedule[];
  status?: string;
}

export interface EnrollmentClassroom {
  id: number;
  name: string;
  course_id: number | null;
  room: string;
  scheduleDays: string;
  studentCount: number;
  maxStudents: number;
}

// ─── Pricing (step 2) ───────────────────────────────────────────────────────

export interface EnrollmentPricing {
  total_lessons: number;
  price_per_lesson: number;
  discount_percent: number;
  bonus_lessons: number;
  paid_amount: number;
  payment_method: string;
}

// ─── Students (step 3) ──────────────────────────────────────────────────────

export interface EnrollmentDraftStudentNew {
  mode: 'new';
  key: string;
  name: string;
  dob: string;
  gender: string;
  email?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
}

export interface EnrollmentDraftStudentExisting {
  mode: 'existing';
  key: string;
  student_id: number;
  name: string;
  dob: string;
  email?: string;
}

export type EnrollmentDraftStudent =
  | EnrollmentDraftStudentNew
  | EnrollmentDraftStudentExisting;

// ─── Confirm (step 4) ───────────────────────────────────────────────────────

export interface EnrollmentRowResult {
  key: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}
