import { formatNumber } from '@tera/commons/utils';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
export interface ShippingOption {
  id: string;
  carrier?: string;
  service?: string;
  deliveryTime?: string;
  originalPrice?: number;
  discountedPrice: number;
  isCheapest?: boolean;
  isFastest?: boolean;
  isRecommended?: boolean;
}

interface ShippingOptionItemProps {
  option: ShippingOption;
  isSelected: boolean;
  onSelect: (option: ShippingOption) => void;
}

// --- 2. Component Item Vận chuyển ---
const ShippingOptionItem: React.FC<ShippingOptionItemProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  // Icon tùy chỉnh cho một số nhà vận chuyển (như S, GHN)
  const renderCarrierIcon = () => {
    if (
      option.carrier === 'Sapo Express' ||
      option.carrier === 'Sapo Express - Kết nối ngay'
    ) {
      return <Text style={styles.carrierIconS}>S</Text>; // Icon Sapo
    }
    if (option.carrier === 'GHN Express') {
      return <Icon source="truck-delivery" size={20} color="#EF4444" />; // Ví dụ
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => onSelect(option)}
    >
      <View style={styles.optionLeft}>
        <Icon
          source={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
          size={20}
          color={isSelected ? '#3B82F6' : '#9CA3AF'}
        />
        <View style={styles.carrierDetails}>
          {renderCarrierIcon()}
          <View style={{ marginLeft: 5 }}>
            <View style={styles.serviceRow}>
              <Text style={styles.carrierName}>{option.carrier}</Text>
              {option.isCheapest && (
                <Text style={styles.tagCheapest}>Rẻ nhất</Text>
              )}
              {option.isFastest && (
                <Text style={styles.tagFastest}>Nhanh nhất</Text>
              )}
              {option.isRecommended && (
                <Text style={styles.tagRecommended}>Kết nối ngay</Text>
              )}
            </View>
            <Text style={styles.serviceDescription}>
              {option.service} {option.service && '-'} {option.deliveryTime}
              {option.carrier === 'GHN Express' && (
                <Icon source="alert-circle-outline" size={14} color="#EF4444" />
              )}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.optionRight}>
        {option.originalPrice !== option.discountedPrice && (
          <Text style={styles.originalPrice}>
            {formatNumber(option.originalPrice)}
          </Text>
        )}
        <Text style={styles.discountedPrice}>
          {formatNumber(option.discountedPrice)}
        </Text>
        <Icon source="information-outline" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

export default ShippingOptionItem;
