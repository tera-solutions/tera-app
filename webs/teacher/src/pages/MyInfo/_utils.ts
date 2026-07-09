import moment from "moment";

import type { ProfileData, TeachingProfileData } from "./_interface";

export const toProfileData = (raw: any): ProfileData => ({
  user_id: raw?.id ?? null,
  full_name: raw?.full_name ?? "",
  avatar_url: raw?.avatar_url ?? "",
  email: raw?.email ?? "",
  dob: raw?.dob ?? "",
  gender: raw?.gender ?? "",
  phone: raw?.phone ?? "",
  role_name: raw?.role_name ?? "Giáo viên",
  is_online: raw?.status === "active",
});

export const toTeachingProfile = (raw: any): TeachingProfileData | undefined => {
  if (!raw?.id) return undefined;
  const joinedAt = raw.joined_at ?? "";
  return {
    teacher_id: raw.id,
    teacher_type: raw.teacher_type ?? "",
    employment_type: raw.employment_type ?? "",
    joined_at: joinedAt,
    years_experience: joinedAt ? Math.max(0, moment().diff(moment(joinedAt), "years")) : 0,
    skills: (raw.skills ?? []).map((s: any) => ({
      id: s.id ?? 0,
      name: s.skill_name ?? "",
      level: s.level ?? "",
    })),
    certificates: (raw.certificates ?? []).map((c: any) => ({
      id: c.id ?? 0,
      name: c.certificate_name ?? "",
      issuer: c.issuer ?? "",
      issued_date: c.issued_date ?? "",
      expired_date: c.expired_date ?? "",
      is_expired: !!c.is_expired,
    })),
  };
};
