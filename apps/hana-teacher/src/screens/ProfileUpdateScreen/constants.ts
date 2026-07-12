import { ProfileFormValues } from './types';

export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export const DEFAULT_FORM_VALUES: ProfileFormValues = {
  full_name: '',
  dob: '',
  gender: 'male',
  phone: '',
};
