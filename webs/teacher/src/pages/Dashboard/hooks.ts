import { useMemo } from "react";
import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import { DashboardService } from "@tera/modules";
import NotificationApi from "_common/components/Layout/Header/UserNotification/_api";

import { toScheduleItems } from "_common/utils/schedule";
import { toNotification } from "./_utils";
import type { DashboardSummary } from "./_interface";

export const DASHBOARD_KEYS = {
  notifications: ["teacher", "dashboard", "notifications"] as const,
};

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
      schedule_week: d.schedule_week ?? [],
      homework_pending: d.homework_pending ?? [],
      lesson_plans: d.lesson_plans ?? [],
      my_classes: d.my_classes ?? [],
      attendance: d.attendance ?? null,
    };
  }, [query.data]);
  return { ...query, data };
};

export const useDashboardNotifications = () =>
  useQueryLegacy({
    queryKey: DASHBOARD_KEYS.notifications,
    queryFn: () =>
      NotificationApi.getList({ page: 1, limit: 5 }).then((res: any) => {
        const items = (res?.data ?? res?.items ?? res ?? []).map(toNotification);
        return {
          data: items,
          unread_count: items.filter(
            (item: { is_read: boolean }) => !item.is_read,
          ).length,
        };
      }),
  });
