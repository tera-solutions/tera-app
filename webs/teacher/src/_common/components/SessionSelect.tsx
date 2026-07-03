import { ClassSessionService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface SessionSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Sessions are listed under a nested class route — required to fetch anything. */
  classId?: number | string | null;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (session: any): SelectOption => ({
  value: session.id,
  label: `${session.name || `Buổi ${session.session_no ?? ""}`} — ${session.session_date}`,
});

/** Searchable session picker, scoped to a classroom. */
const SessionSelect = ({
  value,
  onChange,
  placeholder = "Chọn buổi học",
  disabled,
  allowClear,
  className,
  classId,
  selectedOption,
}: SessionSelectProps) => {
  // `/edu/class-room/:class_id/session/list` is nested under the class, so
  // `class_id` must land at the top level of `params` — not under `filters`,
  // the shape `useAsyncSelectOptions` normally passes custom filters in.
  // This wrapper reshapes the payload before calling the real list hook.
  const useSessionList = (payload: { params: Record<string, unknown> }) => {
    const { filters, ...rest } = payload.params;
    return ClassSessionService.useClassSessionList(
      {
        params: {
          ...rest,
          class_id: classId ?? 0,
          sort_by: "session_date",
          sort_dir: "asc",
        },
      } as any,
      { enabled: !!classId },
    );
  };

  return (
    <AsyncSearchSelect
      value={value}
      onChange={onChange}
      useList={useSessionList}
      toOption={toOption}
      placeholder={placeholder}
      disabled={disabled || !classId}
      allowClear={allowClear}
      className={className}
      selectedOption={selectedOption}
    />
  );
};

export default SessionSelect;
