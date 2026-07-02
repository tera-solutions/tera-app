import { Fragment } from "react";
import { ChevronRightOutlined } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page (rendered as plain text, not a link). */
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Trail of `label > label > current page` links above a detail page's content. */
const Breadcrumb = ({ items, className }: BreadcrumbProps) => (
  <div
    className={customTwMerge(
      "mb-4 flex items-center gap-1.5 text-sm text-slate-400 [&_svg]:h-4 [&_svg]:w-4",
      className,
    )}
  >
    {items.map((item, index) => (
      <Fragment key={index}>
        {index > 0 && <ChevronRightOutlined />}
        {item.onClick ? (
          <button
            type="button"
            onClick={item.onClick}
            className="hover:text-brand"
          >
            {item.label}
          </button>
        ) : (
          <span className="font-medium text-slate-600">{item.label}</span>
        )}
      </Fragment>
    ))}
  </div>
);

export default Breadcrumb;
