import { useMemo } from "react";
import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import { DashboardService } from "@tera/modules";

import { toScheduleItems } from "_common/utils/schedule";
import { MOCK_NOTIFICATIONS } from "pages/Notifications/_mock";
import { toNotification } from "./_utils";
import type { DashboardSummary, DashboardWeekDay } from "./_interface";

const toWeekDay = (raw: any): DashboardWeekDay => ({
  date: raw?.date ?? "",
  count: raw?.count ?? 0,
  completed: raw?.completed ?? 0,
});

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
      schedule_week: (d.schedule_week ?? []).map(toWeekDay),
      homework_pending: d.homework_pending ?? [],
      lesson_plans: d.lesson_plans ?? [],
      my_classes: d.my_classes ?? [],
      attendance: d.attendance ?? null,
    };
  }, [query.data]);
  return { ...query, data };
};

/**
 * Sources from the same mock dataset as `pages/Notifications` (task 032 has
 * no working notification backend yet — see that page's `_mock.ts`), so the
 * dashboard preview and the full notifications page always agree.
 */
export const useDashboardNotifications = () =>
  useQueryLegacy({
    queryKey: DASHBOARD_KEYS.notifications,
    queryFn: () => {
      const items = [...MOCK_NOTIFICATIONS]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 5)
        .map(toNotification);
      return Promise.resolve({
        data: items,
        unread_count: items.filter((item) => !item.is_read).length,
      });
    },
  });
