import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export type ReservationStatus =
  | 'pending'
  | 'arrived'
  | 'confirmed'
  | 'canceled';

export interface Reservation {
  id: string;
  customerName: string;
  code: string;
  time: string;
  date: string;
  status: ReservationStatus;
}

interface ReservationItemProps {
  reservation: Reservation;
  onCancel: () => void;
  onArrived: () => void;
}

const getStatusInfo = (status: ReservationStatus) => {
  switch (status) {
    case 'pending':
      return { text: 'Chờ xử lý', bgColor: '#FEF3C7', textColor: '#F59E0B' };
    case 'arrived':
      return { text: 'Khách đã tới', bgColor: '#D1FAE5', textColor: '#10B981' };
    case 'confirmed':
      return { text: 'Đã chọn chỗ', bgColor: '#b4b4b4ff', textColor: '#ffffffff' };
    case 'canceled':
      return { text: 'Đã hủy', bgColor: '#FEE2E2', textColor: '#EF4444' };
    default:
      return { text: 'Không rõ', bgColor: '#E5E7EB', textColor: '#6B7280' };
  }
};

const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onCancel,
  onArrived,
}) => {
  const statusInfo = getStatusInfo(reservation?.status);

  return (
    <View style={styles.card}>
      {/* Status Badge */}
      <View
        style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}
      >
        <Text style={[styles.statusText, { color: statusInfo.textColor }]}>
          {statusInfo.text}
        </Text>
      </View>

      {/* Thông tin Khách hàng */}
      <Text style={styles.customerName}>{reservation.customerName}</Text>
      <Text style={styles.customerCode}>
        {reservation.time} {reservation.date} - {reservation.code}
      </Text>
      <Text style={styles.bookingTime}>
        Đặt bàn: {reservation.time} {reservation.date}
      </Text>

      {reservation.status === 'arrived' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.arrivedButton} onPress={onArrived}>
            <Text style={styles.arrivedButtonText}>Chọn bàn</Text>
          </TouchableOpacity>
        </View>
      )}
      {reservation.status === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Hủy đặt chỗ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrivedButton} onPress={onArrived}>
            <Text style={styles.arrivedButtonText}>Khách đã tới</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default ReservationItem;
