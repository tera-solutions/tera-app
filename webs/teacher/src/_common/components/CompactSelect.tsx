import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckOutlined, ChevronDownOutlined, XMarkOutlined } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

export interface CompactSelectOption {
  value: string;
  label: string;
}

interface CompactSelectProps {
  value: string;
  options: CompactSelectOption[];
  onChange: (value: string) => void;
  /** Hiện khi `value` không khớp option nào (vd khoảng ngày tùy chọn). */
  placeholder?: string;
  /** Đã chọn → chevron đổi thành nút × xóa về rỗng (kiểu FilterSelect admin);
   * option "Tất cả" không cần nằm trong menu nữa. */
  allowClear?: boolean;
  className?: string;
  disabled?: boolean;
}

const MENU_MIN_WIDTH = 160;

/**
 * Select gọn cho enum tĩnh trên header card/filter — thay native `<select>`
 * (popup native không style được). Menu render qua portal + vị trí fixed,
 * cùng house style với `AsyncSearchSelect` nhưng không có ô tìm kiếm.
 */
const CompactSelect = ({
  value,
  options,
  onChange,
  placeholder = "Chọn...",
  allowClear,
  className,
  disabled,
}: CompactSelectProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.max(r.width, MENU_MIN_WIDTH);
    // Kẹp mép phải để menu không tràn màn hình (menu có thể rộng hơn trigger).
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setRect({ top: r.bottom + 4, left, width });
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

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={customTwMerge(
          "flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100",
          open && "border-blue-700 ring ring-blue-300",
          className,
        )}
      >
        <span className={customTwMerge("truncate", !selected && "text-slate-400")}>
          {selected?.label ?? placeholder}
        </span>
        {allowClear && selected && !disabled ? (
          <XMarkOutlined
            className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors hover:text-red-500"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onChange("");
              setOpen(false);
            }}
          />
        ) : (
          <ChevronDownOutlined
            className={customTwMerge(
              "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {open &&
        !disabled &&
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
            className="overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          >
            <div className="max-h-60 overflow-auto">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={customTwMerge(
                      "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-sky-50",
                      active && "bg-sky-50/70 font-semibold text-brand",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {active && <CheckOutlined className="h-3.5 w-3.5 shrink-0 text-brand" />}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default CompactSelect;
