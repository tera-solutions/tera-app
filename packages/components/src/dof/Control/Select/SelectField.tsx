import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownOutlined, XMarkOutlined } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export const SELECT_FIELD_TRIGGER_CLASS =
  "w-full max-w-full min-w-0 h-9 flex items-center justify-between gap-2 border border-gray-300 bg-white rounded-[3px] px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 cursor-pointer box-border disabled:cursor-not-allowed disabled:bg-gray-100";

export interface SelectFieldProps {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  value: SelectOption["value"] | null | undefined;
  onChange: (value: SelectOption["value"] | undefined) => void;
  onBlur?: () => void;
  triggerRef?: (el: HTMLButtonElement | null) => void;
  "data-object_type"?: string;
  "data-object_id"?: string;
}

/**
 * Standalone trigger + dropdown qua createPortal, điều khiển thuần bằng value/onChange —
 * KHÔNG phụ thuộc FormTera/Controller. Cùng cơ chế với _common/components/FilterSelect
 * (né bug combobox input-first của tera-dls Select), nhưng dùng được ở bất kỳ đâu, kể cả
 * web không có FormTera (vd webs/teacher). `dof/Control/Select` (bản wire vào Controller)
 * dùng lại chính component này bên trong.
 */
function SelectField({
  options,
  placeholder = "Vui lòng chọn",
  disabled,
  allowClear,
  className,
  value,
  onChange,
  onBlur,
  triggerRef,
  ...dataProps
}: SelectFieldProps) {
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
        onBlur?.();
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
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className={className}>
      <button
        ref={(el) => {
          (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          triggerRef?.(el);
        }}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={customTwMerge(SELECT_FIELD_TRIGGER_CLASS, className)}
        {...dataProps}
      >
        <span className="truncate" style={{ color: hasValue ? "#111827" : "#9ca3af" }}>
          {label}
        </span>
        {allowClear && hasValue && !disabled ? (
          <XMarkOutlined
            className="w-4 h-4 shrink-0 text-gray-400 hover:text-red-500"
            onClick={(e: any) => {
              e.stopPropagation();
              onChange(undefined);
              onBlur?.();
            }}
          />
        ) : (
          <ChevronDownOutlined className="w-4 h-4 shrink-0 text-gray-400" />
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
              width: rect.width,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto py-1"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                    onBlur?.();
                  }}
                  className={customTwMerge(
                    "px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 truncate",
                    active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-800",
                    opt.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                  )}
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
}

export default SelectField;
