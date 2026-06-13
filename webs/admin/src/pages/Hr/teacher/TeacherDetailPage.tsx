/* Import: library */
import { useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  PencilSquareOutlined,
  TrashOutlined,
  notification,
} from "tera-dls";

/* Import: packages */
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { TeacherService } from "@tera/modules";

const TeacherDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const [activeTab, setActiveTab] = useState("general");

  const { data, isPending } = TeacherService.useTeacherDetail({ id });
  const { mutate: onDelete, isPending: isDeleting } =
    TeacherService.useTeacherDelete();

  const teacher = data?.data?.teacher;

  const typeLabels: Record<string, string> = {
    part_time: t("teacher.type_part_time"),
    full_time: t("teacher.type_full_time"),
    assistant: t("teacher.type_assistant"),
    freelance: t("teacher.type_freelance"),
  };

  const statusLabels: Record<string, string> = {
    active: t("teacher.status_active"),
    suspended: t("teacher.status_suspended"),
    resigned: t("teacher.status_resigned"),
  };

  const handleDelete = () => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
              navigate(-1);
            },
            onError: (error: any) => {
              notification.error({
                message: error?.message || t("common.error_message"),
              });
            },
          },
        ),
    });
  };

  const tabItems = [
    { key: "general", label: "Thông tin chi tiết" },
    { key: "salary", label: "Lương" },
    { key: "expertise", label: "Chuyên môn" },
    { key: "certificate", label: "Chứng chỉ" },
    { key: "class", label: "Lớp học" },
    { key: "session", label: "Buổi học" },
    { key: "review", label: "Đánh giá" },
    { key: "attendance", label: "Chấm công" },
    { key: "activity", label: "Lịch sử hoạt động" },
  ];

  return (
    <div className='tera-page-form gap-0! relative'>
      <div className='sticky top-11.25 z-10 bg-[#F3F3F9]'>
        <div className='page-header-v2'>
          <div className='page-header-v2__breadcrumb'>
            <div
              className='page-header__breadcrumb-back cursor-pointer'
              onClick={() => navigate(-1)}
            >
              <ArrowSmallLeftSolid className='h-6 w-6' />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={() => navigate(-1)}>
                      <span className='text-blue-400! hover:text-blue-600!'>
                        {t("teacher.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("teacher.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className='w-full max-w-3xl mx-auto'>
        <div className='relative'>
          {/* Profile card */}
          <div className='relative z-20 flex flex-col items-center py-4 px-20 bg-white rounded-md shadow-sm border border-gray-100 w-fit mx-auto'>
            <div className='w-20 h-20 rounded-full mb-3 overflow-hidden'>
              {teacher?.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold'>
                  {teacher?.name ? teacher.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <p className='text-base font-bold text-gray-800'>
              {teacher?.name ?? "—"}
            </p>
            <p className='text-sm text-gray-400 mt-0.5'>
              {teacher?.code ?? "—"}
            </p>
          </div>

          {/* Info card with tabs */}
          <div className='relative z-10 bg-white rounded-lg border border-gray-200 shadow-sm px-4 pb-4 pt-6 -mt-14'>
            <div className='pt-10'>
              <div className='flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none'>
                {tabItems.map((tab) => (
                  <button
                    key={tab.key}
                    type='button'
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <Spin spinning={isPending}>
                {activeTab === "general" && (
                  <div>
                    <SectionHeader title='Thông tin chung' />
                    <div className='divide-y divide-gray-100 mt-2'>
                      <InfoRow label={t("teacher.code")} value={teacher?.code} />
                      <InfoRow label={t("teacher.name")} value={teacher?.name} />
                      <InfoRow
                        label={t("teacher.type")}
                        value={
                          teacher?.type ? typeLabels[teacher.type] : undefined
                        }
                      />
                      <InfoRow
                        label={t("teacher.status")}
                        value={
                          teacher?.status
                            ? statusLabels[teacher.status]
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}

                {activeTab === "salary" && (
                  <div>
                    <SectionHeader title='Lương' />
                    <div className='divide-y divide-gray-100 mt-2'>
                      <InfoRow
                        label={t("teacher.salary_per_hour")}
                        value={
                          teacher?.salary_per_hour != null
                            ? teacher.salary_per_hour.toLocaleString("vi-VN")
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}

                {activeTab === "expertise" && (
                  <div>
                    <SectionHeader title='Chuyên môn' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "certificate" && (
                  <div>
                    <SectionHeader title='Chứng chỉ' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "class" && (
                  <div>
                    <SectionHeader title='Lớp học' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "session" && (
                  <div>
                    <SectionHeader title='Buổi học' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "review" && (
                  <div>
                    <SectionHeader title='Đánh giá' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "attendance" && (
                  <div>
                    <SectionHeader title='Chấm công' />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "activity" && (
                  <div>
                    <SectionHeader title='Lịch sử hoạt động' />
                    <EmptyTab />
                  </div>
                )}
              </Spin>
            </div>
          </div>
        </div>

        <div className='flex justify-between mt-2 max-xmd:mb-[60px]'>
          <button
            type='button'
            onClick={() => navigate(TEACHER_PAGE_URL.update.path(Number(id)))}
            className='flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 ml-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-200 hover:from-green-500 hover:to-emerald-600 hover:shadow-emerald-300 active:scale-95 transition-all duration-200'
          >
            <PencilSquareOutlined className='w-5 h-5 xmd:w-4 xmd:h-4' />
            <span className='text-base xmd:text-sm'>{t("button.edit")}</span>
          </button>
          <button
            type='button'
            onClick={handleDelete}
            disabled={isDeleting}
            className='flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow-lg shadow-red-200 hover:from-red-500 hover:to-red-600 hover:shadow-red-300 active:scale-95 transition-all duration-200 disabled:opacity-50'
          >
            <TrashOutlined className='w-5 h-5 xmd:w-4 xmd:h-4' />
            <span className='text-base xmd:text-sm'>{t("button.delete")}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const EmptyTab = () => (
  <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
    <svg className='w-12 h-12 mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
    </svg>
    <p className='text-sm'>Chưa có dữ liệu</p>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className='bg-gray-100 px-4 py-2 rounded border-l-4 border-blue-400'>
    <h2 className='text-sm font-bold text-gray-800 uppercase'>{title}</h2>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className='flex items-start gap-4 py-2.5'>
    <span className='w-36 text-[13px] text-gray-500 shrink-0'>{label}</span>
    <span className='text-[13px] text-gray-800 font-medium'>
      {value ?? "—"}
    </span>
  </div>
);

export default TeacherDetailPage;
