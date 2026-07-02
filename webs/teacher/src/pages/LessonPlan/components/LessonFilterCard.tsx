import moment from "moment";
import { RangePicker } from "tera-dls";

import { CARD } from "_common/constants/dashboard";

interface LessonFilterCardProps {
  range?: [moment.Moment, moment.Moment];
  onRangeChange: (range: [moment.Moment, moment.Moment]) => void;
  onRangeClear: () => void;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
    {children}
  </div>
);

const LessonFilterCard = ({
  range,
  onRangeChange,
  onRangeClear,
}: LessonFilterCardProps) => {
  return (
    <div className={`${CARD} flex flex-col gap-4 p-4`}>
      <p className="text-sm font-semibold text-slate-700">Bộ lọc</p>

      <Field label="Lọc theo ngày">
        <RangePicker
          value={range}
          allowClear={!!range}
          format="DD/MM/YYYY"
          onChange={(value) => {
            if (value?.[0] && value?.[1]) onRangeChange([value[0], value[1]]);
            else onRangeClear();
          }}
        />
        {range && (
          <button
            type="button"
            onClick={onRangeClear}
            className="mt-1.5 text-xs font-medium text-brand hover:underline"
          >
            Bỏ lọc khoảng ngày
          </button>
        )}
      </Field>
    </div>
  );
};

export default LessonFilterCard;
