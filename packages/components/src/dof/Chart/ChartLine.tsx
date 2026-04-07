import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TimeScale,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartProps, Line } from "react-chartjs-2";
import { forwardRef } from "react";
import { Options } from "chartjs-plugin-datalabels/types/options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

export type Plugins = "data-labels";

export type ChartLineProps = Omit<
  ChartProps<"line">,
  "type" | "plugins" | "options"
> & {
  plugins?: Plugins[];
  options?: ChartOptions<"line"> & Options;
  ref?: React.Ref<any>;
};

const ChartLine = forwardRef<ChartJS<"line">, ChartLineProps>(
  (props: ChartLineProps) => {
    const { plugins = [], ref, ...restProps } = props;
    const listPlugin: Record<Plugins, any> = {
      "data-labels": ChartDataLabels,
    };
    const mappedPlugins = plugins.map((plugin) => listPlugin[plugin]);

    return <Line plugins={mappedPlugins} ref={ref} {...restProps} />;
  },
);

export default ChartLine;
