import type { ProfileData } from "./_interface";

export const toProfileData = (raw: any): ProfileData => ({
  full_name: raw?.full_name ?? "",
  avatar_url: raw?.avatar_url ?? "",
  email: raw?.email ?? "",
  dob: raw?.dob ?? "",
  gender: raw?.gender ?? "",
  phone: raw?.phone ?? "",
  role_name: raw?.role_name ?? "Giáo viên",
  is_online: raw?.status === "active",
});
