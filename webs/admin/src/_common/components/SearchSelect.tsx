/* Import: library */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ChevronDownOutlined, XMarkOutlined } from "tera-dls";

interface SearchSelectProps {
  value?: string | number | null;
  /** Bản ghi đang chọn — để hiện đúng nhãn khi nó không nằm trong 20 kết quả đang tải. */
  selectedItem?: any;
  onChange: (id: string, item?: any) => void;
  /**
   * Hook list của module (`StudentService.useStudentList`...). Được gọi với
   * `{ params: { page, per_page, search } }` — mọi list API của repo đều nhận `params.search`.
   */
  useList: (args: { params: any }) => { data?: any; isFetching?: boolean };
  /** Nhãn hiển thị của 1 item, vd `(s) => s.code ? `${s.code} - ${s.name}` : s.name`. */
  getLabel: (item: any) => string;
  /** Param cố định thêm vào mỗi lần gọi (vd `{ status: "active" }`). */
  extraParams?: Record<string, any>;
  placeholder?: string;
  disabled?: boolean;
  /** Hiện nút × xóa lựa chọn (dùng cho filter). */
  allowClear?: boolean;
}

const BTN_CLASS =
  "w-full h-9 flex items-center justify-between gap-2 border border-gray-300 bg-white px-2 text-[13px] hover:border-blue-700 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

/**
 * Select có **tìm kiếm phía server** cho 1 entity bất kỳ — bản tổng quát của `UserSelect`
 * (gõ → debounce 350ms → gọi lại list API với `search`), nên KHÔNG bị giới hạn 100 dòng đầu
 * như `FilterSelect` (vốn nhận sẵn mảng options).
 *
 * Dropdown render qua `createPortal` + `position: fixed` để không bị sticky header của
 * `TableTera` che (xem mục "Component lọc dùng chung" trong CLAUDE.md).
 */
const SearchSelect = ({
  value,
  selectedItem,
  onChange,
  useList,
  getLabel,
  extraParams,
  placeholder,
  disabled,
  allowClear,
}: SearchSelectProps) => {
  const { t } = useTranslation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    // menu rộng tối thiểu 220 (nhãn entity dài hơn tên user); kẹp trong viewport
    const width = Math.max(r.width, 220);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setRect({ top: r.bottom + 4, left, width });
  };

  useLayoutEffect(() => {
    if (open) updateRect();
  }, [open]);

  useEffect(() => {
    const id = setTimeout(() => setKeyword(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isFetching } = useList({
    params: { page: 1, per_page: 20, search: keyword || undefined, ...extraParams },
  });
  const items: any[] = data?.data?.items ?? [];

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

  const selectedLabel = useMemo(() => {
    if (value == null || value === "") return "";
    const fromList = items.find((i) => String(i.id) === String(value));
    if (fromList) return getLabel(fromList);
    if (selectedItem?.id != null && String(selectedItem.id) === String(value)) {
      return getLabel(selectedItem);
    }
    return `#${value}`;
  }, [value, items, selectedItem, getLabel]);

  const handlePick = (id: string, item?: any) => {
    onChange(id, item);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={BTN_CLASS}
        style={{ borderRadius: "3px" }}
      >
        <span
          style={{ color: selectedLabel ? "#111827" : "#9ca3af" }}
          className="truncate"
        >
          {selectedLabel || placeholder || t("common.search")}
        </span>
        {allowClear && selectedLabel && !disabled ? (
          <XMarkOutlined
            className="w-4 h-4 shrink-0 text-gray-400 hover:text-red-500"
            onClick={(e: any) => {
              e.stopPropagation();
              onChange("", undefined);
            }}
          />
        ) : (
          <ChevronDownOutlined className="w-4 h-4 shrink-0 text-gray-400" />
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
            className="bg-white border border-gray-200 rounded shadow-lg"
          >
            <div className="p-2 border-b border-gray-100">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.search")}
                className="w-full h-8 border border-gray-300 rounded px-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="max-h-60 overflow-auto py-1">
              {isFetching && (
                <div className="px-3 py-2 text-[13px] text-gray-400">
                  {t("common.loading")}
                </div>
              )}
              {!isFetching &&
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePick(String(item.id), item)}
                    className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 truncate ${
                      String(item.id) === String(value)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {getLabel(item)}
                  </div>
                ))}
              {!isFetching && items.length === 0 && (
                <div className="px-3 py-2 text-[13px] text-gray-400">
                  {t("common.no_data")}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SearchSelect;
