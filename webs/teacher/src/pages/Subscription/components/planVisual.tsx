import type { PlanTier } from "../_interface";

/* Icon từng gói — inline SVG (không phụ thuộc bộ icon tera-dls). */
const Plane = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
    <path
      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Crown = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
    <path
      d="M3 17h18M5 17 3 7l5 3.5L12 4l4 6.5L21 7l-2 10H5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Briefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
    <path
      d="M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 13h16"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Diamond = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
    <path
      d="M6 3h12l3 6-9 12L3 9l3-6ZM3 9h18M9 3l3 6 3-6M12 9v12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PLAN_ICON: Record<PlanTier, React.ReactNode> = {
  free: <Plane />,
  basic: <Crown />,
  advanced: <Briefcase />,
  premium: <Diamond />,
};

/** Màu nền + chữ ô icon theo gói. */
export const PLAN_ICON_COLOR: Record<PlanTier, string> = {
  free: "bg-sky-50 text-sky-500",
  basic: "bg-sky-50 text-brand",
  advanced: "bg-emerald-50 text-emerald-500",
  premium: "bg-violet-50 text-violet-500",
};
