/* Import: library */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ChevronDownOutlined, XMarkOutlined } from "tera-dls";

/* Import: services */
import { UserService } from "@tera/modules";

interface UserSelectProps {
  value?: string | number | null;
  /** user object đang gán (vd dataDetail.manager) để hiện đúng tên khi chưa có trong kết quả tìm */
  selectedUser?: { id?: number; full_name?: string } | null;
  onChange: (id: string, user?: any) => void;
  placeholder?: string;
  disabled?: boolean;
  /** hiện nút xóa lựa chọn (dùng cho filter) */
  allowClear?: boolean;
}

const BTN_CLASS =
  "w-full h-9 flex items-center justify-between gap-2 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const UserSelect = ({
  value,
  selectedUser,
  onChange,
  placeholder,
  disabled,
  allowClear,
}: UserSelectProps) => {
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
    // menu rộng tối thiểu 180; kẹp trong viewport để không tràn mép (vd cột phải nhất ở mobile)
    const width = Math.max(r.width, 180);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setRect({ top: r.bottom + 4, left, width });
  };

  useLayoutEffect(() => {
    if (open) updateRect();
  }, [open]);

  // debounce search -> keyword
  useEffect(() => {
    const id = setTimeout(() => setKeyword(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isFetching } = UserService.useUserList({
    params: { page: 1, per_page: 20, search: keyword || undefined },
  });
  const users: any[] = data?.data?.items ?? [];

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
    const fromList = users.find((u) => String(u.id) === String(value));
    if (fromList) return fromList.full_name ?? `#${value}`;
    if (selectedUser?.id != null && String(selectedUser.id) === String(value)) {
      return selectedUser.full_name ?? `#${value}`;
    }
    return `#${value}`;
  }, [value, users, selectedUser]);

  const handlePick = (id: string, user?: any) => {
    onChange(id, user);
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
        <span style={{ color: selectedLabel ? "#111827" : "#9ca3af" }} className="truncate">
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
                users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handlePick(String(u.id), u)}
                    className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-blue-50 ${
                      String(u.id) === String(value)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {u.full_name ?? `#${u.id}`}
                  </div>
                ))}
              {!isFetching && users.length === 0 && (
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

export default UserSelect;
