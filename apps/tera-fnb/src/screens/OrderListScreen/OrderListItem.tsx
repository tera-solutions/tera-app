import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from '@screens/OrderListScreen'; // Import type từ màn hình
import { OrderStyles } from '@styles/OrderStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OrderListItemProps {
  order: Order;
}

const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const showPaymentButton = order.status === 'Đang giao dịch';

  const statusBadge = (status: string) => {
    let backgroundColor = '#4CAF50'; // Mặc định
    if (status === 'Trả hàng') {
      backgroundColor = '#FF9800'; // Cam
    } else if (status === 'Đang xử lý') {
      backgroundColor = '#2196F3'; // Xanh dương
    }

    return {
      backgroundColor: backgroundColor,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    } as const;
  };

  return (
    <View style={OrderStyles.orderItemContainer}>
      <View style={OrderStyles.itemContent}>
        {/* Header: Mã đơn hàng và Trạng thái */}
        <View style={OrderStyles.itemHeader}>
          <View style={OrderStyles.orderInfo}>
            <Text style={OrderStyles.codeText}>{order.code}</Text>
            <Text style={OrderStyles.totalAmount}>
              {formatCurrency(order.total)}
            </Text>
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <View style={statusBadge(order.status)}>
              <Text style={OrderStyles.statusText}>{order.status}</Text>
            </View>
            <Text style={OrderStyles.dateTimeText}>{order.dateTime}</Text>
          </View>
        </View>

        {/* Thông tin chi tiết */}

        {/* Khách hàng và Số điện thoại */}
        <View style={OrderStyles.detailRow}>
          <MaterialCommunityIcons
            name="account-outline"
            size={16}
            color="#888"
          />
          <Text style={OrderStyles.detailText}>
            {order.customer}
            {order.contact && (
              <Text style={{ color: '#007AFF', fontWeight: '500' }}>
                {' '}
                - {order.contact}
              </Text>
            )}
          </Text>
        </View>

        {/* Địa chỉ */}
        <View style={OrderStyles.detailRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color="#888"
          />
          <Text style={OrderStyles.detailText}>
            {order.address || 'Không có địa chỉ'}
          </Text>
        </View>

        {/* Ghi chú */}
        <View style={OrderStyles.detailRow}>
          <MaterialCommunityIcons
            name="note-text-outline"
            size={16}
            color="#888"
          />
          <Text style={OrderStyles.detailText}>Ghi chú: {order.note}</Text>
        </View>
      </View>

      {/* Thanh hành động dưới cùng */}
      <View style={OrderStyles.actionBar}>
        <TouchableOpacity style={OrderStyles.actionButton}>
          <MaterialCommunityIcons
            name="printer-outline"
            size={20}
            color="#333"
          />
          <Text style={OrderStyles.actionButtonText}>In đơn hàng</Text>
        </TouchableOpacity>

        {showPaymentButton && (
          <>
            <View style={OrderStyles.actionButtonSeparator} />
            <TouchableOpacity style={OrderStyles.actionButton}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={20}
                color="#333"
              />
              <Text style={OrderStyles.actionButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default OrderListItem;
