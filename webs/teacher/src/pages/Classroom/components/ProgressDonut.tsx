import { ChartDoughnut } from "@tera/components/dof/Chart";

import { getDonutColor } from "../constants";

interface ProgressDonutProps {
  value: number;
  size?: number;
  label?: string;
}

const TRACK_COLOR = "#e2e8f0";

const ProgressDonut = ({ value, size = 56, label }: ProgressDonutProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  const color = getDonutColor(clamped);

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size }}>
        <ChartDoughnut
          labelCenter={`${clamped}%`}
          data={{
            labels: ["Đạt", "Còn lại"],
            datasets: [
              {
                data: [clamped, 100 - clamped],
                backgroundColor: [color, TRACK_COLOR],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            cutout: "72%",
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />
      </div>
      {label && <span className="text-[11px] text-slate-400">{label}</span>}
    </div>
  );
};

export default ProgressDonut;
