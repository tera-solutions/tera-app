export const RELATION_OPTIONS = [
  { value: "Bố", label: "Bố" },
  { value: "Mẹ", label: "Mẹ" },
  { value: "Người thân", label: "Người thân" },
];

export const RELATION_BADGE: Record<string, string> = {
  Bố: "bg-sky-50 text-brand",
  Mẹ: "bg-pink-50 text-pink-500",
  "Người thân": "bg-violet-50 text-violet-500",
};

export const RELATION_BADGE_DEFAULT = "bg-slate-100 text-slate-500";

export const DEFAULT_FORM_VALUES = {
  name: "",
  phone: "",
  email: "",
  relation: "Mẹ",
  student_id: undefined,
};
