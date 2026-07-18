import type { Teacher } from "./_interface";

export const toTeacher = (raw: any): Teacher => ({
  id: raw.id ?? 0,
  code: raw.code ?? "",
  fullName: raw.full_name ?? "",
  avatar: raw.avatar_url ?? raw.avatar ?? "",
  gender: raw.gender ?? null,
  dob: raw.dob ?? null,
  email: raw.email ?? null,
  phone: raw.phone ?? null,
  identityNo: raw.identity_no ?? null,
  address: raw.address ?? null,
  branchId: raw.branch_id ?? raw.branch?.id ?? null,
  branchName: raw.branch?.name ?? "",
  teacherType: raw.teacher_type ?? "",
  employmentType: raw.employment_type ?? null,
  hourlyRate: raw.hourly_rate != null ? Number(raw.hourly_rate) : null,
  monthlySalary: raw.monthly_salary != null ? Number(raw.monthly_salary) : null,
  status: (raw.status ?? "active") as Teacher["status"],
  joinedAt: raw.joined_at ?? null,
  note: raw.note ?? null,
  bankAccount: raw.bank_account
    ? {
        bankName: raw.bank_account.bank_name ?? null,
        bankAccountNumber: raw.bank_account.bank_account_number ?? null,
        bankAccountHolder: raw.bank_account.bank_account_holder ?? null,
        bankBranch: raw.bank_account.bank_branch ?? null,
      }
    : null,
});

export const toTeachers = (raw: any[] | null | undefined): Teacher[] => (raw ?? []).map(toTeacher);

export const formatVnd = (value: number | null): string =>
  value == null ? "—" : `${value.toLocaleString("vi-VN")} đ`;
