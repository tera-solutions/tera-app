import moment from "moment";

export const convertDateToTime = (key: string) => {
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
  return object[key] ?? [];
};

export const convertTimeToDate = (values) => {
  const startDate = values[0].clone();
  const endDate = values[1].clone();

  const periods = [
    {
      condition:
        startDate.isSame(moment().startOf("week"), "day") &&
        endDate.isSame(moment().endOf("week"), "day"),
      value: "currentWeek",
    },
    {
      condition:
        startDate.isSame(moment().subtract(1, "week").startOf("week"), "day") &&
        endDate.isSame(moment().subtract(1, "week").endOf("week"), "day"),
      value: "lastWeek",
    },
    {
      condition:
        startDate.isSame(moment().startOf("month"), "day") &&
        endDate.isSame(moment().endOf("month"), "day"),
      value: "currentMonth",
    },
    {
      condition:
        startDate.isSame(
          moment().subtract(1, "month").startOf("month"),
          "day",
        ) &&
        endDate.isSame(moment().subtract(1, "month").endOf("month"), "day"),
      value: "lastMonth",
    },
    {
      condition:
        startDate.isSame(moment().month(0).startOf("month"), "day") &&
        endDate.isSame(moment().month(0).endOf("month"), "day"),
      value: "january",
    },
    {
      condition:
        startDate.isSame(moment().month(1).startOf("month"), "day") &&
        endDate.isSame(moment().month(1).endOf("month"), "day"),
      value: "february",
    },
    {
      condition:
        startDate.isSame(moment().month(2).startOf("month"), "day") &&
        endDate.isSame(moment().month(2).endOf("month"), "day"),
      value: "march",
    },
    {
      condition:
        startDate.isSame(moment().month(3).startOf("month"), "day") &&
        endDate.isSame(moment().month(3).endOf("month"), "day"),
      value: "april",
    },
    {
      condition:
        startDate.isSame(moment().month(4).startOf("month"), "day") &&
        endDate.isSame(moment().month(4).endOf("month"), "day"),
      value: "may",
    },
    {
      condition:
        startDate.isSame(moment().month(5).startOf("month"), "day") &&
        endDate.isSame(moment().month(5).endOf("month"), "day"),
      value: "june",
    },
    {
      condition:
        startDate.isSame(moment().month(6).startOf("month"), "day") &&
        endDate.isSame(moment().month(6).endOf("month"), "day"),
      value: "july",
    },
    {
      condition:
        startDate.isSame(moment().month(7).startOf("month"), "day") &&
        endDate.isSame(moment().month(7).endOf("month"), "day"),
      value: "august",
    },
    {
      condition:
        startDate.isSame(moment().month(8).startOf("month"), "day") &&
        endDate.isSame(moment().month(8).endOf("month"), "day"),
      value: "september",
    },
    {
      condition:
        startDate.isSame(moment().month(9).startOf("month"), "day") &&
        endDate.isSame(moment().month(9).endOf("month"), "day"),
      value: "october",
    },
    {
      condition:
        startDate.isSame(moment().month(10).startOf("month"), "day") &&
        endDate.isSame(moment().month(10).endOf("month"), "day"),
      value: "november",
    },
    {
      condition:
        startDate.isSame(moment().month(11).startOf("month"), "day") &&
        endDate.isSame(moment().month(11).endOf("month"), "day"),
      value: "december",
    },
    {
      condition:
        startDate.isSame(moment().startOf("quarter"), "day") &&
        endDate.isSame(moment().endOf("quarter"), "day"),
      value: "currentQuarter",
    },
    {
      condition:
        startDate.isSame(
          moment().subtract(1, "quarter").startOf("quarter"),
          "day",
        ) &&
        endDate.isSame(moment().subtract(1, "quarter").endOf("quarter"), "day"),
      value: "lastQuarter",
    },
    {
      condition:
        startDate.isSame(moment().month(0).startOf("quarter"), "day") &&
        endDate.isSame(moment().month(0).endOf("quarter"), "day"),
      value: "quarterOne",
    },
    {
      condition:
        startDate.isSame(moment().month(3).startOf("quarter"), "day") &&
        endDate.isSame(moment().month(3).endOf("quarter"), "day"),
      value: "quarterTwo",
    },
    {
      condition:
        startDate.isSame(moment().month(6).startOf("quarter"), "day") &&
        endDate.isSame(moment().month(6).endOf("quarter"), "day"),
      value: "quarterThree",
    },
    {
      condition:
        startDate.isSame(moment().month(9).startOf("quarter"), "day") &&
        endDate.isSame(moment().month(9).endOf("quarter"), "day"),
      value: "quarterFour",
    },
    {
      condition:
        startDate.isSame(moment().startOf("year"), "day") &&
        endDate.isSame(moment().endOf("year"), "day"),
      value: "currentYear",
    },
    {
      condition:
        startDate.isSame(moment().subtract(1, "year").startOf("year"), "day") &&
        endDate.isSame(moment().subtract(1, "year").endOf("year"), "day"),
      value: "lastYear",
    },
    {
      condition:
        startDate.isSame(moment().month(0).startOf("month"), "day") &&
        endDate.isSame(moment().month(5).endOf("month"), "day"),
      value: "firstSixMonthOfYear",
    },
    {
      condition:
        startDate.isSame(moment().month(6).startOf("month"), "day") &&
        endDate.isSame(moment().month(11).endOf("month"), "day"),
      value: "secondSixMonthOfYear",
    },
  ];
  for (const period of periods) {
    if (period.condition) return period.value;
  }
  return "custom";
};
