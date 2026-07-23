import type { LeadFormValues } from "./_interface";

// Backend `source` is a free-text string (CreateLeadRequest); these are just
// the common presets shown in the picker.
export const SOURCE_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Giới thiệu" },
  { value: "zalo", label: "Zalo" },
  { value: "other", label: "Khác" },
];

export const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
  SOURCE_OPTIONS.map((o) => [o.value, o.label]),
);

export const DEFAULT_FORM_VALUES: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  source: "facebook",
  note: "",
  branch_id: undefined,
};
