import { useTranslation } from "react-i18next";
import { MagnifyingGlassOutlined, PlusOutlined } from "tera-dls";

export type ClassFilter = "all" | "today" | "upcoming" | "completed";

export const CLASS_FILTERS: { value: ClassFilter; labelKey: string }[] = [
  { value: "all", labelKey: "classes.tab_all" },
  { value: "today", labelKey: "classes.tab_today" },
  { value: "upcoming", labelKey: "classes.tab_upcoming" },
  { value: "completed", labelKey: "classes.tab_completed" },
];

interface IProps {
  search: string;
  onSearch: (value: string) => void;
  filter: ClassFilter;
  onFilter: (value: ClassFilter) => void;
  onCreate?: () => void;
}

/** Ô tìm kiếm + tab lọc + nút tạo lớp — mục 5.1 của task [087] */
const ClassFilterBar = ({
  search,
  onSearch,
  filter,
  onFilter,
  onCreate,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <MagnifyingGlassOutlined className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hana-muted" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("classes.search_placeholder")}
            className="h-13 w-full rounded-full border border-transparent bg-white pl-12 pr-4 text-base text-hana-navy shadow-hana-sm outline-none transition placeholder:text-hana-muted/70 focus:border-hana-blue"
          />
        </div>

        <button
          type="button"
          onClick={onCreate}
          title={t("classes.create")}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full text-base font-semibold text-hana-navy transition hover:text-hana-blue"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hana-blue text-white shadow-hana">
            <PlusOutlined className="h-5 w-5" />
          </span>
          <span className="hidden xl:inline">{t("classes.create")}</span>
        </button>
      </div>

      {/* Tab lọc dạng viên thuốc */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        {CLASS_FILTERS.map((tab) => {
          const active = tab.value === filter;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onFilter(tab.value)}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-base font-semibold transition ${
                active
                  ? "bg-hana-blue text-white shadow-hana"
                  : "bg-white text-hana-navy hover:bg-hana-blue-soft"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ClassFilterBar;
