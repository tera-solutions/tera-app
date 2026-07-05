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
import { BRANCH_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { BranchService, UserService } from "@tera/modules";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : undefined;

const BranchDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal detail.
  useEffect(() => {
    if (!isMobile) {
      navigate(BRANCH_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "detail", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const [activeTab, setActiveTab] = useState("basic");

  const { data, isPending } = BranchService.useBranchDetail({ id });
  const { mutate: onDelete, isPending: isDeleting } =
    BranchService.useBranchDelete();

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

  const handleDelete = () => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
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
                        {t("branch.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("branch.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          {/* Tab bar */}
          <div className="flex overflow-x-auto overflow-y-hidden border-b border-gray-200 mb-4 [scrollbar-width:thin] [scrollbar-color:#d1d5db80_transparent] hover:[scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db80] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db]">
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
            onClick={() => navigate(BRANCH_PAGE_URL.update.path(Number(id)))}
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

export default BranchDetailPage;
