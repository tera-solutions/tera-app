/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Spin } from "tera-dls";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { LevelService } from "@tera/modules";

/* Import: pages */
import {
  IParentStudentHistory,
  IParentStudentLink,
} from "pages/CRM/parent-student/_interface";

interface IProps {
  link?: IParentStudentLink;
  loading?: boolean;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <div className="grid grid-cols-3 gap-2 py-2.5 text-[13px]">
    <span className="text-gray-500">{label}</span>
    <span className="col-span-2 text-gray-900 font-medium break-words">
      {value ?? <span className="text-gray-300">—</span>}
    </span>
  </div>
);

const ParentStudentDetailView = observer(({ link, loading }: IProps) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const [activeTab, setActiveTab] = useState("parent");

  const yesNo = (value?: boolean | number) =>
    value ? t("parent_student.yes") : t("parent_student.no");

  const statusBadge = (group: string, status?: string) => {
    if (!status) return undefined;
    const item = globalStore.getMetaItem(group, status);
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
        style={{ color: item?.color, backgroundColor: item?.backgroundColor }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: item?.color }}
        />
        {item?.label ?? status}
      </span>
    );
  };

  const relationLabel = link?.relation
    ? globalStore.getMetaLabel("guardian_relation", link.relation) ||
      link.relation
    : undefined;

  // Trình độ: backend crm/parent-student/detail thường chỉ trả level_id (không có
  // level.name) → map level_id sang tên qua catalog edu/level/list.
  const { data: levelData } = LevelService.useLevelList({
    params: { page: 1, per_page: 100 },
  });
  const levels: any[] = levelData?.data?.items ?? [];
  const studentLevel = (() => {
    const name = link?.student?.level?.name;
    if (name) return name;
    const id = link?.student?.level?.id ?? link?.student?.level_id;
    if (id != null) {
      const found = levels.find((lv: any) => Number(lv.id) === Number(id));
      return found?.level_name ?? found?.name ?? `#${id}`;
    }
    return undefined;
  })();

  const currentClass =
    link?.student?.class_name ?? link?.student?.class?.name ?? undefined;

  const histories: IParentStudentHistory[] =
    link?.histories ?? link?.logs ?? link?.change_logs ?? [];

  const resolveChangedBy = (h: IParentStudentHistory) => {
    if (h.user?.full_name || h.user?.name) return h.user.full_name ?? h.user.name;
    if (typeof h.changed_by === "string") return h.changed_by;
    if (h.changed_by)
      return h.changed_by.full_name ?? h.changed_by.name ?? undefined;
    return undefined;
  };

  const tabs = [
    { key: "parent", label: t("parent_student.parent_info") },
    { key: "student", label: t("parent_student.student_info") },
    { key: "relation", label: t("parent_student.relation_info") },
    { key: "history", label: t("parent_student.history") },
  ];

  return (
    <Spin spinning={!!loading}>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Thông tin phụ huynh */}
      <div className={activeTab === "parent" ? "block" : "hidden"}>
        <div className="flex flex-col divide-y divide-gray-100">
          <InfoRow
            label={t("parent_student.parent_code")}
            value={link?.parent?.code ?? link?.parent_code}
          />
          <InfoRow
            label={t("parent_student.full_name")}
            value={link?.parent?.name}
          />
          <InfoRow
            label={t("parent_student.phone")}
            value={link?.parent?.phone}
          />
          <InfoRow
            label={t("parent_student.email")}
            value={link?.parent?.email}
          />
        </div>
      </div>

      {/* Tab: Thông tin học viên */}
      <div className={activeTab === "student" ? "block" : "hidden"}>
        <div className="flex flex-col divide-y divide-gray-100">
          <InfoRow
            label={t("parent_student.student_code")}
            value={link?.student?.code ?? link?.student_code}
          />
          <InfoRow
            label={t("parent_student.full_name")}
            value={link?.student?.name}
          />
          <InfoRow
            label={t("parent_student.current_class")}
            value={currentClass}
          />
          <InfoRow label={t("parent_student.level")} value={studentLevel} />
          <InfoRow
            label={t("parent_student.status")}
            value={statusBadge(
              "student_status",
              link?.student_status ?? link?.student?.status,
            )}
          />
        </div>
      </div>

      {/* Tab: Thông tin quan hệ */}
      <div className={activeTab === "relation" ? "block" : "hidden"}>
        <div className="flex flex-col divide-y divide-gray-100">
          <InfoRow
            label={t("parent_student.relation")}
            value={relationLabel}
          />
          <InfoRow
            label={t("parent_student.is_primary_contact")}
            value={yesNo(link?.is_primary_contact)}
          />
          <InfoRow
            label={t("parent_student.is_billing_contact")}
            value={yesNo(link?.is_billing_contact)}
          />
          <InfoRow
            label={t("parent_student.is_pickup_authorized")}
            value={yesNo(link?.is_pickup_authorized)}
          />
          <InfoRow label={t("parent_student.note")} value={link?.note} />
        </div>
      </div>

      {/* Tab: Lịch sử thay đổi */}
      <div className={activeTab === "history" ? "block" : "hidden"}>
        {histories.length === 0 ? (
          <p className="text-[13px] text-gray-400 py-4 text-center">
            {t("parent_student.no_history")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3 font-medium">
                    {t("parent_student.history_user")}
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    {t("parent_student.history_time")}
                  </th>
                  <th className="py-2 font-medium">
                    {t("parent_student.history_content")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {histories.map((h, idx) => (
                  <tr
                    key={h.id ?? idx}
                    className="border-b border-gray-100 align-top"
                  >
                    <td className="py-2 pr-3 text-gray-900">
                      {resolveChangedBy(h) ?? (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">
                      {h.created_at ? (
                        new Date(h.created_at).toLocaleString("vi-VN")
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-700 break-words">
                      {h.content ??
                        h.description ?? (
                          <span className="text-gray-300">—</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Spin>
  );
});

export default ParentStudentDetailView;
