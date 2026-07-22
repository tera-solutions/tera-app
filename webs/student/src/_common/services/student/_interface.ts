/**
 * Kiểu dữ liệu màn Trang chủ — bám đúng response mô tả ở
 * agents/claude/student/tasks/086_trang_chu_screen.md (mục 6.1).
 *
 * ⚠️ Backend CHƯA có route `/api/student/*` (kiểm chứng 2026-07-22: trả 404,
 * trong khi `/v1/edu/*` trả 401 tức là có thật). Dữ liệu hiện lấy từ mock, xem
 * `home.api.ts`.
 */

export interface IStudentBrief {
  name: string;
  avatar: string | null;
  streak: number;
  xp: number;
}

export interface IContinueLesson {
  id: number;
  title: string;
  progress: number;
  thumbnail: string | null;
  /** Bổ sung ngoài spec: mockup có hiện "Bài 12" và ảnh minh họa dạng emoji */
  lesson_no?: number;
  emoji?: string;
  gradient?: string;
}

export interface IWeeklyProgress {
  percent: number;
  lessons_completed: number;
  lessons_total: number;
  exercises_done: number;
  exercises_total: number;
  study_time_minutes: number;
}

export interface IUpcomingLesson {
  id: number;
  title: string;
  /** ISO date hoặc Y-m-d */
  date: string;
  /** Nhãn giờ hiển thị sẵn, vd "Ngày mai, 08:00" */
  time_label?: string;
}

export interface ISuggestedLesson {
  id: number;
  title: string;
  duration_minutes: number;
  is_new: boolean;
  thumbnail: string | null;
  lesson_no?: number;
  emoji?: string;
  gradient?: string;
}

export interface IHomeData {
  student: IStudentBrief;
  /** null = chưa có bài đang học dở → ẩn card "Tiếp tục học" (test case #6) */
  continue_lesson: IContinueLesson | null;
  weekly_progress: IWeeklyProgress;
  upcoming_lessons: IUpcomingLesson[];
  suggested_lessons: ISuggestedLesson[];
  /** Bổ sung ngoài spec: chủ đề hôm nay để dựng lời chào ở banner */
  today_topic?: string;
}
