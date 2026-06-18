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
  Button,
  PencilSquareOutlined,
  TrashOutlined,
  notification,
} from "tera-dls";

/* Import: packages */
import useConfirm from "@tera/commons/hooks/useConfirm";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { StudentService } from "@tera/modules";

const StudentDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const confirmDialog = useConfirm();
  const queryClient = useQueryClient();
  const { globalStore } = useStores();

  const [activeTab, setActiveTab] = useState("general");

  const { data, isPending } = StudentService.useStudentDetail({ id });
  const { mutate: onDelete, isPending: isDeleting } =
    StudentService.useStudentDelete();
  const student = data?.data?.student;

  const handleDelete = () => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["student", "list"] });
              navigate(-1);
            },
            onError: (error: any) =>
              notification.error({
                message: error?.message || t("common.error_message"),
              }),
          },
        ),
    });
  };

  const tabItems = [
    { key: "general", label: t("common.detail_info") },
    { key: "parents", label: t("student.parents") },
  ];

  const parents = student?.parents ?? [];

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.25 z-30 bg-[#F3F3F9]">
        <div className="page-header-v2">
          <div className="page-header-v2__breadcrumb">
            <div
              className="page-header__breadcrumb-back cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ArrowSmallLeftSolid className="h-6 w-6" />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={() => navigate(-1)}>
                      <span className="text-blue-400! hover:text-blue-600!">
                        {t("student.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("student.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          {/* Profile card */}
          <div className="relative z-20 flex flex-col items-center py-4 px-20 bg-white rounded-md shadow-sm border border-gray-100 w-fit mx-auto">
            <div className="w-20 h-20 rounded-full mb-3 overflow-hidden">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                  {student?.name ? student.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <p className="text-base font-bold text-gray-800">
              {student?.name ?? "—"}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">{student?.code ?? "—"}</p>
          </div>

          {/* Info card with tabs */}
          <div className="relative z-10 bg-white rounded-lg border border-gray-200 shadow-sm px-4 pb-4 pt-6 -mt-14">
            <div className="pt-10">
              <div className="flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none">
                {tabItems.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
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
                    <SectionHeader title={t("common.general_info")} />
                    <div className="divide-y divide-gray-100 mt-2">
                      <InfoRow label={t("student.code")} value={student?.code} />
                      <InfoRow label={t("student.name")} value={student?.name} />
                      <InfoRow
                        label={t("student.branch")}
                        value={student?.branch?.name}
                      />
                      <InfoRow
                        label={t("student.gender")}
                        value={
                          student?.gender
                            ? globalStore.getMetaLabel("gender", student.gender)
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("student.dob")}
                        value={
                          student?.dob
                            ? new Date(student.dob).toLocaleDateString("vi-VN")
                            : undefined
                        }
                      />
                      <InfoRow label={t("student.phone")} value={student?.phone} />
                      <InfoRow label={t("student.email")} value={student?.email} />
                      <InfoRow
                        label={t("student.level")}
                        value={student?.level ? t(`student.level_${student.level}`, student.level) : undefined}
                      />
                      <InfoRow
                        label={t("student.status")}
                        value={
                          student?.status
                            ? globalStore.getMetaLabel(
                                "student_status",
                                student.status,
                              )
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("student.enrollment_date")}
                        value={
                          student?.enrollment_date
                            ? new Date(
                                student.enrollment_date,
                              ).toLocaleDateString("vi-VN")
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("student.admission_source")}
                        value={student?.admission_source}
                      />
                      <InfoRow
                        label={t("student.nationality")}
                        value={student?.nationality}
                      />
                      <InfoRow
                        label={t("student.language")}
                        value={student?.language}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "parents" && (
                  <div>
                    <SectionHeader title={t("student.parents")} />
                    {parents.length > 0 ? (
                      <div className="flex flex-col gap-2 mt-2">
                        {parents.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[13px] font-semibold text-gray-800">
                                {p.name ?? "—"}
                              </span>
                              {p.relation && (
                                <span className="inline-block w-fit px-1.5 py-0.5 text-[11px] rounded bg-blue-100 text-blue-700">
                                  {globalStore.getMetaLabel(
                                    "guardian_relation",
                                    p.relation,
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              {p.phone && (
                                <span className="text-[13px] text-gray-800">
                                  {p.phone}
                                </span>
                              )}
                              {p.email && (
                                <span className="text-[12px] text-gray-400">
                                  {p.email}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyTab />
                    )}
                  </div>
                )}
              </Spin>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(STUDENT_PAGE_URL.update.path(Number(id)))}
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 ml-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold shadow-lg shadow-emerald-200 hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <PencilSquareOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.edit")}</span>
          </Button>
          <Button
            onClick={handleDelete}
            loading={isDeleting}
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-red-400! to-red-500! text-white! font-semibold shadow-lg shadow-red-200 hover:from-red-500! hover:to-red-600! hover:shadow-red-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <TrashOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.delete")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

const EmptyTab = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg
        className="w-12 h-12 mb-3 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-sm">{t("common.no_data")}</p>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-gray-100 px-4 py-2 rounded border-l-4 border-blue-400">
    <h2 className="text-sm font-bold text-gray-800 uppercase">{title}</h2>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">{value ?? "—"}</span>
  </div>
);

export default StudentDetailPage;
