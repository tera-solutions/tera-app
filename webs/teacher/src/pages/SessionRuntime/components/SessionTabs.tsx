import classNames from "classnames";

export type SessionRuntimeTab = "attendance" | "notes";

const TABS: { key: SessionRuntimeTab; label: string }[] = [
  { key: "attendance", label: "Điểm danh" },
  { key: "notes", label: "Ghi chú" },
];

interface SessionTabsProps {
  tab: SessionRuntimeTab;
  onChange: (tab: SessionRuntimeTab) => void;
}

const SessionTabs = ({ tab, onChange }: SessionTabsProps) => (
  <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
    {TABS.map((item) => (
      <button
        key={item.key}
        type="button"
        onClick={() => onChange(item.key)}
        className={classNames(
          "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
          tab === item.key
            ? "border-brand text-brand"
            : "border-transparent text-slate-500 hover:text-slate-700",
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default SessionTabs;
