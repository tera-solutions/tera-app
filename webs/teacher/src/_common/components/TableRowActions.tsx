import { ReactNode } from "react";
import { Dropdown, EllipsisVerticalOutlined } from "tera-dls";

export interface TableRowAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

interface TableRowActionsProps {
  /** Rendered as plain icon buttons before the overflow menu, e.g. view/edit. */
  buttons?: { title: string; icon: ReactNode; onClick: () => void; disabled?: boolean }[];
  /** Rendered inside the "..." overflow dropdown, e.g. delete/publish. */
  menuItems?: TableRowAction[];
}

/** Shared trailing action cell for list tables: a row of icon buttons plus an
 * overflow "..." dropdown, both stopping click propagation so they don't
 * trigger a parent `onRowClick`. */
const TableRowActions = ({ buttons = [], menuItems = [] }: TableRowActionsProps) => (
  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
    {buttons.map((btn) => (
      <button
        key={btn.title}
        type="button"
        title={btn.title}
        onClick={btn.onClick}
        disabled={btn.disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4.5 [&_svg]:w-4.5"
      >
        {btn.icon}
      </button>
    ))}
    {menuItems.length > 0 && (
      <Dropdown
        trigger="click"
        menu={{
          itemClassName: "text-slate-700 hover:bg-brand! hover:text-white!",
          items: menuItems,
        }}
      >
        <button
          type="button"
          title="Thêm"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-5 [&_svg]:w-5"
        >
          <EllipsisVerticalOutlined />
        </button>
      </Dropdown>
    )}
  </div>
);

export default TableRowActions;
