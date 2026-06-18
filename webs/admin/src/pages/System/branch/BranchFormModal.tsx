/* Import: library */
import { useRef, useState } from "react";
import { observer } from "mobx-react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { BranchService, UserService } from "@tera/modules";

/* Import: pages */
import BranchForm from "./containers/BranchForm";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : undefined;

const BranchFormModal = observer(({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const [activeTab, setActiveTab] = useState("basic");
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = BranchService.useBranchDetail({ id });
  const branch = data?.data?.branch ?? data?.data;
  const statistics = data?.data?.statistics;

  // map id -> full_name từ 100 user đầu
  const { data: userData } = UserService.useUserList({
    params: { page: 1, per_page: 100 },
  });
  const userNameById: Record<string, string> = {};
  (userData?.data?.items ?? []).forEach((u: any) => {
    if (u?.id != null) userNameById[u.id] = u.full_name;
  });
  const resolveUser = (v: any) => {
    if (v == null) return undefined;
    if (typeof v === "object") return v.full_name ?? undefined;
    return userNameById[v] ?? `#${v}`;
  };
  const createdByName = resolveUser(branch?.created_by);
  const updatedByName = resolveUser(branch?.updated_by);

  const tabs = [
    { key: "basic", label: t("branch.tab_basic") },
    { key: "contact", label: t("branch.tab_contact") },
    { key: "operation", label: t("branch.tab_operation") },
    { key: "system", label: t("branch.tab_system") },
    { key: "statistics", label: t("branch.tab_statistics") },
  ];

  const statItems = [
    { label: t("branch.total_students"), value: statistics?.total_students },
    { label: t("branch.total_parents"), value: statistics?.total_parents },
    { label: t("branch.total_teachers"), value: statistics?.total_teachers },
    { label: t("branch.total_classes"), value: statistics?.total_classes },
    { label: t("branch.total_rooms"), value: statistics?.total_rooms },
    { label: t("branch.total_courses"), value: statistics?.total_courses },
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
    create: t("branch.create"),
    update: t("branch.update"),
    detail: t("branch.detail"),
  };

  return (
    <Modal
      title={titleMap[currentType]}
      destroyOnClose
      closeIcon={false}
      width={"50%"}
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

            {activeTab === "basic" && (
              <div className="divide-y divide-gray-100">
                <InfoRow label={t("branch.business")} value={branch?.business?.name} />
                <InfoRow label={t("branch.code")} value={branch?.code} />
                <InfoRow label={t("branch.name")} value={branch?.name} />
                <InfoRow label={t("branch.short_name")} value={branch?.short_name} />
                <InfoRow
                  label={t("branch.status")}
                  value={branch?.status ? t(`branch.status_${branch.status}`) : undefined}
                />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="divide-y divide-gray-100">
                <InfoRow label={t("branch.phone")} value={branch?.phone} />
                <InfoRow label={t("branch.email")} value={branch?.email} />
                <InfoRow label={t("branch.website")} value={branch?.website} />
                <InfoRow label={t("branch.address")} value={branch?.address} />
                <InfoRow label={t("branch.province")} value={branch?.province} />
                <InfoRow label={t("branch.district")} value={branch?.district} />
                <InfoRow label={t("branch.ward")} value={branch?.ward} />
                <InfoRow label={t("branch.postal_code")} value={branch?.postal_code} />
              </div>
            )}

            {activeTab === "operation" && (
              <div className="divide-y divide-gray-100">
                <InfoRow
                  label={t("branch.manager")}
                  value={branch?.manager?.full_name}
                />
                <InfoRow label={t("branch.opened_at")} value={fmtDate(branch?.opened_at)} />
                <InfoRow label={t("branch.capacity")} value={branch?.capacity} />
              </div>
            )}

            {activeTab === "system" && (
              <div className="divide-y divide-gray-100">
                <InfoRow label={t("branch.created_by")} value={createdByName} />
                <InfoRow label={t("branch.updated_by")} value={updatedByName} />
                <InfoRow label={t("branch.created_at")} value={fmtDate(branch?.created_at)} />
                <InfoRow label={t("branch.updated_at")} value={fmtDate(branch?.updated_at)} />
              </div>
            )}

            {activeTab === "statistics" && (
              <div className="grid grid-cols-3 gap-3">
                {statItems.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3 flex flex-col gap-1"
                  >
                    <span className="text-[12px] text-gray-500">{s.label}</span>
                    <span className="text-xl font-bold text-blue-600">
                      {s.value ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <BranchForm
            ref={actionRef}
            dataDetail={branch}
            type={currentType}
            onSuccess={onClose}
          />
        )}
      </Spin>
    </Modal>
  );
});

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start gap-4 py-2">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">{value ?? "—"}</span>
  </div>
);

export default BranchFormModal;
