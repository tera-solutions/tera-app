import type { ParentCreateForm } from './types';

export const RELATION_OPTIONS: { value: string; label: string }[] = [
  { value: 'Bố', label: 'Bố' },
  { value: 'Mẹ', label: 'Mẹ' },
  { value: 'Người thân', label: 'Người thân' },
];

export const DEFAULT_FORM_VALUES: ParentCreateForm = {
  name: '',
  phone: '',
  email: '',
  relation: 'Mẹ',
  student_id: null,
  student_label: '',
};
