/* Import: library */
import { observer } from "mobx-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  PencilSquareOutlined,
  Button,
} from "tera-dls";

/* Import: packages */
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: containers */
import TeacherCertificate from "./containers/TeacherCertificate";
import TeacherReview from "./containers/TeacherReview";
import TeacherClass from "./containers/TeacherClass";
import TeacherSession from "./containers/TeacherSession";

const TeacherDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { globalStore } = useStores();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";
  const setActiveTab = (key: string) =>
    setSearchParams({ tab: key }, { replace: true });

  const { data, isPending } = TeacherService.useTeacherDetail({ id });

  const teacher = data?.data?.teacher;

  const skillLevelLabels: Record<string, string> = {
    beginner: t("teacher.skill_level_beginner"),
    intermediate: t("teacher.skill_level_intermediate"),
    advanced: t("teacher.skill_level_advanced"),
    expert: t("teacher.skill_level_expert"),
  };

  const employmentTypeLabels: Record<string, string> = {
    contract: t("teacher.employment_type_contract"),
    collaborator: t("teacher.employment_type_collaborator"),
    probation: t("teacher.employment_type_probation"),
  };

  const tabItems = [
    { key: "general", label: t("teacher.tab_detail") },
    { key: "salary", label: t("teacher.tab_salary") },
    { key: "certificate", label: t("teacher.certificate") },
    { key: "expertise", label: t("teacher.tab_expertise") },
    { key: "class", label: t("teacher.tab_class") },
    { key: "session", label: t("teacher.tab_session") },
    { key: "review", label: t("teacher.tab_review") },
    { key: "attendance", label: t("teacher.tab_attendance") },
    { key: "activity", label: t("teacher.tab_activity") },
  ];

  return (
    <div className='tera-page-form gap-0! relative'>
      <div className='sticky top-11.25 z-30 bg-[#F3F3F9]'>
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
                  alt={teacher.full_name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold'>
                  {teacher?.full_name ? teacher.full_name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <p className='text-base font-bold text-gray-800'>
              {teacher?.full_name ?? "—"}
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
                    <SectionHeader title={t("teacher.section_general")} />
                    <div className='divide-y divide-gray-100 mt-2'>
                      <InfoRow label={t("teacher.code")} value={teacher?.code} />
                      <InfoRow label={t("teacher.name")} value={teacher?.full_name} />
                      <InfoRow label={t("teacher.branch")} value={teacher?.branch?.name} />
                      <InfoRow
                        label={t("teacher.type")}
                        value={
                          teacher?.teacher_type
                            ? globalStore.getMetaLabel("teacher_type", teacher.teacher_type)
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("teacher.status")}
                        value={
                          teacher?.status
                            ? globalStore.getMetaLabel("teacher_status", teacher.status)
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("teacher.gender")}
                        value={
                          teacher?.gender
                            ? globalStore.getMetaLabel("gender", teacher.gender)
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("teacher.dob")}
                        value={
                          teacher?.dob
                            ? new Date(teacher.dob).toLocaleDateString("vi-VN")
                            : undefined
                        }
                      />
                      <InfoRow label={t("teacher.phone")} value={teacher?.phone} />
                      <InfoRow label={t("teacher.email")} value={teacher?.email} />
                      <InfoRow label={t("teacher.address")} value={teacher?.address} />
                      <InfoRow label={t("teacher.identity_no")} value={teacher?.identity_no} />
                      <InfoRow
                        label={t("teacher.joined_at")}
                        value={
                          teacher?.joined_at
                            ? new Date(teacher.joined_at).toLocaleDateString("vi-VN")
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}

                {activeTab === "salary" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_salary")} />
                    <div className='divide-y divide-gray-100 mt-2'>
                      <InfoRow
                        label={t("teacher.employment_type")}
                        value={teacher?.employment_type ? (employmentTypeLabels[teacher.employment_type] ?? teacher.employment_type) : undefined}
                      />
                      <InfoRow
                        label={t("teacher.salary_per_hour")}
                        value={
                          teacher?.hourly_rate != null
                            ? Number(teacher.hourly_rate).toLocaleString("vi-VN")
                            : undefined
                        }
                      />
                      <InfoRow
                        label={t("teacher.monthly_salary")}
                        value={
                          teacher?.monthly_salary != null
                            ? Number(teacher.monthly_salary).toLocaleString("vi-VN")
                            : undefined
                        }
                      />
                    </div>

                    <div className='mt-4'>
                      <SectionHeader title={t("teacher.bank_info")} />
                      <div className='divide-y divide-gray-100 mt-2'>
                        <InfoRow label={t("teacher.bank_name")} value={teacher?.bank_account?.bank_name} />
                        <InfoRow label={t("teacher.bank_account_number")} value={teacher?.bank_account?.bank_account_number} />
                        <InfoRow label={t("teacher.bank_account_holder")} value={teacher?.bank_account?.bank_account_holder} />
                        <InfoRow label={t("teacher.bank_branch")} value={teacher?.bank_account?.bank_branch} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "certificate" && (
                  <div>
                    <SectionHeader title={t("teacher.certificate")} />
                    <TeacherCertificate teacherId={Number(id)} />
                  </div>
                )}

                {activeTab === "expertise" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_expertise")} />
                    {teacher?.skills?.length ? (
                      <table className='w-full mt-2 text-[13px]'>
                        <thead>
                          <tr className='bg-gray-50 text-gray-500 text-left'>
                            <th className='px-3 py-2 font-medium'>{t("teacher.skill_name")}</th>
                            <th className='px-3 py-2 font-medium'>{t("teacher.skill_level")}</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                          {teacher.skills.map((skill) => (
                            <tr key={skill.id}>
                              <td className='px-3 py-2 text-gray-800'>{skill.skill_name}</td>
                              <td className='px-3 py-2 text-gray-800'>
                                {skillLevelLabels[skill.level] ?? skill.level}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <EmptyTab />
                    )}
                  </div>
                )}


                {activeTab === "class" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_class")} />
                    <div className="mt-2">
                      <TeacherClass teacherId={teacher?.id} />
                    </div>
                  </div>
                )}

                {activeTab === "session" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_session")} />
                    <div className="mt-2">
                      <TeacherSession teacherId={teacher?.id} />
                    </div>
                  </div>
                )}

                {activeTab === "review" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_review")} />
                    <div className="mt-2">
                      <TeacherReview teacherId={teacher?.id} />
                    </div>
                  </div>
                )}

                {activeTab === "attendance" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_attendance")} />
                    <EmptyTab />
                  </div>
                )}

                {activeTab === "activity" && (
                  <div>
                    <SectionHeader title={t("teacher.tab_activity")} />
                    <EmptyTab />
                  </div>
                )}
              </Spin>
            </div>
          </div>
        </div>

        <div className='flex justify-end mt-2 max-xmd:mb-[60px]'>
          <Button
            onClick={() => navigate(TEACHER_PAGE_URL.update.path(Number(id)))}
            className='flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold shadow-lg shadow-emerald-200 hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300 active:scale-95 transition-all duration-200 border-none!'
          >
            <PencilSquareOutlined className='w-5 h-5 xmd:w-4 xmd:h-4' />
            <span className='text-base xmd:text-sm'>{t("button.edit")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

const EmptyTab = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
      <svg className='w-12 h-12 mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
      </svg>
      <p className='text-sm'>{t("common.no_data")}</p>
    </div>
  );
};

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
