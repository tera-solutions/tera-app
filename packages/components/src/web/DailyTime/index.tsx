import { DATE_FORMAT } from "@tera/commons/constants/common";
import RangePicker from "@tera/components/dof/Control/RangePicker";
import Select from "@tera/components/dof/Control/Select";
import { FormTeraItem } from "@tera/components/dof/FormTera";
import { FILTER_TIME } from "./constants";
import moment from "moment";

interface IProps {
  form: any;
  timeKey?: string;
  dataKey?: string;
  timeFormProps?: any;
  timeInputProps?: any;
  dateFormProps?: any;
  dateInputProps?: any;
}
const DailyTime = (props: IProps) => {
  const {
    form,
    timeKey = "time",
    dataKey = "date",
    timeFormProps = {},
    timeInputProps = {},
    dateFormProps = {},
    dateInputProps = {},
  } = props;

  const handleChangeTime = (value) => {
    const currentDate = moment();
    const object = {
      currentWeek: [
        currentDate.clone().startOf("week"),
        currentDate.clone().endOf("week"),
      ],
      lastWeek: [
        currentDate.clone().subtract(1, "weeks").startOf("week"),
        currentDate.clone().subtract(1, "weeks").endOf("week"),
      ],
      currentMonth: [
        currentDate.clone().startOf("month"),
        currentDate.clone().endOf("month"),
      ],
      lastMonth: [
        currentDate.clone().subtract(1, "month").startOf("month"),
        currentDate.clone().subtract(1, "month").endOf("month"),
      ],
      january: [
        currentDate.clone().month(0).startOf("month"),
        currentDate.clone().month(0).endOf("month"),
      ],
      february: [
        currentDate.clone().month(1).startOf("month"),
        currentDate.clone().month(1).endOf("month"),
      ],
      march: [
        currentDate.clone().month(2).startOf("month"),
        currentDate.clone().month(2).endOf("month"),
      ],
      april: [
        currentDate.clone().month(3).startOf("month"),
        currentDate.clone().month(3).endOf("month"),
      ],
      may: [
        currentDate.clone().month(4).startOf("month"),
        currentDate.clone().month(4).endOf("month"),
      ],
      june: [
        currentDate.clone().month(5).startOf("month"),
        currentDate.clone().month(5).endOf("month"),
      ],
      july: [
        currentDate.clone().month(6).startOf("month"),
        currentDate.clone().month(6).endOf("month"),
      ],
      august: [
        currentDate.clone().month(7).startOf("month"),
        currentDate.clone().month(7).endOf("month"),
      ],
      september: [
        currentDate.clone().month(8).startOf("month"),
        currentDate.clone().month(8).endOf("month"),
      ],
      october: [
        currentDate.clone().month(9).startOf("month"),
        currentDate.clone().month(9).endOf("month"),
      ],
      november: [
        currentDate.clone().month(10).startOf("month"),
        currentDate.clone().month(10).endOf("month"),
      ],
      december: [
        currentDate.clone().month(11).startOf("month"),
        currentDate.clone().month(11).endOf("month"),
      ],
      currentQuarter: [
        currentDate.clone().startOf("quarter"),
        currentDate.clone().endOf("quarter"),
      ],
      lastQuarter: [
        currentDate.clone().subtract(1, "quarter").startOf("quarter"),
        currentDate.clone().subtract(1, "quarter").endOf("quarter"),
      ],
      quarterOne: [
        currentDate.clone().month(0).startOf("quarter"),
        currentDate.clone().month(0).endOf("quarter"),
      ],
      quarterTwo: [
        currentDate.clone().month(3).startOf("quarter"),
        currentDate.clone().month(3).endOf("quarter"),
      ],
      quarterThree: [
        currentDate.clone().month(6).startOf("quarter"),
        currentDate.clone().month(6).endOf("quarter"),
      ],
      quarterFour: [
        currentDate.clone().month(9).startOf("quarter"),
        currentDate.clone().month(9).endOf("quarter"),
      ],
      currentYear: [
        currentDate.clone().startOf("year"),
        currentDate.clone().endOf("year"),
      ],
      lastYear: [
        currentDate.clone().subtract(1, "year").startOf("year"),
        currentDate.clone().subtract(1, "year").endOf("year"),
      ],
      firstSixMonthOfYear: [
        currentDate.clone().month(0).startOf("month"),
        currentDate.clone().month(5).endOf("month"),
      ],
      secondSixMonthOfYear: [
        currentDate.clone().month(6).startOf("month"),
        currentDate.clone().month(11).endOf("month"),
      ],
    };

    form?.setValue(dataKey, object[value]);
  };

  const optionsTime = Object.entries(FILTER_TIME).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return (
    <>
      <FormTeraItem label="Thời gian" {...timeFormProps} name={timeKey}>
        <Select
          allowClear
          placeholder="Vui lòng chọn"
          {...timeInputProps}
          options={optionsTime}
          onSelect={handleChangeTime}
        />
      </FormTeraItem>
      <FormTeraItem
        {...dateFormProps}
        label="Từ ngày - đến ngày"
        name={dataKey}
      >
        <RangePicker format={DATE_FORMAT} {...dateInputProps} />
      </FormTeraItem>
    </>
  );
};

export default DailyTime;
