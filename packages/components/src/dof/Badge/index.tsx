import { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

interface BadgeProps {
  children: ReactNode;
  /** Size + color classes, e.g. "px-2.5 py-0.5 text-[11px] bg-emerald-50 text-emerald-600". */
  className?: string;
  style?: CSSProperties;
}

/** Shared rounded-pill markup for status/category/count labels — every portal. */
const Badge = ({ children, className, style }: BadgeProps) => (
  <span
    className={classNames(
      "inline-flex shrink-0 items-center rounded-full font-medium",
      className,
    )}
    style={style}
  >
    {children}
  </span>
);

export default Badge;
