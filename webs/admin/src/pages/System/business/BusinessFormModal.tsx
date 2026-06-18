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
import { BusinessService, UserService } from "@tera/modules";

/* Import: pages */
import BusinessForm from "./containers/BusinessForm";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : undefined;

const BusinessFormModal = observer(({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const [activeTab, setActiveTab] = useState("basic");
  const confirm = useConfirm();
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = BusinessService.useBusinessDetail({ id });
  const business = data?.data?.business ?? data?.data;
  const statistics = data?.data?.statistics;

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

  const tabs = [
    { key: "basic", label: t("business.tab_basic") },
    { key: "contact", label: t("business.tab_contact") },
    { key: "operation", label: t("business.tab_operation") },
    { key: "statistics", label: t("business.tab_statistics") },
  ];
  const statItems = [
    { label: t("business.total_students"), value: statistics?.total_students },
    { label: t("business.total_parents"), value: statistics?.total_parents },
    { label: t("business.total_teachers"), value: statistics?.total_teachers },
    { label: t("business.total_classes"), value: statistics?.total_classes },
    { label: t("business.total_courses"), value: statistics?.total_courses },
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
    create: t("business.create"),
    update: t("business.update"),
    detail: t("business.detail"),
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
                <InfoRow label={t("business.code")} value={business?.business_code} />
                <InfoRow label={t("business.name")} value={business?.name} />
                <InfoRow label={t("business.short_name")} value={business?.short_name} />
                <InfoRow label={t("business.prefix")} value={business?.prefix} />
                <InfoRow label={t("business.tax_code")} value={business?.tax_code} />
                <InfoRow label={t("business.website")} value={business?.website} />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="divide-y divide-gray-100">
                <InfoRow label={t("business.phone")} value={business?.phone} />
                <InfoRow label={t("business.email")} value={business?.email} />
                <InfoRow label={t("business.address")} value={business?.address} />
                <InfoRow label={t("business.province")} value={business?.province} />
                <InfoRow label={t("business.district")} value={business?.district} />
                <InfoRow label={t("business.ward")} value={business?.ward} />
                <InfoRow label={t("business.zip_code")} value={business?.zip_code} />
              </div>
            )}

            {activeTab === "operation" && (
              <div className="divide-y divide-gray-100">
                <InfoRow
                  label={t("business.status")}
                  value={
                    business?.status
                      ? globalStore.getMetaLabel("business_status", business.status)
                      : undefined
                  }
                />
                <InfoRow
                  label={t("business.manager")}
                  value={resolveUser(business?.manager ?? business?.manager_id)}
                />
                <InfoRow label={t("business.created_by")} value={resolveUser(business?.created_by)} />
                <InfoRow label={t("business.updated_by")} value={resolveUser(business?.updated_by)} />
                <InfoRow label={t("business.created_at")} value={fmtDate(business?.created_at)} />
                <InfoRow label={t("business.updated_at")} value={fmtDate(business?.updated_at)} />
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
          <BusinessForm
            ref={actionRef}
            dataDetail={business}
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

export default BusinessFormModal;
