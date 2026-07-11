import { useEffect, useRef } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg } from "@fullcalendar/core";
import viLocale from "@fullcalendar/core/locales/vi";

import { toFullCalendarEvents, type ScheduleEventInput } from "../_utils";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

import "./fc-overrides.css";

interface ListCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
}

const ListCalendar = ({ currentDate, schedules, onSelect }: ListCalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const events = toFullCalendarEvents(schedules);

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(currentDate.toDate());
  }, [currentDate]);

  return (
    <div className="fc-tera">
      <FullCalendar
        ref={calendarRef}
        plugins={[listPlugin]}
        initialView="listWeek"
        initialDate={currentDate.toDate()}
        headerToolbar={false}
        locale={viLocale}
        height={680}
        events={events}
        noEventsText="Không có lịch dạy trong tuần"
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

export default ListCalendar;
