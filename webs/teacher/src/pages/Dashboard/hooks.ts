import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import EduApi from "_common/api/edu";
import NotificationApi from "_common/components/Layout/Header/UserNotification/_api";

import { normalizeSessions } from "_common/normalize/schedule";
import {
  normalizeClass,
  normalizeHomework,
  normalizeLessonPlan,
  normalizeNotification,
} from "./normalize";
import type { DashboardSummary } from "./_interface";

export const DASHBOARD_KEYS = {
  summary: ["teacher", "dashboard", "summary"] as const,
  notifications: ["teacher", "dashboard", "notifications"] as const,
};

const EMPTY_STATS = {
  students_enrolled: 0,
  active_classes: 0,
  lessons_today: 0,
  completion_rate: 0,
};

/**
 * Whole dashboard in one request — `GET /v1/edu/dashboard/summary` (teacher-scoped).
 * Every widget calls this; React Query dedupes to a single fetch by the shared key.
 */
export const useDashboardSummary = () =>
  useQueryLegacy<DashboardSummary>({
    queryKey: DASHBOARD_KEYS.summary,
    queryFn: () =>
      EduApi.dashboardSummary().then((d) => ({
        stats: { ...EMPTY_STATS, ...(d?.stats ?? {}) },
        schedule_today: normalizeSessions(d?.schedule_today ?? []),
        schedule_week: d?.schedule_week ?? [],
        homework_pending: (d?.homework_pending ?? []).map(normalizeHomework),
        lesson_plans: (d?.lesson_plans ?? []).map(normalizeLessonPlan),
        my_classes: (d?.my_classes ?? []).map(normalizeClass),
        attendance: d?.attendance ?? null,
      })),
  });

export const useDashboardNotifications = () =>
  useQueryLegacy({
    queryKey: DASHBOARD_KEYS.notifications,
    queryFn: () =>
      NotificationApi.getList({ page: 1, limit: 5 }).then((res: any) => {
        const items = (res?.data ?? res?.items ?? res ?? []).map(
          normalizeNotification,
        );
        return {
          data: items,
          unread_count: items.filter(
            (item: { is_read: boolean }) => !item.is_read,
          ).length,
        };
      }),
  });
