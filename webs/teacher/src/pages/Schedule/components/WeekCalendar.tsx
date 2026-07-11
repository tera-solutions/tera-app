import { useEffect, useRef } from "react";
import moment from "moment";
import classNames from "classnames";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";

import { WEEKDAY_FULL } from "../constants";
import { toFullCalendarEvents, type ScheduleEventInput } from "../_utils";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

import "./fc-overrides.css";

interface WeekCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
}

const WeekCalendar = ({
  currentDate,
  schedules,
  onSelect,
}: WeekCalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const events = toFullCalendarEvents(schedules);
  const focused = currentDate.format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(currentDate.toDate());
  }, [currentDate]);

  return (
    <div className="fc-tera">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        initialDate={currentDate.toDate()}
        headerToolbar={false}
        firstDay={1}
        height={680}
        events={events}
        allDaySlot={false}
        nowIndicator
        slotMinTime="06:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        dayHeaderContent={({ date }: { date: Date }) => {
          const dateKey = moment(date).format("YYYY-MM-DD");
          const isFocused = dateKey === focused;
          const isToday = dateKey === today;
          return (
            <div className={classNames("py-1", isFocused && "-mx-2 rounded bg-brand px-2")}>
              <p
                className={classNames(
                  "text-xs font-medium",
                  isFocused ? "text-white" : isToday ? "text-brand" : "text-slate-600",
                )}
              >
                {WEEKDAY_FULL[moment(date).isoWeekday() - 1]}
              </p>
              <p
                className={classNames(
                  "text-[11px]",
                  isFocused ? "text-white/90" : "text-slate-400",
                )}
              >
                {moment(date).format("DD/MM")}
              </p>
            </div>
          );
        }}
        eventClick={(arg: EventClickArg) =>
          onSelect((arg.event.extendedProps as ScheduleEventInput["extendedProps"]).item)
        }
        eventContent={({ event }: { event: { extendedProps: ScheduleEventInput["extendedProps"] } }) => (
          <ScheduleBlock item={event.extendedProps.item} onClick={onSelect} />
        )}
      />
    </div>
  );
};

export default WeekCalendar;
