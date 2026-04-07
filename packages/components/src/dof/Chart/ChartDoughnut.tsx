import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Options } from "chartjs-plugin-datalabels/types/options";
import { forwardRef, useEffect } from "react";
import { ChartProps, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

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

    useEffect(() => {
      if (!labelCenter) return;
      const centerNumberPlugin = {
        id: "centerNumber",
        beforeDraw: function (chart) {
          const width = chart.chartArea?.width;
          const height = chart.chartArea?.height;
          const ctx = chart?.ctx;

          ctx?.restore();
          const fontSize = (height / 150).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.fontWeight = 100;

          const text = labelCenter;
          const textX = Math.round((width - ctx?.measureText(text).width) / 2);
          const textY = height / 2;

          ctx?.fillText(text, textX, textY);
          ctx?.save();
        },
      };

      Chart.register(centerNumberPlugin);

      return () => {
        Chart.unregister(centerNumberPlugin);
      };
    }, [labelCenter]);

    return <Doughnut plugins={mappedPlugins} ref={ref} {...restProps} />;
  },
);

export default ChartDoughnut;
