import colors from '@tera/commons/constants/colors';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const data = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Màu sắc của đường
      strokeWidth: 2, // độ dày của đường
    },
  ],
  legend: ['Lượng truy cập (K)'], // chú thích
};

const chartConfig = {
  backgroundColor: colors.white,
  backgroundGradientFrom: '#ffffffff',
  backgroundGradientTo: '#ffffffff',
  decimalPlaces: 0, // số thập phân hiển thị
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const SaleChart = () => (
  <View>
    <LineChart
      data={data}
      width={Dimensions.get('window').width - 20} // chiều rộng màn hình trừ lề
      height={220}
      chartConfig={chartConfig}
      bezier // làm cong đường biểu đồ
      style={{ marginVertical: 8, borderRadius: 16 }}
    />
  </View>
);

export default SaleChart;
