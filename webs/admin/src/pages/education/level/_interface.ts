export interface ILevel {
  id: number;
  level_code: string;
  level_name: string;
  course_id?: number;
  course?: { id: number; code?: string; name: string } | null;
  level_order?: number;
  cefr_level?: string; // Pre-A1/A1/A2/B1/B2/C1/C2
  description?: string | null;
  status: string; // active | inactive | suspended
  created_at?: string;
  updated_at?: string;
}

export interface ILevelForm {
  level_code: string;
  level_name: string;
  course_id: string;
  cefr_level: string;
  level_order: string;
  description: string;
  status: string;
}

/** Trạng thái cấp độ → badge (không có metadata → map cục bộ). */
export const LEVEL_STATUS_COLOR: Record<
  string,
  { color: string; backgroundColor: string }
> = {
  active: { color: "#16a34a", backgroundColor: "#dcfce7" },
  inactive: { color: "#6b7280", backgroundColor: "#f3f4f6" },
  suspended: { color: "#d97706", backgroundColor: "#fef3c7" },
};

export const LEVEL_STATUS_TABS = ["active", "inactive", "suspended"];

/** Khung CEFR cho dropdown (data có cả "Pre-A1"). */
export const CEFR_LEVELS = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
