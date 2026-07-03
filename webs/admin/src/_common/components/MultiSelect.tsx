/* Import: library */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownOutlined } from "tera-dls";

export interface MultiOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiOption[];
  value: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (values: string[]) => void;
}

const BTN_CLASS =
  "h-9 w-full flex items-center justify-between gap-2 border border-gray-300 bg-white rounded px-3 text-[13px] hover:border-blue-700 focus:outline-none cursor-pointer box-border";

const MultiSelect = ({
  options,
  value,
  placeholder,
  disabled,
  onChange,
}: MultiSelectProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setRect({ top: r.bottom + 4, left: r.left, width: r.width });
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

  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const label =
    value.length === 0
      ? placeholder
      : options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label)
          .join(", ");

  return (
    <div className="w-full">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`${BTN_CLASS} ${disabled ? "bg-gray-100 cursor-not-allowed hover:border-gray-300" : ""}`}
      >
        <span className="truncate" style={{ color: value.length ? "#111827" : "#9ca3af" }}>
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
              minWidth: 180,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto py-1"
          >
            {options.length === 0 && (
              <div className="px-3 py-2 text-[13px] text-gray-400">—</div>
            )}
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="cursor-pointer"
                  />
                  <span className="truncate">{opt.label}</span>
                </label>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MultiSelect;
