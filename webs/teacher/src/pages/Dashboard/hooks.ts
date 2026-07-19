import { useMemo } from "react";
import { DashboardService, NotificationService } from "@tera/modules";

import { toScheduleItems } from "_common/utils/schedule";
import { toNotification } from "./_utils";
import type { DashboardSummary, DashboardWeekDay } from "./_interface";

const toWeekDay = (raw: any): DashboardWeekDay => ({
  date: raw?.date ?? "",
  count: raw?.count ?? 0,
  completed: raw?.completed ?? 0,
});

const EMPTY_STATS = {
  students_enrolled: 0,
  active_classes: 0,
  lessons_today: 0,
  completion_rate: 0,
};

export const useDashboardSummary = () => {
  const query = DashboardService.useDashboardSummary();
  const data = useMemo<DashboardSummary | undefined>(() => {
    if (!query.data) return undefined;
    const d = query.data?.data ?? {};
    return {
      stats: { ...EMPTY_STATS, ...(d.stats ?? {}) },
      schedule_today: toScheduleItems(d.schedule_today),
      schedule_week: (d.schedule_week ?? []).map(toWeekDay),
      assignment_pending: d.homework_pending ?? [],
      lesson_plans: d.lesson_plans ?? [],
      my_classes: d.my_classes ?? [],
      attendance: d.attendance ?? null,
    };
  }, [query.data]);
  return { ...query, data };
};

/** Latest 5 notifications for the dashboard preview widget — same source as
 * the full `pages/Notifications` list (`sys_notification`). */
export const useDashboardNotifications = () => {
  const query = NotificationService.useNotificationList({ params: { per_page: 5 } });
  const data = useMemo(() => {
    const items = (query.data?.data?.items ?? []).map((raw: any) =>
      toNotification({ ...raw, is_read: raw.is_view }),
    );
    return {
      data: items,
      unread_count: items.filter((item) => !item.is_read).length,
    };
  }, [query.data]);
  return { ...query, data };
};
