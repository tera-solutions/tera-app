/* Import: library */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  sortBy: string;
  sortDir: "asc" | "desc";
  placeholder?: string;
  /** chọn trường mới mặc định chiều này (mặc định "asc") */
  defaultDir?: "asc" | "desc";
  onChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

const MENU_WIDTH = 200;

const SortSelect = ({
  options,
  sortBy,
  sortDir,
  placeholder,
  defaultDir = "asc",
  onChange,
}: SortSelectProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r)
      // canh phải dropdown theo nút icon, không để tràn mép trái màn hình
      setRect({ top: r.bottom + 4, left: Math.max(8, r.right - MENU_WIDTH) });
  };

  useLayoutEffect(() => {
    if (open) updateRect();
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

  const selected = options.find((o) => o.value === sortBy);
  const arrow = (dir: "asc" | "desc") => (dir === "asc" ? "↑" : "↓");

  const handlePick = (value: string) => {
    if (value === sortBy) {
      onChange(value, sortDir === "asc" ? "desc" : "asc");
    } else {
      onChange(value, defaultDir);
    }
  };

  return (
    <div className="inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={selected ? `${selected.label} ${arrow(sortDir)}` : placeholder}
        className={`relative h-9 w-9 flex items-center justify-center border rounded bg-white cursor-pointer focus:outline-none transition-colors ${
          selected
            ? "border-blue-500 text-blue-600"
            : "border-gray-300 text-gray-500 hover:border-blue-700"
        }`}
      >
        {/* icon sắp xếp (2 mũi tên lên/xuống) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" />
        </svg>
        {selected && (
          <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-blue-500 text-white text-[9px] leading-[14px] text-center">
            {arrow(sortDir)}
          </span>
        )}
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
              width: MENU_WIDTH,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded shadow-lg py-1"
          >
            {placeholder && (
              <div
                onClick={() => {
                  onChange("", defaultDir);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 ${
                  !sortBy ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => {
              const active = opt.value === sortBy;
              return (
                <div
                  key={opt.value}
                  onClick={() => handlePick(opt.value)}
                  className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 flex items-center justify-between ${
                    active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-800"
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <span>{arrow(sortDir)}</span>}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SortSelect;
