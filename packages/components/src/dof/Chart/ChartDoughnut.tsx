import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Options } from "chartjs-plugin-datalabels/types/options";
import { forwardRef } from "react";
import { ChartProps, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
export type Plugins = "data-labels";

export type ChartDoughnutProps = Omit<
  ChartProps<"doughnut">,
  "type" | "plugins" | "options"
> & {
  labelCenter?: string;
  plugins?: Plugins[];
  options?: ChartOptions<"doughnut"> & Options;
};

const ChartDoughnut = forwardRef<ChartJS<"doughnut">, ChartDoughnutProps>(
  (props, ref) => {
    const { labelCenter, plugins = [], ...restProps } = props;
    const listPlugin: Record<Plugins, any> = {
      "data-labels": ChartDataLabels,
    };

    const mappedPlugins: any[] = plugins.map((plugin) => listPlugin[plugin]);

    // Passed via the `plugins` prop (not `Chart.register`) so it only applies to
    // THIS chart instance — a globally registered plugin would draw its last-set
    // `labelCenter` text onto every chart on the page, including unrelated bar/line
    // charts sharing the same underlying Chart.js registry.
    if (labelCenter) {
      mappedPlugins.push({
        id: "centerNumber",
        beforeDraw: function (chart) {
          const width = chart.chartArea?.width;
          const height = chart.chartArea?.height;
          const ctx = chart?.ctx;
          if (!ctx) return;

          ctx.save();
          const fontSize = (height / 150).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.fontWeight = 100;

          const text = labelCenter;
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.restore();
        },
      });
    }

    return <Doughnut plugins={mappedPlugins} ref={ref} {...restProps} />;
  },
);

export default ChartDoughnut;
