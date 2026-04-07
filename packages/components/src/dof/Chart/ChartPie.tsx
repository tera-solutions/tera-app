import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { ChartProps, Pie } from "react-chartjs-2";
import { forwardRef } from "react";
import { Options } from "chartjs-plugin-datalabels/types/options";

ChartJS.register(ArcElement, Tooltip, Legend);

export type Plugins = "data-labels";

export type ChartPieProps = Omit<
  ChartProps<"pie">,
  "type" | "plugins" | "options"
> & {
  plugins?: Plugins[];
  options?: ChartOptions<"pie"> & Options;
  ref?: React.Ref<any>;
};

const ChartPie = forwardRef<ChartJS<"pie">, ChartPieProps>(
  (props: ChartPieProps) => {
    const { plugins = [], ref, ...restProps } = props;
    const listPlugin: Record<Plugins, any> = {
      "data-labels": ChartDataLabels,
    };
    const mappedPlugins: any[] = plugins.map((plugin) => listPlugin[plugin]);

    return <Pie plugins={mappedPlugins} ref={ref} {...restProps} />;
  },
);

export default ChartPie;
