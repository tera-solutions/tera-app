import { StudentFormValues } from './types';

export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export const DEFAULT_FORM_VALUES: StudentFormValues = {
  name: '',
  dob: '',
  gender: 'male',
  email: '',
  phone: '',
  parent_name: '',
  parent_phone: '',
};
