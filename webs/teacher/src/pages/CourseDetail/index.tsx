import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  AcademicCapOutlined,
  CheckBadgeOutlined,
  RectangleGroupOutlined,
  Spin,
  UsersOutlined,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { CourseService } from "@tera/modules/education";

import { toCourseDetail, toCourseStats, toCurriculumItems } from "./_utils";
import CourseInfoCard from "./components/CourseInfoCard";
import CurriculumList from "./components/CurriculumList";

const CourseDetail = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = id ? Number(id) : null;

  const courseQuery = CourseService.useCourseDetail({ id: courseId ?? "" });
  const course = useMemo(() => toCourseDetail(courseQuery.data?.data?.course), [courseQuery.data]);
  const stats = useMemo(() => toCourseStats(courseQuery.data?.data?.statistics), [courseQuery.data]);
  const curriculumItems = useMemo(
    () => toCurriculumItems(courseQuery.data?.data?.course?.curriculums),
    [courseQuery.data],
  );

  const notFound = !courseQuery.isLoading && (courseQuery.isError || !course?.id);

  const isLoading = courseQuery.isLoading;

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Lớp học", onClick: () => navigate(PATHS.classroom) },
          { label: "Chi tiết khóa học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => courseQuery.refetch()}
            message="Không tìm thấy khóa học"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách lớp học", onClick: () => navigate(PATHS.classroom) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {course ? (
            <div className="mt-2 flex flex-col gap-4">
              <CourseInfoCard detail={course} />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatisticCard
                  icon={<UsersOutlined />}
                  value={stats.total_students}
                  label="Học viên"
                  iconClassName="bg-sky-50 text-brand"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<CheckBadgeOutlined />}
                  value={stats.completed_students}
                  label="Đã hoàn thành"
                  iconClassName="bg-emerald-50 text-emerald-500"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<RectangleGroupOutlined />}
                  value={stats.total_classes}
                  label="Lớp học"
                  iconClassName="bg-violet-50 text-violet-500"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<AcademicCapOutlined />}
                  value={`${stats.completion_rate}%`}
                  label="Tỷ lệ hoàn thành"
                  iconClassName="bg-amber-50 text-amber-500"
                  loading={isLoading}
                />
              </div>

              <Card>
                <p className="mb-2 text-sm font-semibold text-slate-700">Chương trình học tập</p>
                <CurriculumList items={curriculumItems} loading={courseQuery.isLoading} />
              </Card>
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">Không tải được chi tiết khóa học</p>
          )}
        </Spin>
      )}
    </div>
  );
});

export default CourseDetail;
