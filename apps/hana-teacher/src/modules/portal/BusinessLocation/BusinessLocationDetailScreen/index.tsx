import { Loading } from '@components/ui/Loading';
import { useBusinessLocation } from '@databases/business_locations/hook/useBusinessLocation';
import {
  useDeleteBusinessLocation,
  useGetBusinessLocationDetail,
} from '@hana/teacher/services/business_location.service';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InfoItem from './InfoItem';
import { styles } from './styles';

// --- 4. Màn hình chính ---
const BusinessLocationDetailScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  const { id } = useLocalSearchParams();
  const { lastUpdate } = useBusinessLocation();

  const { data: dataDetail, isLoading } = useGetBusinessLocationDetail(
    id as string,
  );
  const { mutate: onDeleteLocation, isPending: isDeleteLoading } =
    useDeleteBusinessLocation();

  useEffect(() => {
    if (!lastUpdate) return;
    if (!id) return;
    console.tron('======== dataChange ======= ', lastUpdate);
    queryClient.invalidateQueries({
      queryKey: ['business_location_local', 'detail', id],
    });
  }, [id, lastUpdate]);

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/portal/business-location',
      });
    }
  };

  const showConfirmDialog = () => {
    Alert.alert(
      'Xác nhận', // Title
      `Bạn có chắc chắn muốn xóa chi nhánh "${dataDetail?.name}" không?`,
      [
        {
          text: 'Hủy',
          onPress: () => console.tron('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () =>
            onDeleteLocation({
              id: dataDetail?.id,
              callback: () => router.back(),
            }),
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.containerFull}>
      <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handelBack}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.locationHeader}>
            <View style={styles.headerInfo}>
              <Text style={styles.locationNameHeader}>Thông tin chi nhánh</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() =>
                router.push({
                  pathname: '/portal/business-location/create',
                  params: { id: id },
                })
              }
            >
              <Icon source="pencil" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
        <Loading isLoading={isLoading || isDeleteLoading}>
          <ScrollView style={styles.scrollContent}>
            {/* THÔNG TIN CHUNG */}
            <View style={styles.section}>
              <InfoItem label="Tên" value={dataDetail?.name} />
              <InfoItem label="Số điện thoại" value={dataDetail?.mobile} />
              <InfoItem
                label="Địa chỉ lấy hàng (Số nhà, ngõ)"
                value={dataDetail?.landmark}
              />
              {dataDetail?.is_new_address ? (
                <>
                  <InfoItem label="Phường/xã" value={dataDetail?.city} />
                  <InfoItem label="Tỉnh/Thành phố" value={dataDetail?.state} />
                </>
              ) : (
                <>
                  <InfoItem label="Phường/xã" value={dataDetail?.ward} />
                  <InfoItem label="Quận/Huyện" value={dataDetail?.city} />
                  <InfoItem label="Tỉnh/Thành phố" value={dataDetail?.state} />
                </>
              )}
            </View>

            <View style={styles.section}>
              <InfoItem label="Địa chỉ mặc định" value={dataDetail?.address} />
            </View>

            {!!dataDetail?.is_default && (
              <View style={[styles.section, styles.statusSection]}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusIndicator, styles.statusActive]} />
                  <Text style={styles.statusText}>Chi nhánh mặc định</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={showConfirmDialog}
            >
              <Text style={styles.deleteButtonText}>Xoá chi nhánh</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </Loading>
      </View>
    </View>
  );
};

export default BusinessLocationDetailScreen;
