import moment from "moment";
import type { EventInput } from "@fullcalendar/core";

import { toScheduleStatus, toTime } from "_common/utils/schedule";
import type { ScheduleStatus } from "_common/types/schedule";

import type { ScheduleItem } from "./_interface";

export interface ScheduleEventInput extends EventInput {
  extendedProps: { item: ScheduleItem };
}

/** Map schedule items to FullCalendar events (local date/time, no timezone conversion). */
export const toFullCalendarEvents = (schedules: ScheduleItem[]): ScheduleEventInput[] =>
  schedules.map((item) => ({
    id: String(item.id),
    title: item.class_name,
    start: moment(`${item.date} ${item.start_time}`, "YYYY-MM-DD HH:mm").toDate(),
    end: moment(`${item.date} ${item.end_time}`, "YYYY-MM-DD HH:mm").toDate(),
    extendedProps: { item },
  }));

export interface SessionDetail {
  id: number;
  class_id: number;
  class_name: string;
  session_name: string;
  session_no: number | null;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  teacher_name: string;
  status: ScheduleStatus;
}

/** Map `/edu/class-session/detail/:id` (nested) to the drawer's view model. */
export const toSessionDetail = (res: any): SessionDetail | null => {
  const d = res?.data;
  if (!d) return null;
  return {
    id: d.id ?? 0,
    class_id: d.class_id ?? d.class?.id ?? 0,
    class_name: d.class?.name ?? "",
    session_name: d.name ?? "",
    session_no: d.session_no ?? null,
    date: d.session_date ?? "",
    start_time: toTime(d.start_time),
    end_time: toTime(d.end_time),
    room: d.room?.room_name ?? "",
    teacher_name: d.teacher?.full_name ?? "",
    status: toScheduleStatus(d.status),
  };
};

export const computeMonthStats = (schedules: ScheduleItem[]) => ({
  total: schedules.length,
  completed: schedules.filter((item) => item.status === "done").length,
});
