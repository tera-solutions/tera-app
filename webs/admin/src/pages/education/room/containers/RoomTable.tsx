/* Import: library */
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  PaginationProps,
  notification,
  DropdownItem,
  HomeOutlined,
  Modal,
} from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { ROOM_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { RoomService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { IRoom, RoomStatus } from "pages/education/room/_interface";

interface RoomTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

// room_status KHÔNG có trong metadata → màu badge hardcode cục bộ
const STATUS_BADGE: Record<
  RoomStatus,
  { color: string; backgroundColor: string }
> = {
  active: { color: "#16a34a", backgroundColor: "#dcfce7" },
  inactive: { color: "#6b7280", backgroundColor: "#f3f4f6" },
  maintenance: { color: "#d97706", backgroundColor: "#fef3c7" },
};

// Avatar tròn có fallback icon khi URL ảnh hỏng (staging hay chứa link CDN chết)
const RoomAvatar = ({ src, name }: { src?: string | null; name?: string }) => {
  const [broken, setBroken] = useState(false);
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
      {src && !broken ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <HomeOutlined className="w-4 h-4 text-gray-300" />
      )}
    </div>
  );
};

const RoomTable = ({ params, setParams, setModalData }: RoomTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data, isPending } = RoomService.useRoomList({ params });
  const { mutate: onSuspend, isPending: isSuspending } =
    RoomService.useRoomSuspend();
  const { mutate: onRestore, isPending: isRestoring } =
    RoomService.useRoomRestore();
  const isUpdating = isSuspending || isRestoring;

  const [pendingSuspend, setPendingSuspend] = useState<IRoom | null>(null);
  const [reason, setReason] = useState("");

  const callbacks = (onDone?: () => void) => ({
    onSuccess: () => {
      notification.success({ message: t("common.update_success") });
      onDone?.();
    },
    onError: (error: any) =>
      notification.error({
        message: error?.message || t("common.error_message"),
      }),
  });

  const handleToggleStatus = (record: IRoom) => {
    if (record.status === "active") {
      // đang hoạt động → tạm ngưng: cần nhập lý do
      setReason("");
      setPendingSuspend(record);
    } else {
      // inactive/maintenance → khôi phục: restore (không body)
      onRestore({ id: record.id, params: {} }, callbacks());
    }
  };

  const handleConfirmSuspend = () => {
    if (!pendingSuspend) return;
    onSuspend(
      { id: pendingSuspend.id, params: { reason: reason.trim(), force: false } },
      callbacks(() => setPendingSuspend(null)),
    );
  };

  const itemsAction = (record: IRoom): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () =>
        isMobile
          ? navigate(ROOM_PAGE_URL.detail.path(record.id))
          : setModalData({ open: true, type: "detail", id: record.id }),
    },
    {
      key: "edit",
      label: t("button.edit"),
      onClick: () =>
        isMobile
          ? navigate(ROOM_PAGE_URL.update.path(record.id))
          : setModalData({ open: true, type: "update", id: record.id }),
    },
    {
      key: "toggle-status",
      label:
        record.status === "active" ? (
          <span className="text-gray-600">{t("room.suspend")}</span>
        ) : (
          <span className="text-green-600">{t("room.restore")}</span>
        ),
      onClick: () => handleToggleStatus(record),
    },
  ];

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const columns = [
    {
      title: <HeaderTitle>{t("room.code")}</HeaderTitle>,
      dataIndex: "room_code",
      key: "room_code",
      width: 110,
    },
    {
      title: <HeaderTitle>{t("room.name")}</HeaderTitle>,
      dataIndex: "room_name",
      key: "room_name",
      width: 220,
      render: (name: string, record: IRoom) => (
        <div className="flex items-center gap-2">
          <RoomAvatar src={record.avatar} name={name} />
          <span className="text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("room.branch")}</HeaderTitle>,
      key: "branch",
      width: 180,
      render: (_: any, record: IRoom) =>
        record.branch?.name ?? <span className="text-gray-300">—</span>,
    },
    {
      title: <HeaderTitle>{t("room.type")}</HeaderTitle>,
      dataIndex: "room_type",
      key: "room_type",
      width: 140,
      render: (value: string) =>
        value ? (
          t(`room.type_${value}`)
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("room.floor")}</HeaderTitle>,
      dataIndex: "floor",
      key: "floor",
      width: 90,
      align: "center" as const,
      render: (value: any) =>
        value != null && value !== "" ? (
          value
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("room.capacity")}</HeaderTitle>,
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
      align: "center" as const,
      render: (value: any) =>
        value != null ? value : <span className="text-gray-300">—</span>,
    },
    {
      title: <HeaderTitle>{t("room.active_classes")}</HeaderTitle>,
      dataIndex: "active_classes_count",
      key: "active_classes_count",
      width: 120,
      align: "center" as const,
      render: (value: any) => value ?? 0,
    },
    {
      title: <HeaderTitle>{t("room.status")}</HeaderTitle>,
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center" as const,
      render: (status: RoomStatus) => {
        const badge = STATUS_BADGE[status] ?? STATUS_BADGE.inactive;
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
            style={badge}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: badge.color }}
            />
            {status ? t(`room.status_${status}`) : "—"}
          </span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("room.created_at")}</HeaderTitle>,
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      align: "center" as const,
      render: (value: string) =>
        value ? (
          new Date(value).toLocaleDateString("vi-VN")
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: IRoom) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams((prev: any) => {
      const prevPerPage = Number(prev?.per_page || 20);
      const isPageSizeChanged = pageSize !== prevPerPage;
      return {
        ...prev,
        page: isPageSizeChanged ? 1 : page,
        per_page: pageSize,
      };
    });
  };

  const tableData = data?.data?.items ?? [];

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
        <TableTera
          rowKey="id"
          columns={columns}
          data={tableData}
          scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
          loading={isPending || isUpdating}
          pagination={false}
        />
        <Pagination
          total={totalItems}
          current={currentPage}
          pageSize={perPage}
          onChange={handleChangePage}
          pageSizeOptions={[20, 50, 100]}
        />
      </div>

      <Modal
        title={`${t("room.suspend_title")}: ${pendingSuspend?.room_name ?? ""}`}
        open={!!pendingSuspend}
        onCancel={() => setPendingSuspend(null)}
        closeIcon={false}
        centered
        width={isMobile ? "92%" : 500}
        className="max-w-[500px]!"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingSuspend(null)}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {t("button.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmSuspend}
              disabled={!reason.trim() || isUpdating}
              className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? t("common.processing") : t("button.save")}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("room.suspend_reason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("room.suspend_reason_placeholder")}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
          />
        </div>
      </Modal>
    </>
  );
};

export default RoomTable;
