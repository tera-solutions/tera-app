import { useTranslation } from "react-i18next";

import { ClassStatus } from "_common/services/student/_interface";

/** Màu badge theo mockup: hôm nay xanh lá, đang học đỏ, sắp tới cam, hoàn thành xanh lá */
const STYLES: Record<ClassStatus, string> = {
  // Sắc chữ đậm hơn một bậc so với mockup để đạt tương phản 4.5:1 trên nền badge
  // (bản gốc emerald-600 / rose-500 / amber-600 chỉ được 3.1–3.5).
  today: "bg-emerald-50 text-emerald-700",
  studying: "bg-rose-50 text-rose-700",
  upcoming: "bg-amber-50 text-amber-800",
  completed: "bg-emerald-50 text-emerald-700",
};

const LABEL_KEYS: Record<ClassStatus, string> = {
  today: "classes.status_today",
  studying: "classes.status_studying",
  upcoming: "classes.status_upcoming",
  completed: "classes.status_completed",
};

const ClassStatusBadge = ({
  status,
  className = "",
}: {
  status: ClassStatus;
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-sm font-semibold ${STYLES[status]} ${className}`}
    >
      {t(LABEL_KEYS[status])}
    </span>
  );
};

export default ClassStatusBadge;
