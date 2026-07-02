import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownOutlined, Spin, XMarkOutlined } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

import {
  SelectOption,
  useAsyncSelectOptions,
} from "_common/hooks/useAsyncSelectOptions";

export interface AsyncSearchSelectProps<TItem> {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  useList: (payload: { params: Record<string, unknown> }) => {
    data?: { data?: { items?: any[] } };
    isFetching: boolean;
  };
  toOption: (item: TItem) => SelectOption;
  filters?: Record<string, unknown>;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

/**
 * Custom searchable dropdown for async entity pickers (branch/course/
 * classroom/level). Built by hand instead of `tera-dls`'s `Select` +
 * `showSearch` — that combination renders its own search input inside the
 * dropdown via an internal component whose icon overlaps typed text, the
 * same defect `SearchInput` works around for plain inputs, but there we
 * control the markup; here we don't, so we render the whole dropdown
 * ourselves (same approach as the working `UserSelect` in the admin app).
 */
function AsyncSearchSelect<TItem = any>({
  value,
  onChange,
  useList,
  toOption,
  filters,
  placeholder = "Vui lòng chọn",
  disabled,
  allowClear,
  className,
  selectedOption,
}: AsyncSearchSelectProps<TItem>) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const { options, loading, search, setSearch } = useAsyncSelectOptions<TItem>(
    { useList, toOption, filters },
  );

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setRect({ top: r.bottom + 4, left: r.left, width: r.width });
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

  const selected =
    options.find((o) => String(o.value) === String(value)) ??
    (selectedOption && String(selectedOption.value) === String(value)
      ? selectedOption
      : undefined);

  const handlePick = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={customTwMerge("w-full", className)}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-xsm border border-slate-300 bg-white px-3 text-sm hover:border-brand focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <span
          className={`truncate ${selected ? "text-slate-800" : "text-slate-400"}`}
        >
          {selected?.label ?? placeholder}
        </span>
        {allowClear && selected && !disabled ? (
          <XMarkOutlined
            className="h-4 w-4 shrink-0 text-slate-400 hover:text-red-500"
            onClick={(e: any) => {
              e.stopPropagation();
              onChange(undefined);
            }}
          />
        ) : (
          <ChevronDownOutlined className="h-4 w-4 shrink-0 text-slate-400" />
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
            className="rounded-xsm border border-slate-200 bg-white shadow-lg"
          >
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="h-8 w-full rounded border border-slate-300 px-2 text-sm text-slate-700 outline-none focus:border-brand"
              />
            </div>
            <div className="max-h-60 overflow-auto py-1">
              {loading && (
                <div className="flex items-center justify-center py-3">
                  <Spin spinning size="small" />
                </div>
              )}
              {!loading &&
                options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handlePick(option)}
                    className={`cursor-pointer px-3 py-2 text-sm hover:bg-sky-50 ${
                      String(option.value) === String(value)
                        ? "bg-sky-50 font-medium text-brand"
                        : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              {!loading && options.length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-400">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default AsyncSearchSelect;
