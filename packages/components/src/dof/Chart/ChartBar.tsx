import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { forwardRef } from "react";
import { Bar, ChartProps } from "react-chartjs-2";
import { Options } from "chartjs-plugin-datalabels/types/options";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export type Plugins = "data-labels";

export type ChartBarProps = Omit<
  ChartProps<"bar">,
  "type" | "plugins" | "options"
> & {
  plugins?: Plugins[];
  options?: ChartOptions<"bar"> & Options;
  ref?: React.Ref<any>;
};

const ChartBar = forwardRef<ChartJS<"bar">, ChartBarProps>(
  (props: ChartBarProps) => {
    const { plugins = [], ref, ...restProps } = props;
    const listPlugin: Record<Plugins, any> = {
      "data-labels": ChartDataLabels,
    };

    const mappedPlugins = plugins.map((plugin) => listPlugin[plugin]);

    return <Bar ref={ref} plugins={mappedPlugins} {...restProps} />;
  },
);

export default ChartBar;
