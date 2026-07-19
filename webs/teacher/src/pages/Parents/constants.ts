// Must match backend `App\Enums\Shared\GuardianRelation` exactly — the API
// stores/returns these English keys (not the Vietnamese label) for
// `children[].relation`, and validates any relation sent on create/update
// against this same enum.
export const RELATION_OPTIONS = [
  { value: "father", label: "Bố" },
  { value: "mother", label: "Mẹ" },
  { value: "guardian", label: "Người giám hộ" },
  { value: "grandfather", label: "Ông" },
  { value: "grandmother", label: "Bà" },
  { value: "uncle", label: "Chú/Bác" },
  { value: "aunt", label: "Cô/Dì" },
  { value: "other", label: "Khác" },
];

export const RELATION_LABEL: Record<string, string> = Object.fromEntries(
  RELATION_OPTIONS.map((o) => [o.value, o.label]),
);

export const RELATION_BADGE: Record<string, string> = {
  father: "bg-sky-50 text-brand",
  mother: "bg-pink-50 text-pink-500",
  guardian: "bg-violet-50 text-violet-500",
  grandfather: "bg-amber-50 text-amber-600",
  grandmother: "bg-amber-50 text-amber-600",
  uncle: "bg-slate-100 text-slate-600",
  aunt: "bg-slate-100 text-slate-600",
  other: "bg-slate-100 text-slate-500",
};

export const RELATION_BADGE_DEFAULT = "bg-slate-100 text-slate-500";

export const DEFAULT_FORM_VALUES = {
  name: "",
  phone: "",
  email: "",
  avatar: "",
  branch_id: undefined as number | undefined,
  relation: "mother",
  student_id: undefined as number | undefined,
};
