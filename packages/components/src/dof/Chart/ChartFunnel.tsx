import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { CategoryScale, Chart as ChartJS, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ChartProps } from 'react-chartjs-2';

/**
 * @see https://github.com/sgratzl/chartjs-chart-funnel
 */
export type Plugins = "data-labels";

ChartJS.register(
  FunnelController,
  TrapezoidElement,
  LinearScale,
  CategoryScale,
);
export type ChartFunnelProps = Omit<
  ChartProps<'funnel'>,
  'type' | 'plugins'
> & {
  plugins?: Plugins[];
};
const ChartFunnel = (props: ChartFunnelProps) => {
  const { plugins = [], ...restProps } = props;
  const listPlugin: Record<Plugins, any> = {
    'data-labels': ChartDataLabels,
  };

  const mappedPlugins: any[] = plugins.map((plugin) => listPlugin[plugin]);
  return <Chart type="funnel" plugins={mappedPlugins} {...restProps} />;
};

export default ChartFunnel;
