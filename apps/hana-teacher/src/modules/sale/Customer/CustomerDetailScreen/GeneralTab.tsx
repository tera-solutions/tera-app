import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const MOCK_CUSTOMER = {
  name: 'Anh Cươnghf',
  phone: '0982131312',
  initials: 'AC',
  currentRevenue: 39000,
  deliveredOrders: 1,
  lastPurchaseDate: '07-12-2025',
};

const MOCK_TOP_PRODUCTS = [
  { name: 'Bánh mứt', quantity: 1, lastPurchase: '07/12' },
];

const MOCK_RECENT_ORDERS = [
  {
    code: 'HXEMSN',
    date: '00:21 07/12',
    status: 'Đã giao',
    totalItems: 1,
    totalPrice: 39000,
  },
];

const formatCurrency = (num: number) => {
  return num.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
};

// --- 2. Component Render Top Products ---
const RenderTopProducts = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Top 3 sản phẩm mua nhiều</Text>

    <View style={styles.productTable}>
      {/* Header Bảng */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.productCell, { flex: 3, textAlign: 'left' }]}>
          TÊN SẢN PHẨM
        </Text>
        <Text style={styles.productCell}>MUA</Text>
        <Text style={styles.productCell}>GẦN NHẤT</Text>
      </View>

      {/* Dữ liệu */}
      {MOCK_TOP_PRODUCTS.map((product, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.productCell, styles.productName, { flex: 3 }]}>
            {index + 1}. {product.name}
          </Text>
          <Text style={styles.productCell}>{product.quantity}</Text>
          <Text style={styles.productCell}>{product.lastPurchase}</Text>
        </View>
      ))}
    </View>
  </View>
);

// --- 3. Component Render Recent Orders ---
const RenderRecentOrders = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>3 đơn gần nhất</Text>
      <TouchableOpacity onPress={() => console.tron('Xem tất cả đơn hàng')}>
        <Text style={styles.viewMoreText}>Xem thêm</Text>
      </TouchableOpacity>
    </View>

    {MOCK_RECENT_ORDERS.map((order, index) => (
      <TouchableOpacity
        key={index}
        style={styles.orderCard}
        onPress={() => console.tron(`Chi tiết đơn hàng ${order.code}`)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderDateTime}>{order.date} - </Text>
          <Text style={styles.orderCode}>{order.code}</Text>
          <Text style={styles.orderStatus}>{order.status}</Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.orderSummaryText}>
            {order.totalItems} SP: x{order.totalItems}{' '}
            {MOCK_TOP_PRODUCTS[0]?.name || 'Sản phẩm'}
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.orderTotal}>
              {formatCurrency(order.totalPrice)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 4. Màn hình chính ---
const GeneralTab: React.FC = () => {
  // Tab bar giả lập
  const [activeTab, setActiveTab] = useState('30 ngày');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* REVENUE STATS */}
      <View style={[styles.sectionContainer, styles.revenueStats]}>
        {/* Time Filter */}
        <View style={styles.timeFilterBar}>
          {['30 ngày', 'Tháng này', 'Tháng trước'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.timeFilterButton,
                activeTab === tab && styles.activeTimeFilter,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.timeFilterText,
                  activeTab === tab && styles.activeTimeFilterText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <View style={styles.flexRowItem}>
              <Icon source="chart-bar" size={18} color="#3B82F6" />
              <Text style={styles.metricLabel}>Doanh thu</Text>
            </View>
            <Text style={styles.metricValue}>
              {formatCurrency(MOCK_CUSTOMER.currentRevenue)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.flexRowItem}>
              <Icon source="check-circle-outline" size={18} color="#10B981" />
              <Text style={styles.metricLabel}>Đã giao</Text>
            </View>
            <Text style={styles.metricValue}>
              {MOCK_CUSTOMER.deliveredOrders}
            </Text>
          </View>
        </View>
        <Text style={styles.lastPurchase}>
          Mua gần nhất từ **{MOCK_CUSTOMER.lastPurchaseDate}**
        </Text>
      </View>

      {/* TOP PRODUCTS */}
      <RenderTopProducts />

      {/* RECENT ORDERS */}
      <RenderRecentOrders />
    </ScrollView>
  );
};

export default GeneralTab;
