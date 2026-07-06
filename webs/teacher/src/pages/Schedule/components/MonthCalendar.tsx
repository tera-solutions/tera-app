import { useEffect, useRef } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateClickArg } from "@fullcalendar/core";

import { WEEKDAY_LABELS } from "../constants";
import { toFullCalendarEvents, type ScheduleEventInput } from "../_utils";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

import "./fc-overrides.css";

interface MonthCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
  onSelectDay: (date: moment.Moment) => void;
}

const MonthCalendar = ({
  currentDate,
  schedules,
  onSelect,
  onSelectDay,
}: MonthCalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const events = toFullCalendarEvents(schedules);

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(currentDate.toDate());
  }, [currentDate]);

  return (
    <div className="fc-tera">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={currentDate.toDate()}
        headerToolbar={false}
        firstDay={1}
        height={680}
        events={events}
        dayMaxEvents={3}
        dayHeaderContent={({ date }) => (
          <span className="text-xs font-medium text-slate-600">
            {WEEKDAY_LABELS[moment(date).isoWeekday() - 1]}
          </span>
        )}
        dateClick={(arg: DateClickArg) => onSelectDay(moment(arg.date))}
        eventClick={(arg: EventClickArg) =>
          onSelect((arg.event.extendedProps as ScheduleEventInput["extendedProps"]).item)
        }
        eventContent={({ event }: { event: { extendedProps: ScheduleEventInput["extendedProps"] } }) => (
          <ScheduleBlock item={event.extendedProps.item} onClick={onSelect} compact />
        )}
      />
    </div>
  );
};

export default MonthCalendar;
