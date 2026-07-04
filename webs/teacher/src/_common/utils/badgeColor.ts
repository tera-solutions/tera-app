/**
 * Small hex → Tailwind-class lookups keyed by the metadata endpoint's `color`
 * (see `BadgeColor` in the API — Success/Warning/Danger/Info/Neutral). Lets UI
 * elements beyond the standard badge (outline buttons, accent bars) match a
 * status's semantic color family without hardcoding per-status classes.
 */
const BUTTON_VARIANT_BY_COLOR: Record<string, string> = {
  "#166534": "text-emerald-600 bg-transparent hover:bg-emerald-600 border border-emerald-600", // Success
  "#92400e": "text-amber-600 bg-transparent hover:bg-amber-600 border border-amber-600", // Warning
  "#991b1b": "text-red-600 bg-transparent hover:bg-red-600 border border-red-600", // Danger
  "#1e40af": "text-brand bg-transparent hover:bg-brand border border-brand", // Info
  "#374151": "text-slate-600 bg-transparent hover:bg-slate-600 border border-slate-600", // Neutral
};

const BAR_CLASS_BY_COLOR: Record<string, string> = {
  "#166534": "bg-emerald-400", // Success
  "#92400e": "bg-orange-400", // Warning
  "#991b1b": "bg-red-400", // Danger
  "#1e40af": "bg-brand", // Info
  "#374151": "bg-slate-300", // Neutral
};

const DEFAULT_BUTTON_VARIANT = BUTTON_VARIANT_BY_COLOR["#374151"];
const DEFAULT_BAR_CLASS = BAR_CLASS_BY_COLOR["#374151"];

export const getOutlineButtonVariant = (color?: string | null): string =>
  (color && BUTTON_VARIANT_BY_COLOR[color]) || DEFAULT_BUTTON_VARIANT;

export const getBarClass = (color?: string | null): string =>
  (color && BAR_CLASS_BY_COLOR[color]) || DEFAULT_BAR_CLASS;
