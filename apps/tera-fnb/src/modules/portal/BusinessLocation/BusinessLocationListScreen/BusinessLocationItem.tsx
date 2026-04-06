import { useDeleteBusinessLocation } from '@services/business_location.service';
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
import { BusinessLocation } from '../_interface';
import { styles } from './styles';

const BusinessLocationItem: React.FC<{ item: BusinessLocation }> = ({
  item,
}) => {
  const router = useRouter();

  const swipeableRef = useRef<any>(null);
  const { mutate: onDeleteLocation, isPending: isDeleteLoading } =
    useDeleteBusinessLocation();
  const showConfirmDialog = () => {
    Alert.alert(
      'Xác nhận', // Title
      `Bạn có chắc chắn muốn xóa chi nhánh "${item?.name}" không?`,
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
            onDeleteLocation({ id: item?.id });
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
        style={styles.locationItem}
        onPress={() => {
          if(!item?.id) return;

          router.push({
            pathname: '/portal/business-location/[id]',
            params: { id: item?.id },
          });
        }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress}>{item?.address}</Text>
          {!!item.is_default && (
            <Text style={styles.locationAddress}>Chi nhánh mặc định</Text>
          )}
        </View>

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.transactionStatus,
              { color: item?.active_text?.color },
            ]}
          >
            {item?.active_text?.text}
          </Text>
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
};

export default BusinessLocationItem;
