import { useEffect, useRef, useState } from "react";
import startUpIdea from "@tera/themes/images/uiNew/start_up_idea.png";
import customTwMerge from "tailwind-merge.config";
import { formatNumber } from "tera-dls";
import ChartBar, { ChartBarProps } from "@tera/components/dof/Chart/ChartBar";

export type HorizontalBarChartType = "small" | "large";
interface IData {
  labels: Array<string>;
  datasets: any;
}

interface IProps {
  data: IData;
  type?: HorizontalBarChartType;
  options?: ChartBarProps["options"];
  chartClassName?: string;
  defaultShowTickLength?: number;
  defaultLabelMaxLength?: number;
  defaultTooltipMaxLength?: number;
  wrapperClassName?: string;
  containerClassName?: string;
  maxY?: number;
  labelColor?: string;
  disableLabel?: boolean;
  intersect?: boolean;
  displayLegend?: boolean;
  yPosition?: "left" | "right";
}

const HorizontalBarChart = (props: IProps) => {
  const {
    type = "small",
    data,
    chartClassName,
    options,
    defaultShowTickLength = 30,
    defaultLabelMaxLength = 30,
    defaultTooltipMaxLength = 30,
    wrapperClassName = "",
    containerClassName = "",
    labelColor = "#3F83F8",
    maxY,
    disableLabel = false,
    intersect = false,
    displayLegend = false,
    yPosition = "left",
  } = props;
  const { labels } = data ?? {};
  const chartRef = useRef<any>(null);

  maxY;
  const isSmallType = type === "small";

  const displayTick = isSmallType
    ? labels?.length <= defaultShowTickLength
    : true;

  const maxValue = Math.max(...data?.datasets?.[0]?.data);
  const buffer = maxValue / 5;
  const newMaxValue = maxValue + (buffer < 1 ? 1 : buffer);
  newMaxValue;
  const [maxValueY, setMaxValueY] = useState<any>(maxValue ?? 0);
  const isNoData = data?.labels?.length == 0;

  useEffect(() => {
    const ticks = chartRef?.current?.scales?.y?.ticks;
    const endValue = chartRef?.current?.scales?.y?.end;
    const maxValue = chartRef?.current?.scales?.y?.max;

    if (ticks) {
      const stepValue = ticks[1]?.value;
      if (
        stepValue > 0 &&
        Number(maxValue) + Number(stepValue) > Number(endValue)
      ) {
        setMaxValueY(Number(stepValue));
      }
    }
  }, [chartRef?.current?.scales?.y]);

  const mainOptions: any = {
    responsive: true,
    position: "right",

    plugins: {
      legend: {
        display: displayLegend,
        position: "bottom",
      },
      tooltip: {
        intersect,
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
      datalabels: {
        display: displayTick,
        color: labelColor,
        formatter: (val, context) => {
          if (val !== null && typeof val === "object") {
            return formatNumber(
              val?.[context?.dataset?.parsing?.yAxisKey] || 0,
            );
          }
          return formatNumber(val);
        },
        anchor: "end",
        align: "end",
      },
    },
    scales: {
      x: {
        ticks: {
          display: displayTick,
          maxRotation: 45,
          minRotation: 0,
          callback: (_, index) => {
            const label = labels[index];
            return label?.length > defaultLabelMaxLength
              ? label?.substring(0, defaultLabelMaxLength) + "..."
              : label;
          },
        },
        beginAtZero: true,
      },
      y: {
        position: yPosition,
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

  const renderChart = () => {
    if (isNoData) {
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
    }

    return (
      <ChartBar
        id={"chart-Test"}
        ref={chartRef}
        className={chartClassName}
        data={data}
        options={mainOptions}
        plugins={disableLabel ? [] : ["data-labels"]}
      />
    );
  };
  return (
    <>
      <div className={customTwMerge("w-full h-full ", containerClassName)}>
        {isSmallType ? (
          <div className={customTwMerge("w-full h-full", wrapperClassName)}>
            {renderChart()}
            {!displayTick && <div className="invisible">label</div>}
          </div>
        ) : (
          <>
            <div className={customTwMerge("h-full", wrapperClassName)}>
              {renderChart()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HorizontalBarChart;
