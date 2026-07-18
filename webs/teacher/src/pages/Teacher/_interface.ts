export type TeacherStatus = "active" | "suspended" | "resigned";

export interface Teacher {
  id: number;
  code: string;
  fullName: string;
  avatar: string;
  gender: string | null;
  dob: string | null;
  email: string | null;
  phone: string | null;
  identityNo: string | null;
  address: string | null;
  branchId: number | null;
  branchName: string;
  teacherType: string;
  employmentType: string | null;
  hourlyRate: number | null;
  monthlySalary: number | null;
  status: TeacherStatus;
  joinedAt: string | null;
  note: string | null;
  bankAccount: {
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountHolder: string | null;
    bankBranch: string | null;
  } | null;
}

export interface TeacherFilters {
  search: string;
  status: TeacherStatus | "";
}

export type TeacherSortBy = "full_name" | "code" | "joined_at" | "created_at";
export type TeacherSortDir = "asc" | "desc";
