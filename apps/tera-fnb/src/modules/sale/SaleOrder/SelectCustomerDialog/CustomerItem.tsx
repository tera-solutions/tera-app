import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
export interface Customer {
  id: string | number;
  name: string;
  phone?: string;
}

interface CustomerItemProps {
  customer: Customer;
  isSelected?: boolean;
  onSelect?: (customer?: Customer) => void;
  onPress?: (event?: any) => void;
}

// --- 2. Component Item Khách hàng ---
const CustomerItem: React.FC<CustomerItemProps> = ({
  customer,
  isSelected = false,
  onSelect,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.customerItem}
    onPress={(e) => {
      if (typeof onSelect === 'function' && !isSelected) {
        onSelect(customer);
      }
      if (typeof onPress === 'function') {
        onPress(e);
      }
    }}
  >
    <View style={styles.customerAvatar}>
      <Icon source="account-outline" size={24} color="#3B82F6" />
    </View>
    <View style={styles.customerInfo}>
      <Text style={styles.customerName}>{customer.name}</Text>
      <Text style={styles.customerPhone}>
        {customer.phone === '0000000000' ? '---' : customer.phone}
      </Text>
    </View>
    {isSelected ? (
      <TouchableOpacity
        onPress={(e) => {
          if (typeof onSelect === 'function') {
            onSelect();
          }
        }}
      >
        <Icon source="close-circle-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    ) : (
      <Icon source="chevron-right" size={20} color="#9CA3AF" />
    )}
  </TouchableOpacity>
);

export default CustomerItem;
