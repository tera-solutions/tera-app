/* Import: library */
import { useEffect, useState } from "react";
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
  Button,
} from "tera-dls";

/* Import: packages */
import { BUSINESS_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { BusinessService, UserService } from "@tera/modules";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : undefined;

const BusinessDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal detail.
  useEffect(() => {
    if (!isMobile) {
      navigate(BUSINESS_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "detail", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();
  const { globalStore } = useStores();

  const [activeTab, setActiveTab] = useState("basic");

  const { data, isPending } = BusinessService.useBusinessDetail({ id });
  const { mutate: onDelete, isPending: isDeleting } =
    BusinessService.useBusinessDelete();

  const business = data?.data?.business ?? data?.data;
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

  const handleDelete = () => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["business", "list"] });
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
                        {t("business.list")}
                      </span>
                    </a>
                  ),
                },
                { title: t("business.detail") },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
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

          <Spin spinning={isPending}>
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
              <div className="grid grid-cols-2 gap-3">
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
          </Spin>
        </div>

        <div className="flex justify-between mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(BUSINESS_PAGE_URL.update.path(Number(id)))}
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

export default BusinessDetailPage;
