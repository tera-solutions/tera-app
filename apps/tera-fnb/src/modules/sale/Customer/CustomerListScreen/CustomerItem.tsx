import { useDeleteCustomer } from '@services/customer.service';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Icon } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Customer } from '../_interface';
import { styles } from './styles';

const CustomerItem: React.FC<{ item: Customer }> = ({ item }) => {
  const router = useRouter();

  const swipeableRef = useRef<any>(null);
  const { mutate: onDeleteCustomer, isPending: isDeleteLoading } =
    useDeleteCustomer();
  const showConfirmDialog = () => {
    if (!item?.id) return;
    Alert.alert(
      'Xác nhận', // Title
      `Bạn có chắc chắn muốn xóa khách hàng "${item?.business_name}" không?`,
      [
        {
          text: 'Hủy',
          onPress: () => console.tron('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            if (typeof swipeableRef.current?.close === 'function') {
              swipeableRef.current?.close();
            }
            onDeleteCustomer({ id: item.id });
          },
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  const renderRightActions = (
    progess: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              dragX.value,
              [-100, 0],
              [1, 0.5],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    });

    return (
      <Animated.View style={[styles.rightAction, animatedStyle]}>
        <TouchableOpacity
          onPress={() => showConfirmDialog()}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Icon source="trash-can-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
    >
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() => {
          if (!item?.id) return;

          router.push({
            pathname: '/sale/customer/[id]',
            params: { id: item?.id },
          });
        }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.customerName}>{item?.business_name}</Text>
          <Text style={styles.customerPhone}>{item?.phone}</Text>
          <Text style={styles.customerAddress}>{item?.address}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.transactionStatus,
              {
                color: item.raw_data?.object_text?.color || '#0035e4',
              },
            ]}
          >
            {item.raw_data?.object_text?.title}
          </Text>
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
};

export default CustomerItem;
