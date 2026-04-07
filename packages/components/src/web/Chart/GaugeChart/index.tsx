import { useMemo } from "react";
import ChartGauge from "@tera/components/dof/Chart/ChartGauge";

interface IProps {
  subArcs?: any;
  options?: any;
}
const GaugeChartCustom = (props: IProps) => {
  const {
    subArcs = {
      datasets: [
        {
          value: 50,
          minValue: 0,
          data: [50, 70, 90, 100],
          backgroundColor: ["green", "yellow", "orange", "red"],
        },
      ],
    },
    options = {
      cutout: "80%",
      rotation: -150,
      circumference: 300,
      aspectRatio: 1,
      needle: {
        // Needle circle radius as the percentage of the chart area width
        radius: "10%",
        // Needle width as the percentage of the chart area width
        width: "10%",
        // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
        length: "50%",
        // The color of the needle
        color: "rgba(0, 0, 0, 1)",
      },
      valueLabel: {
        display: false,
      },
    },
  } = props;

  const renderLegends = useMemo(
    () =>
      subArcs
        ?.filter((item) => item.showTick)
        ?.map((item) => (
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: item.color ?? "#EA4228" }}
              className="rounded-full w-[10px] h-[10px]"
            />{" "}
            <span className="text-[13px]">{item.tooltip?.text ?? ""}</span>
          </div>
        )),
    [subArcs],
  );

  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <ChartGauge
        type="radial"
        pointer={{
          color: "red",
          length: 0.8,
          width: 15,
          elastic: true,
          type: "needle",
        }}
        labels={{
          valueLabel: { hide: true },
        }}
        value={1800}
        minValue={0}
        maxValue={2900}
        {...options}
        arc={{
          width: 0.1,
          padding: 0.01,
          cornerRadius: 1,
          subArcs: subArcs,
        }}
      />
      <div className="flex gap-x-10 gap-y-2.5 flex-wrap">{renderLegends}</div>
    </div>
  );
};

export default GaugeChartCustom;
