import { formatNumber } from '@common/utils';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductItemProps {
  product: Product;
  isMultiSelect: boolean;
  isSelected: boolean;
  onToggleSelect: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isMultiSelect,
  isSelected,
  onToggleSelect,
}) => (
  <TouchableOpacity
    style={styles.productItem}
    onPress={() => onToggleSelect(product)}
  >
    {/* Placeholder ảnh và Số lượng (nếu chọn) */}
    <View style={styles.imagePlaceholder}>
      {isSelected && (
        <View style={styles.selectionCountBadge}>
          <Text style={styles.selectionCountText}>1</Text>
        </View>
      )}
      <Image
        source={{ uri: product?.image }}
        style={styles.imageProduct}
      />
    </View>

    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productSku}>SKU: {product.sku}</Text>
    </View>

    <View style={styles.productPricing}>
      <Text style={styles.productPrice}>
        {formatNumber(product.price)}
      </Text>
      <Text style={styles.productStock}>Còn: {product.stock}</Text>
    </View>

    {/* Checkbox cho chế độ Chọn nhiều */}
    {isMultiSelect && (
      <Icon
        source={
          isSelected
            ? 'checkbox-marked-circle'
            : 'checkbox-blank-circle-outline'
        }
        size={24}
        color={isSelected ? '#3B82F6' : '#D1D5DB'}
      />
    )}
  </TouchableOpacity>
);

export default ProductItem;
