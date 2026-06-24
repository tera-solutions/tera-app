/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Spin } from "tera-dls";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: pages */
import { IParent, IParentStatistics } from "pages/CRM/parent/_interface";

interface Props {
  parent?: IParent;
  statistics?: IParentStatistics;
  loading?: boolean;
}

const money = (v?: number | null) =>
  v == null ? "—" : `${Number(v).toLocaleString("vi-VN")} ₫`;

const ParentDetailView = observer(({ parent, statistics, loading }: Props) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { key: "personal", label: t("parent.personal_profile") },
    { key: "contact", label: t("parent.contact_info") },
    { key: "occupation", label: t("parent.occupation_info") },
    { key: "students", label: t("parent.linked_students") },
    { key: "finance", label: t("parent.finance_info") },
  ];

  const students = parent?.students ?? [];

  const fullAddress =
    [parent?.address, parent?.district, parent?.province]
      .filter(Boolean)
      .join(", ") || undefined;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none">
        {tabs.map((tab) => (
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

      <Spin spinning={!!loading}>
        {/* Tab 1: Hồ sơ cá nhân */}
        {activeTab === "personal" && (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                {parent?.avatar ? (
                  <img
                    src={parent.avatar}
                    alt={parent?.name ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                    {parent?.name ? parent.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
            </div>
            <SectionHeader title={t("parent.personal_profile")} />
            <div className="divide-y divide-gray-100 mt-2">
              <InfoRow label={t("parent.code")} value={parent?.code} />
              <InfoRow label={t("parent.name")} value={parent?.name} />
              <InfoRow
                label={t("parent.gender")}
                value={
                  parent?.gender
                    ? globalStore.getMetaLabel("gender", parent.gender)
                    : undefined
                }
              />
              <InfoRow
                label={t("parent.dob")}
                value={
                  parent?.dob
                    ? new Date(parent.dob).toLocaleDateString("vi-VN")
                    : undefined
                }
              />
            </div>
          </div>
        )}

        {/* Tab 2: Thông tin liên hệ */}
        {activeTab === "contact" && (
          <div>
            <SectionHeader title={t("parent.contact_info")} />
            <div className="divide-y divide-gray-100 mt-2">
              <InfoRow label={t("parent.email")} value={parent?.email} />
              <InfoRow label={t("parent.phone")} value={parent?.phone} />
              <InfoRow label={t("parent.address")} value={fullAddress} />
            </div>
          </div>
        )}

        {/* Tab 3: Thông tin nghề nghiệp */}
        {activeTab === "occupation" && (
          <div>
            <SectionHeader title={t("parent.occupation_info")} />
            <div className="divide-y divide-gray-100 mt-2">
              <InfoRow
                label={t("parent.occupation")}
                value={parent?.occupation}
              />
              <InfoRow label={t("parent.company")} value={parent?.company} />
            </div>
          </div>
        )}

        {/* Tab 4: Danh sách học viên liên kết */}
        {activeTab === "students" && (
          <div>
            <SectionHeader title={t("parent.linked_students")} />
            {students.length > 0 ? (
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <Th>{t("parent.student_code")}</Th>
                      <Th>{t("parent.name")}</Th>
                      <Th>{t("parent.class")}</Th>
                      <Th>{t("parent.course")}</Th>
                      <Th>{t("parent.relation")}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <Td>{s.code ?? "—"}</Td>
                        <Td className="font-medium text-gray-800">
                          {s.name ?? "—"}
                        </Td>
                        <Td>{s.class_name ?? s.class?.name ?? "—"}</Td>
                        <Td>{s.course_name ?? s.course?.name ?? "—"}</Td>
                        <Td>
                          {s.relation ? (
                            <span className="inline-block px-1.5 py-0.5 text-[11px] rounded bg-blue-100 text-blue-700">
                              {globalStore.getMetaLabel(
                                "guardian_relation",
                                s.relation,
                              )}
                            </span>
                          ) : (
                            "—"
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyTab />
            )}
          </div>
        )}

        {/* Tab 5: Thông tin tài chính */}
        {activeTab === "finance" && (
          <div>
            <SectionHeader title={t("parent.finance_info")} />
            {/* Tổng hợp */}
            <div className="grid grid-cols-2 xmd:grid-cols-4 gap-3 mt-3">
              <StatCard
                label={t("parent.total_students")}
                value={String(statistics?.total_students ?? 0)}
              />
              <StatCard
                label={t("parent.total_tuition")}
                value={money(statistics?.total_invoices)}
              />
              <StatCard
                label={t("parent.total_debt")}
                value={money(statistics?.total_debts)}
                valueClass="text-red-600"
              />
              <StatCard
                label={t("parent.total_payment")}
                value={money(statistics?.total_payments)}
                valueClass="text-green-600"
              />
            </div>

            {/* Tổng hợp theo học viên */}
            {students.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <Th>{t("parent.student")}</Th>
                      <Th className="text-right">{t("parent.total_tuition")}</Th>
                      <Th className="text-right">{t("parent.total_debt")}</Th>
                      <Th className="text-right">{t("parent.total_payment")}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <Td>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {s.name ?? "—"}
                            </span>
                            {s.code && (
                              <span className="text-[12px] text-gray-400">
                                {s.code}
                              </span>
                            )}
                          </div>
                        </Td>
                        <Td className="text-right">
                          {money(s.total_tuition ?? s.total_invoices)}
                        </Td>
                        <Td className="text-right text-red-600">
                          {money(s.total_debts)}
                        </Td>
                        <Td className="text-right text-green-600">
                          {money(s.total_payments)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
});

const Th = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <th className={`py-2 px-2 font-medium ${className}`}>{children}</th>;

const Td = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <td className={`py-2 px-2 text-gray-700 ${className}`}>{children}</td>;

const StatCard = ({
  label,
  value,
  valueClass = "text-gray-800",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 flex flex-col gap-1">
    <span className="text-[12px] text-gray-500">{label}</span>
    <span className={`text-[15px] font-bold ${valueClass}`}>{value}</span>
  </div>
);

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

export default ParentDetailView;
