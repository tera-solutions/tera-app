import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { AcademicCapOutlined, CalendarDaysOutlined, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ClassroomSwitcher from "_common/components/ClassroomSwitcher";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { StudentAPI } from "@tera/api";
import { ClassRoomService, StudentService } from "@tera/modules/education";
import { ParentService } from "@tera/modules/crm";

import StudentMaterialsCard from "pages/StudentDetail/components/StudentMaterialsCard";

import { toChildStats, toParentChildren, toParentDetail, toScheduleSlots } from "./_utils";
import ParentProfileCard from "./components/ParentProfileCard";
import ChildScheduleCard from "./components/ChildScheduleCard";
import ChildStatSidebar from "./components/ChildStatSidebar";

const ParentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const parentId = id ? Number(id) : null;
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // `crm/parent/detail` has no teacher/class scoping, so the access guard and
  // each child's class/course are resolved from the teacher's own roster —
  // same fix used on the Parents list.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["parent-detail", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });
  const rosterLoading = classesQuery.isLoading || rosterQueries.some((q) => q.isLoading);

  const studentRosterMap = useMemo(() => {
    const map = new Map<number, { class_id: number; class_name: string; course_id: number | null }>();
    classes.forEach((c: any, i: number) => {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, { class_id: c.id, class_name: c.name, course_id: c.course_id ?? null });
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const detailQuery = ParentService.useParentDetail({ id: parentId ?? "" });
  const parent = useMemo(() => toParentDetail(detailQuery.data?.data?.parent), [detailQuery.data]);
  const children = useMemo(
    () => toParentChildren(detailQuery.data?.data?.parent?.children, studentRosterMap),
    [detailQuery.data, studentRosterMap],
  );

  const isLoading = rosterLoading || detailQuery.isLoading;
  const notFound = !isLoading && (detailQuery.isError || !parent?.id || children.length === 0);

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0] ?? null;

  const classDetailQuery = ClassRoomService.useClassRoomDetail(
    { id: selectedChild?.class_id ?? "" },
    { enabled: !!selectedChild?.class_id },
  );
  const schedules = useMemo(
    () => toScheduleSlots(classDetailQuery.data?.data?.class?.schedules),
    [classDetailQuery.data],
  );

  const statsQuery = StudentService.useStudentStats(
    { id: selectedChild?.id ?? "" },
    { enabled: !!selectedChild?.id },
  );
  const stats = useMemo(() => toChildStats(statsQuery.data?.data), [statsQuery.data]);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Phụ huynh", onClick: () => navigate(PATHS.parents) },
            { label: parent?.name || "Chi tiết phụ huynh" },
          ]}
        />
      </div>

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => detailQuery.refetch()}
            message="Không tìm thấy phụ huynh hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách phụ huynh", onClick: () => navigate(PATHS.parents) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {parent ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
                <ParentProfileCard parent={parent} />

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <StatisticCard
                      icon={<AcademicCapOutlined />}
                      value={children.length}
                      label="Con đang học"
                      iconClassName="bg-sky-50 text-brand"
                      loading={isLoading}
                    />
                    <StatisticCard
                      icon={<CalendarDaysOutlined />}
                      value={schedules.length}
                      label="Buổi học / tuần"
                      sublabel={selectedChild?.name}
                      iconClassName="bg-emerald-50 text-emerald-500"
                      loading={classDetailQuery.isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Lịch học hàng tuần</p>
                        <ClassroomSwitcher
                          label="Đổi con"
                          searchPlaceholder="Tìm con..."
                          options={children.map((c) => ({ id: c.id, name: c.name }))}
                          selectedId={selectedChild?.id}
                          onChange={setSelectedChildId}
                        />
                      </div>
                      <ChildScheduleCard
                        childName={selectedChild?.name ?? ""}
                        schedules={schedules}
                        isLoading={classDetailQuery.isLoading}
                      />
                    </Card>

                    <Card>
                      <p className="mb-2 text-sm font-semibold text-slate-700">Tài liệu học tập</p>
                      <StudentMaterialsCard courseId={selectedChild?.course_id ?? null} />
                    </Card>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Thống kê học tập {selectedChild ? `— ${selectedChild.name}` : ""}
                  </p>
                  <ChildStatSidebar stats={stats} loading={statsQuery.isLoading} />
                </Card>

                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Thông báo mới nhất</p>
                  <EmptyState description="Chưa có thông báo liên quan" className="py-8" />
                </Card>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">Không tải được chi tiết phụ huynh</p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default ParentDetail;
