import { ChartBarOutlined } from "tera-dls";
import { ReactNode } from "react";
import { ChartDoughnut } from "@tera/components/dof/Chart";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

export interface DonutLegendItem {
  key: string | number;
  label: string;
  color: string;
  /** Drives the donut segment's proportion. */
  value: number;
  /** Text shown in the legend row; defaults to `value`. */
  displayValue?: string;
}

interface DonutStatsCardProps {
  title: string;
  legend: DonutLegendItem[];
  /** Text shown in the middle of the donut, e.g. `"85%"` or `"24"`. */
  centerValue: string;
  /** Small caption under the donut, e.g. the primary segment's label. */
  centerCaption?: string;
  size?: number;
  loading?: boolean;
  className?: string;
  /** Extra content rendered under the legend (e.g. a stat not part of the donut breakdown). */
  footer?: ReactNode;
  /** Hide the colored legend rows below the donut (e.g. a single-rate donut with nothing to list). Defaults to `true`. */
  showLegendList?: boolean;
}

const DonutStatsCard = ({
  title,
  legend,
  centerValue,
  centerCaption,
  size = 120,
  loading,
  className,
  footer,
  showLegendList = true,
}: DonutStatsCardProps) => (
  <Card className={className}>
    <div className="flex items-center gap-2 mb-3">
      <i className="flex h-5 w-5 items-center justify-center text-brand [&_svg]:h-5 [&_svg]:w-5">
        <ChartBarOutlined />
      </i>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
    </div>
    <WidgetState isLoading={loading}>
      <div className="flex flex-col items-center gap-2 py-2">
        <div style={{ width: size, height: size }}>
          <ChartDoughnut
            labelCenter={centerValue}
            data={{
              labels: legend.map((item) => item.label),
              datasets: [
                {
                  data: legend.map((item) => item.value),
                  backgroundColor: legend.map((item) => item.color),
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              cutout: "72%",
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        {centerCaption && (
          <p className="text-xs text-slate-400">{centerCaption}</p>
        )}
      </div>

      {showLegendList && (
        <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
          {legend.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-slate-500">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <span className="font-semibold text-slate-700">
                {item.displayValue ?? item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {footer}
    </WidgetState>
  </Card>
);

export default DonutStatsCard;
