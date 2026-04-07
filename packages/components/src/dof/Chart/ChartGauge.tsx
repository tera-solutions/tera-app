import { Chart as ChartJS } from "chart.js";
import { GaugeController } from "chartjs-gauge-v3";
import { Chart, ChartProps } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";

export type Plugins = "data-labels";

ChartJS.register(GaugeController);
export type ChartGaugeProps = Omit<ChartProps<"gauge">, "type" | "plugins"> & {
  plugins?: Plugins[];
};

const ChartGauge = ({ plugins = [], ...restProps }: ChartGaugeProps) => {
  const listPlugin: Record<Plugins, any> = {
    "data-labels": ChartDataLabels,
  };
  const mappedPlugins: any[] = plugins.map((plugin) => listPlugin[plugin]);

  return <Chart type="gauge" plugins={mappedPlugins} {...restProps} />;
};

export default ChartGauge;
