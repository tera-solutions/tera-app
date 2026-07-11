import { useEffect, useRef } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";
import viLocale from "@fullcalendar/core/locales/vi";

import { toFullCalendarEvents, type ScheduleEventInput } from "../_utils";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

import "./fc-overrides.css";

interface DayCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
}

const DayCalendar = ({ currentDate, schedules, onSelect }: DayCalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const events = toFullCalendarEvents(schedules);

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(currentDate.toDate());
  }, [currentDate]);

  return (
    <div className="fc-tera">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridDay"
        initialDate={currentDate.toDate()}
        headerToolbar={false}
        locale={viLocale}
        height={680}
        events={events}
        allDaySlot={false}
        nowIndicator
        slotMinTime="06:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
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

export default DayCalendar;
