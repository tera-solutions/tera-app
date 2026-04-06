import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import IconCSKH from '@assets/icons/ic_cskh.svg';
import IconMarking from '@assets/icons/ic_marketing.svg';
import IconMore from '@assets/icons/ic_more.svg';
import IconPurchase from '@assets/icons/ic_purchase.svg';
import IconSale from '@assets/icons/ic_sale.svg';
import IconShipping from '@assets/icons/ic_shipping.svg';
import IconWarehouse from '@assets/icons/ic_warehouse.svg';
import IconWork from '@assets/icons/ic_work.svg';
import { FONT_FAMILY } from '@common/constants/typography';
import colors from '@constants/colors';
import { Href, useRouter } from 'expo-router';

interface SvgIconProps {
  width?: number;
  height?: number;
  color?: string;
}

interface FeatureButtonProps {
  id?: string;
  icon: React.ComponentType<SvgIconProps>;
  name: string;
  subText: string;
  color: string;
  borderColor?: string;
  route?: Href;
  force?: boolean;
  onPress?: () => void;
}

const features: FeatureButtonProps[] = [
  {
    id: 'sale',
    name: 'Bán hàng',
    subText: 'Quản lý bán hàng',
    icon: IconSale,
    color: '#3374F3',
    borderColor: '#1C64F2',
    route: '/operation/storage-manager',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    subText: 'Tiếp thị',
    icon: IconMarking,
    color: '#6258D2',
    borderColor: '#5145CD',
  },
  {
    id: 'cskh',
    name: 'CSKH',
    subText: 'Chăm sóc khách hàng',
    icon: IconCSKH,
    color: '#E9599F',
    borderColor: '#E74694',
  },
  {
    id: 'warehouse',
    name: 'Kho',
    subText: 'Quản lý kho',
    icon: IconWarehouse,
    color: '#5D6673',
    borderColor: '#4B5563',
  },
  {
    id: 'purchase',
    name: 'Mua hàng',
    subText: 'Quản lý mua hàng',
    icon: IconPurchase,
    color: '#C8851C',
    borderColor: '#C27803',
  },
  {
    id: 'shipping',
    name: 'Vận chuyển',
    subText: 'Quản lý vận chuyển',
    icon: IconShipping,
    color: '#F97F7F',
    borderColor: '#F87171',
  },
  {
    id: 'job',
    name: 'Công việc',
    subText: 'Quản lý công việc',
    icon: IconWork,
    color: '#8C3434',
    borderColor: '#7F1D1D',
  },
  {
    id: 'ort',
    name: 'ORT',
    subText: 'Khác',
    icon: IconMore,
    color: '#833150',
    borderColor: '#751A3D',
    force: true,
  },
];

const ICON_SIZE = 24;

const ItemButton: React.FC<FeatureButtonProps> = ({
  name,
  icon: IconComponent,
  subText,
  color,
  borderColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: color, borderColor }]}
      >
        <IconComponent
          width={ICON_SIZE}
          height={ICON_SIZE}
          color={colors.white}
        />
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </TouchableOpacity>
  );
};

const FeatureList: React.FC<{}> = () => {
  const router = useRouter();

  return (
    <View style={styles.gridContainer}>
      {features.map((feature) => (
        <ItemButton
          key={feature.id}
          icon={feature.icon}
          name={feature.name}
          subText={feature.subText}
          color={feature.color}
          borderColor={feature.borderColor}
          onPress={() => {
            if (feature?.route) {
              router.push(feature?.route);
            } else {
              console.log(feature.id);
            }
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  button: {
    width: '25%', // 4 cột trên 1 hàng (25% * 4 = 100%)
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.primary,
    fontFamily: FONT_FAMILY.BOLD,
  },
  subText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.gray,
    fontFamily: FONT_FAMILY.REGULAR,
  },
});

export default FeatureList;
