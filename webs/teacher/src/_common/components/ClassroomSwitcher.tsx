import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowPathOutlined, ChevronDownOutlined } from "tera-dls";

import SearchInput from "_common/components/SearchInput";

interface SwitcherOption {
  id: number;
  name: string;
}

interface ClassroomSwitcherProps {
  options: SwitcherOption[];
  selectedId?: number;
  onChange: (id: number) => void;
  /** Trigger button label, e.g. "Đổi lớp" or "Đổi buổi". */
  label?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

/**
 * Generic "switch between a handful of options" picker (classes sharing a
 * lesson plan, sessions of a class, ...). A plain `Dropdown` doesn't support
 * an embedded search input, so this is a small self-managed popover (same
 * positioning approach as `AsyncSearchSelect`) filtering the already-fetched
 * option list client-side — there are only ever a handful of options, so no
 * server round-trip is needed.
 */
const ClassroomSwitcher = ({
  options,
  selectedId,
  onChange,
  label = "Đổi lớp",
  searchPlaceholder = "Tìm lớp học...",
  emptyText = "Không có lớp học phù hợp",
}: ClassroomSwitcherProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setRect({ top: r.bottom + 4, left: Math.max(r.right - 240, 8), width: 240 });
  };

  useEffect(() => {
    if (open) {
      updateRect();
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScrollResize = () => updateRect();
    const onDocClick = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [open]);

  if (options.length <= 1) return null;

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
      >
        <ArrowPathOutlined />
        {label}
        <ChevronDownOutlined />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              zIndex: 9999,
            }}
            className="rounded-xsm border border-slate-200 bg-white shadow-lg"
          >
            <div className="border-b border-slate-100 p-2">
              <SearchInput
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </div>
            <div className="max-h-60 overflow-auto py-1">
              {filtered.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className={`cursor-pointer px-3 py-2 text-sm hover:bg-sky-50 ${
                    o.id === selectedId
                      ? "bg-sky-50 font-medium text-brand"
                      : "text-slate-700"
                  }`}
                >
                  {o.name}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ClassroomSwitcher;
