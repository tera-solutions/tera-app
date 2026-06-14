import { formatNumber } from '@tera/commons/utils';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image?: string;
  subtotal?: number;
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, newQty: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onRemove,
  onQuantityChange,
}) => (
  <View style={styles.cartItemRow}>
    <TouchableOpacity
      onPress={() => onRemove(item.id)}
      style={styles.removeButton}
    >
      <Icon source="close-circle-outline" size={18} color="#9CA3AF" />
    </TouchableOpacity>

    <View style={styles.itemInfo}>
      <Image style={styles.itemIconWrapper} source={{ uri: item?.image }} />
      <View style={{ flexShrink: 1 }}>
        <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
          {item.name} - {item.unit}
        </Text>
        <Text style={styles.itemPrice}>{formatNumber(item.price)}</Text>
      </View>
    </View>

    <View style={styles.quantityControl}>
      <TouchableOpacity
        onPress={() => onQuantityChange(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        <Text style={styles.qtyButton}>-</Text>
      </TouchableOpacity>
      <Text style={styles.qtyText}>{item.quantity}</Text>
      <TouchableOpacity
        onPress={() => onQuantityChange(item.id, item.quantity + 1)}
      >
        <Text style={[styles.qtyButton, styles.qtyButtonPlus]}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default CartItemRow;
