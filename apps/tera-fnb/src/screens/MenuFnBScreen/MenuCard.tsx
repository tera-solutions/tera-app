import { formatNumber } from '@tera/commons/utils';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUri: string; // URL ảnh sản phẩm
  category: string;
}
// --- 2. Component Menu Item Card (2 cột) ---
interface MenuCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.menuCard} onPress={() => onPress(item)}>
    <Image
      source={{ uri: item.imageUri }} 
      style={styles.itemImage}
      resizeMode="cover"
    />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.itemPrice}>{formatNumber(item.price)} VNĐ</Text>
    </View>
    {/* Nút thêm vào giỏ hàng nhanh */}
    <TouchableOpacity style={styles.addToCartButton}>
      <Icon source="plus" size={16} color="#FFFFFF" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default MenuCard;
