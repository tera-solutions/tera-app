export type StudentSortBy = "name" | "enrollment_date" | "avg_score";
export type StudentSortDir = "asc" | "desc";

export interface StudentListItem {
  id: number;
  code: string;
  name: string;
  avatar: string;
  dob: string;
  class_name: string;
  class_level: string;
  phone: string;
  avg_score: number | null;
  status: string;
  enrolled_at: string;
}

export interface StudentListResult {
  items: StudentListItem[];
  total: number;
  page: number;
  per_page: number;
}

export interface StudentSummary {
  total: number;
  active: number;
  dropped: number;
  completed: number;
}

export interface StudentFilters {
  search: string;
  class_id: number;
  level: string[];
  status: string[];
  rank: string;
  date_from: string;
  date_to: string;
  sort_by: StudentSortBy;
  sort_dir: StudentSortDir;
  page: number;
  per_page: number;
}
