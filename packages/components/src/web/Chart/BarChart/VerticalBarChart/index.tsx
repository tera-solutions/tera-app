import { useEffect, useRef, useState } from "react";
import startUpIdea from "@tera/themes/images/uiNew/start_up_idea.png";
import customTwMerge from "tailwind-merge.config";
import { formatNumber } from "tera-dls";
import ChartBar, { ChartBarProps } from "@tera/components/dof/Chart/ChartBar";

export type VerticalBarChartType = "small" | "large";
interface IData {
  labels: Array<string>;
  datasets: any;
}

interface IProps {
  data: IData;
  type?: VerticalBarChartType;
  options?: ChartBarProps["options"];
  chartClassName?: string;
  defaultShowTickLength?: number;
  defaultLabelMaxLength?: number;
  defaultTooltipMaxLength?: number;
  wrapperClassName?: string;
  containerClassName?: string;
  minNumber?: number;
  maxNumber?: number;
}

const VerticalBarChart = (props: IProps) => {
  const {
    type = "small",
    data,
    chartClassName,
    options,
    defaultShowTickLength = 8,
    defaultLabelMaxLength = 15,
    defaultTooltipMaxLength = 30,
    wrapperClassName = "",
    containerClassName = "",
    minNumber,
    maxNumber,
  } = props;
  const { labels } = data ?? {};
  const chartRef = useRef<any>(null);
  const isSmallType = type === "small";
  minNumber;
  const displayTick = isSmallType
    ? labels?.length <= defaultShowTickLength
    : true;

  const max =
    (maxNumber ?? labels?.length) - 1 < 0
      ? (maxNumber ?? labels?.length)
      : (maxNumber ?? labels?.length) - 1;

  const maxValue = Math.max(...data.datasets[0].data);
  const buffer = maxValue / 6;
  const newMaxValue = maxValue + (buffer < 1 ? 1 : buffer);

  const [maxValueY, setMaxValueY] = useState<any>(maxValue ?? 0);

  useEffect(() => {
    const ticks = chartRef?.current?.scales?.x?.ticks;
    const endValue = chartRef?.current?.scales?.x?.end;
    const maxValue = chartRef?.current?.scales?.x?.max;

    if (ticks) {
      const stepValue = ticks[1]?.value;
      if (
        stepValue > 0 &&
        Number(maxValue) + Number(stepValue) > Number(endValue)
      ) {
        setMaxValueY(Number(stepValue));
      }
    }
  }, [chartRef?.current?.scales?.x]);

  const optionsChart: any = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      tooltip: {
        intersect: false,
        ...(isSmallType && {
          callbacks: {
            intersect: false,
            title: (tooltipItems: any) => {
              const { label } = tooltipItems?.[0] ?? {};
              return label?.length > defaultTooltipMaxLength
                ? label.substring(0, defaultTooltipMaxLength) + "..."
                : label;
            },
          },
        }),
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: displayTick,
        color: "#3F83F8",
        formatter: (val) => formatNumber(val),
        anchor: "end",
        align: "end",
      },
    },
    scales: {
      y: {
        ticks: {
          display: displayTick,
          maxRotation: 45,
          minRotation: 0,
          callback: (_, index) => {
            const label = labels[index];
            return label?.length > defaultLabelMaxLength
              ? label.substring(0, defaultLabelMaxLength) + "..."
              : label;
          },
        },
        beginAtZero: true,
        // min: minNumber ?? 0,
        max,
      },
      x: {
        afterDataLimits(scale) {
          scale.max += maxValueY;
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          maxTicksLimit: 8,
        },
      },
    },
    maintainAspectRatio: false,
    ...options,
  };
  newMaxValue;
  const renderChart = () => {
    if (data?.labels?.length === 0)
      return (
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex flex-col gap-2.5 h-full justify-center items-center">
            <img src={startUpIdea} className="h-[209px] w-[290px]" />
            <p className="text-gray-400 font-normal text-center w-full ">
              Chưa có dữ liệu
            </p>
          </div>
        </div>
      );

    return (
      <ChartBar
        className={chartClassName}
        data={data}
        ref={chartRef}
        options={optionsChart}
        plugins={["data-labels"]}
      />
    );
  };
  return (
    <div
      className={customTwMerge(
        "w-full h-full overflow-x-auto",
        containerClassName,
      )}
    >
      {isSmallType ? (
        <div className={customTwMerge("w-full h-full", wrapperClassName)}>
          {renderChart()}
          {!displayTick && <div className="invisible">label</div>}
        </div>
      ) : (
        <div className={customTwMerge("h-full", wrapperClassName)}>
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default VerticalBarChart;
