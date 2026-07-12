import { ProfileData } from './types';

export const toProfileData = (raw: any): ProfileData => ({
  user_id: raw?.id ?? null,
  full_name: raw?.full_name ?? '',
  avatar_url: raw?.avatar_url ?? '',
  email: raw?.email ?? '',
  dob: raw?.dob ?? '',
  gender: raw?.gender ?? '',
  phone: raw?.phone ?? '',
  role_name: raw?.role_name ?? 'Giáo viên',
  is_online: raw?.status === 'active',
});
