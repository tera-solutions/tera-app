import colors from '@common/constants/colors';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// 1. Cấu hình Dữ liệu Doanh Thu (Không đổi)
const revenueData = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [
    {
      data: [40, 45, 46, 80, 99, 43, 105],
    },
  ],
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',

  color: (opacity = 1) => `rgba(166, 166, 166, ${opacity})`,

  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 0,

  // Màu đường kẻ trên trục X và Y
  fillShadowGradientFrom: colors.primaryLight,
  fillShadowGradientOpacity: 1,
  fillShadowGradientFromOffset: 1,
};

const SaleChart2 = () => {
  return (
    // ⚪ Đảm bảo nền của View bao ngoài cũng là màu trắng
    <View style={styles.container}>
      <BarChart
        style={styles.chart}
        data={revenueData}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        fromZero={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  chart: {
    marginVertical: 8,
    overflow: 'hidden',
  },
});

export default SaleChart2;
