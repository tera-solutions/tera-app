/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/* Import: pages */
import { IRoom } from "pages/education/room/_interface";

// room_status KHÔNG có trong metadata → màu badge hardcode cục bộ (khớp RoomTable)
const STATUS_BADGE: Record<string, { color: string; backgroundColor: string }> =
  {
    active: { color: "#16a34a", backgroundColor: "#dcfce7" },
    inactive: { color: "#6b7280", backgroundColor: "#f3f4f6" },
    maintenance: { color: "#d97706", backgroundColor: "#fef3c7" },
  };

const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">
      {value === undefined || value === null || value === "" ? "—" : value}
    </span>
  </div>
);

const RoomDetailContent = ({ room }: { room?: IRoom }) => {
  const { t } = useTranslation();

  const badge = room?.status
    ? (STATUS_BADGE[room.status] ?? STATUS_BADGE.inactive)
    : null;

  return (
    <div className="divide-y divide-gray-100">
      <InfoRow label={t("room.name")} value={room?.room_name} />
      <InfoRow label={t("room.code")} value={room?.room_code} />
      <InfoRow label={t("room.branch")} value={room?.branch?.name} />
      <InfoRow
        label={t("room.type")}
        value={room?.room_type ? t(`room.type_${room.room_type}`) : undefined}
      />
      <InfoRow label={t("room.floor")} value={room?.floor} />
      <InfoRow label={t("room.capacity")} value={room?.capacity} />
      <InfoRow
        label={t("room.active_classes")}
        value={room?.active_classes_count ?? 0}
      />
      <InfoRow
        label={t("room.status")}
        value={
          badge && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
              style={badge}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: badge.color }}
              />
              {t(`room.status_${room?.status}`)}
            </span>
          )
        }
      />
      <InfoRow label={t("room.description")} value={room?.description} />
      <InfoRow
        label={t("room.created_at")}
        value={
          room?.created_at
            ? new Date(room.created_at).toLocaleDateString("vi-VN")
            : undefined
        }
      />
    </div>
  );
};

export default RoomDetailContent;
