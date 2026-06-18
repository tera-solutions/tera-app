/* Import: library */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownOutlined } from "tera-dls";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  value: string;
  /** hiển thị khi value rỗng + là mục "Tất cả" ở đầu danh sách */
  placeholder?: string;
  onChange: (value: string) => void;
  /** class cho wrapper (width / xmd:order…) — thay cho class của native <select> cũ */
  className?: string;
  disabled?: boolean;
}

/**
 * Single-select dùng portal (giống SortSelect/MultiSelect) thay cho native <select>.
 * Native <select> để trình duyệt tự render popup (Firefox sizes theo option dài nhất)
 * → tràn mép phải trên mobile. Ở đây menu rộng đúng bằng nút + kẹp trong viewport.
 */
const FilterSelect = ({
  options,
  value,
  placeholder,
  onChange,
  className = "",
  disabled,
}: FilterSelectProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const width = r.width;
    // canh trái theo nút nhưng kẹp 2 mép để không tràn viền màn hình
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
  const label = selected ? selected.label : placeholder;

  return (
    <div className={className}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="h-9 w-full flex items-center justify-between gap-2 border border-gray-300 bg-white rounded px-2 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 cursor-pointer box-border disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <span
          className="truncate"
          style={{ color: value ? "#111827" : "#9ca3af" }}
        >
          {label}
        </span>
        <ChevronDownOutlined className="w-4 h-4 shrink-0 text-gray-400" />
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
            className="bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto py-1"
          >
            {placeholder && (
              <div
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 truncate ${
                  !value ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 truncate ${
                    active
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-800"
                  }`}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FilterSelect;
