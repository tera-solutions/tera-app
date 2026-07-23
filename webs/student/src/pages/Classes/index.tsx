import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import useIsMobile from "@tera/commons/hooks/useIsMobile";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import { IStudentClass } from "_common/services/student/_interface";
import { useStudentClasses } from "_common/services/student/class.service";

import ClassCard from "./containers/ClassCard";
import ClassFilterBar, { ClassFilter } from "./containers/ClassFilterBar";
import ClassRow, { CLASS_GRID } from "./containers/ClassRow";
import HanaAiPromptCard from "./containers/HanaAiPromptCard";
import MiniCalendar from "./containers/MiniCalendar";
import StudyStatsPanel from "./containers/StudyStatsPanel";

/** Lọc client-side: mock trả cả danh sách, tab/tìm kiếm chỉ lọc lại */
const matchFilter = (item: IStudentClass, filter: ClassFilter) => {
  if (filter === "all") return true;
  if (filter === "completed") return item.status === "completed";
  if (filter === "today") return item.status === "today";
  return item.status === "upcoming";
};

/** [087] Danh sách lớp học — agents/claude/student/tasks/087_danh_sach_lop_hoc_screen.md */
const ClassesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClassFilter>("all");

  const { data, isLoading } = useStudentClasses();

  const classes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (data ?? []).filter(
      (item) =>
        matchFilter(item, filter) &&
        (!keyword || item.name.toLowerCase().includes(keyword)),
    );
  }, [data, filter, search]);

  const openDetail = (item: IStudentClass) =>
    navigate(STUDENT_PAGE_URL.classDetail(item.id));

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-3xl font-extrabold text-hana-navy xl:text-[40px]">
        {t("classes.title")}
      </h1>

      <div>
        <ClassFilterBar
          search={search}
          onSearch={setSearch}
          filter={filter}
          onFilter={setFilter}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-3 xl:col-span-9">
          {/* Hàng tiêu đề cột chỉ có ở desktop */}
          {!isMobile && classes.length > 0 && (
            <div
              className={`${CLASS_GRID} whitespace-nowrap px-4 text-sm text-hana-muted`}
            >
              <span className="text-center">{t("classes.col_class")}</span>
              <span className="text-center">{t("classes.col_teacher")}</span>
              <span className="text-center">{t("classes.col_date")}</span>
              <span className="text-center">{t("classes.col_time")}</span>
              <span className="text-center">{t("classes.col_progress")}</span>
              <span className="text-center">{t("classes.col_status")}</span>
              <span />
            </div>
          )}

          {isLoading ? (
            <div className="flex animate-pulse flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 rounded-hana bg-white/70" />
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="hana-card flex flex-col items-center gap-2 px-6 py-14 text-center">
              <span className="text-4xl">🎒</span>
              <p className="text-lg font-semibold text-hana-navy">
                {t("classes.empty")}
              </p>
              <p className="max-w-sm text-base text-hana-muted">
                {t("classes.empty_hint")}
              </p>
            </div>
          ) : (
            classes.map((item) =>
              isMobile ? (
                <ClassCard key={item.id} item={item} onOpen={openDetail} />
              ) : (
                <ClassRow key={item.id} item={item} onOpen={openDetail} />
              ),
            )
          )}
        </div>

        {/* Cột phải: lịch + thống kê + trợ lý AI (mockup chỉ có ở desktop) */}
        <div className="hidden min-w-0 flex-col gap-4 xl:col-span-3 xl:flex">
          <MiniCalendar />
          <StudyStatsPanel />
          <HanaAiPromptCard />
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
