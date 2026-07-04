/* Import: library */
import { useRef, useState } from "react";
import { observer } from "mobx-react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import TeacherForm from "./containers/TeacherForm";
import TeacherCertificate from "./containers/TeacherCertificate";
import TeacherReview from "./containers/TeacherReview";
import TeacherClass from "./containers/TeacherClass";
import TeacherSession from "./containers/TeacherSession";

const TeacherFormModal = observer(({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const [activeTab, setActiveTab] = useState("general");
  const confirm = useConfirm();
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = TeacherService.useTeacherDetail({ id });
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

  const handleCloseConfirm = async () => {
    if (!isDetail && actionRef.current?.isDirty?.()) {
      confirm.warning({
        title: t("common.exit_title"),
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const titleMap = {
    create: t("teacher.create"),
    update: t("teacher.update"),
    detail: t("teacher.detail"),
  };

  return (
    <Modal
      title={titleMap[currentType]}
      destroyOnClose
      closeIcon={false}
      width={"60%"}
      open={open}
      centered={true}
      footer={
        <div className="flex justify-end gap-2">
          {isDetail && (
            <Button
              onClick={() => setCurrentType("update")}
              className="rounded-xsm!"
            >
              {t("button.edit")}
            </Button>
          )}
          <Button onClick={handleCloseConfirm} className="rounded-xsm!">
            {t("button.cancel")}
          </Button>
          {!isDetail && (
            <Button
              type="primary"
              className="rounded-xsm!"
              onClick={() => actionRef?.current?.submit()}
            >
              {t("button.save")}
            </Button>
          )}
        </div>
      }
    >
      <Spin spinning={isLoading}>
        {isDetail ? (
          <div>
            {/* Profile card */}
            <div className="flex flex-col items-center py-4 bg-white rounded-md border border-gray-100 mb-3">
              <div className="w-16 h-16 rounded-full mb-2 overflow-hidden">
                {teacher?.avatar ? (
                  <img
                    src={teacher.avatar}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
                    {teacher?.full_name ? teacher.full_name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-gray-800">{teacher?.full_name ?? "—"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{teacher?.code ?? "—"}</p>
            </div>

            {/* Tab bar */}
            <div className="flex overflow-x-auto overflow-y-hidden border-b border-gray-200 mb-3 [scrollbar-width:thin] [scrollbar-color:#d1d5db80_transparent] hover:[scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db80] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db]">
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

            {/* Tab content */}
            {activeTab === "general" && (
              <div>
                <SectionHeader title={t("teacher.section_general")} />
                <div className="divide-y divide-gray-100 mt-2">
                  <InfoRow label={t("teacher.code")} value={teacher?.code} />
                  <InfoRow label={t("teacher.name")} value={teacher?.full_name} />
                  <InfoRow label={t("teacher.branch")} value={teacher?.branch?.name} />
                  <InfoRow label={t("teacher.type")} value={teacher?.teacher_type ? globalStore.getMetaLabel("teacher_type", teacher.teacher_type) : undefined} />
                  <InfoRow label={t("teacher.status")} value={teacher?.status ? globalStore.getMetaLabel("teacher_status", teacher.status) : undefined} />
                  <InfoRow label={t("teacher.gender")} value={teacher?.gender ? globalStore.getMetaLabel("gender", teacher.gender) : undefined} />
                  <InfoRow label={t("teacher.dob")} value={teacher?.dob ? new Date(teacher.dob).toLocaleDateString("vi-VN") : undefined} />
                  <InfoRow label={t("teacher.phone")} value={teacher?.phone} />
                  <InfoRow label={t("teacher.email")} value={teacher?.email} />
                  <InfoRow label={t("teacher.address")} value={teacher?.address} />
                  <InfoRow label={t("teacher.identity_no")} value={teacher?.identity_no} />
                  <InfoRow label={t("teacher.joined_at")} value={teacher?.joined_at ? new Date(teacher.joined_at).toLocaleDateString("vi-VN") : undefined} />
                </div>
              </div>
            )}

            {activeTab === "salary" && (
              <div>
                <SectionHeader title={t("teacher.tab_salary")} />
                <div className="divide-y divide-gray-100 mt-2">
                  <InfoRow label={t("teacher.employment_type")} value={teacher?.employment_type ? (employmentTypeLabels[teacher.employment_type] ?? teacher.employment_type) : undefined} />
                  <InfoRow label={t("teacher.salary_per_hour")} value={teacher?.hourly_rate != null ? Number(teacher.hourly_rate).toLocaleString("vi-VN") : undefined} />
                  <InfoRow label={t("teacher.monthly_salary")} value={teacher?.monthly_salary != null ? Number(teacher.monthly_salary).toLocaleString("vi-VN") : undefined} />
                </div>

                <div className="mt-4">
                  <SectionHeader title={t("teacher.bank_info")} />
                  <div className="divide-y divide-gray-100 mt-2">
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
                <TeacherCertificate teacherId={id} />
              </div>
            )}

            {activeTab === "expertise" && (
              <div>
                <SectionHeader title={t("teacher.tab_expertise")} />
                {teacher?.skills?.length ? (
                  <table className="w-full mt-2 text-[13px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-left">
                        <th className="px-3 py-2 font-medium">{t("teacher.skill_name")}</th>
                        <th className="px-3 py-2 font-medium">{t("teacher.skill_level")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {teacher.skills.map((skill) => (
                        <tr key={skill.id}>
                          <td className="px-3 py-2 text-gray-800">{skill.skill_name}</td>
                          <td className="px-3 py-2 text-gray-800">{skillLevelLabels[skill.level] ?? skill.level}</td>
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

            {activeTab === "review" && (
              <div>
                <SectionHeader title={t("teacher.tab_review")} />
                <div className="mt-2">
                  <TeacherReview teacherId={teacher?.id} />
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

            {["attendance", "activity"].includes(activeTab) && (
              <div>
                <SectionHeader title={tabItems.find((t) => t.key === activeTab)?.label ?? ""} />
                <EmptyTab />
              </div>
            )}
          </div>
        ) : (
          <TeacherForm
            ref={actionRef}
            dataDetail={data?.data?.teacher}
            type={currentType}
            onSuccess={onClose}
          />
        )}
      </Spin>
    </Modal>
  );
});

const EmptyTab = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-start gap-4 py-2">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">{value ?? "—"}</span>
  </div>
);

export default TeacherFormModal;
