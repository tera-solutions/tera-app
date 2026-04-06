import { useCustomer } from '@databases/customer/hook/useCustomer';
import {
  useDeleteCustomer,
  useGetCustomerDetail,
} from '@services/customer.service';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import DebitTab from './DebitTab';
import GeneralTab from './GeneralTab';
import InformationTab from './InformationTab';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const MOCK_CUSTOMER = {
  name: 'Anh Cươnghf',
  phone: '0982131312',
  initials: 'AC',
  currentRevenue: 39000,
  deliveredOrders: 1,
  lastPurchaseDate: '07-12-2025',
};

// --- 4. Màn hình chính ---
const CustomerDetailScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  const { id } = useLocalSearchParams();
  const { lastUpdate } = useCustomer();

  const { data: dataDetail, isLoading } = useGetCustomerDetail(id as string);
  const { mutate: onDeleteLocation, isPending: isDeleteLoading } =
    useDeleteCustomer();

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!lastUpdate) return;
    if (!id) return;
    console.tron('======== dataChange ======= ', lastUpdate);
    queryClient.invalidateQueries({
      queryKey: ['customer_local', 'detail', id],
    });
  }, [id, lastUpdate]);

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/sale/customer',
      });
    }
  };

  console.tron('dataDetail', dataDetail);

  const showConfirmDialog = () => {
    Alert.alert(
      'Xác nhận', // Title
      `Bạn có chắc chắn muốn xóa chi nhánh "${dataDetail?.raw_data?.business_name}" không?`,
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

  const makeCall = (phoneNumber: 'string') => {
    let url = '';

    if (Platform.OS === 'android') {
      url = `tel:${phoneNumber}`;
    } else {
      // iOS sử dụng định dạng tương tự
      url = `telprompt:${phoneNumber}`;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('Số điện thoại không hợp lệ hoặc thiết bị không hỗ trợ');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Lỗi khi mở cuộc gọi', err));
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handelBack}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.customerHeader}>
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{MOCK_CUSTOMER.initials}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.customerNameHeader}>
                {dataDetail?.raw_data?.business_name}
              </Text>
              <Text style={styles.customerPhoneHeader}>
                {dataDetail?.raw_data?.phone}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() =>
                router.push({
                  pathname: '/sale/customer/create',
                  params: { id: id },
                })
              }
            >
              <Icon source="pencil" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => makeCall(dataDetail?.raw_data?.phone)}
            >
              <Icon source="phone-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => console.tron('Chat')}
            >
              <Icon source="message-text-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION/TAB BAR NỘI BỘ */}
        <View style={styles.innerTabContainer}>
          <TouchableOpacity
            style={[
              styles.innerTab,
              activeTab === 'general' && styles.activeInnerTab,
            ]}
            onPress={() => setActiveTab('general')}
          >
            <Text style={[styles.innerTabText]}>Tổng quan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.innerTab,
              activeTab === 'debit' && styles.activeInnerTab,
            ]}
            onPress={() => setActiveTab('debit')}
          >
            <Text style={styles.innerTabText}>Số nợ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.innerTab,
              activeTab === 'information' && styles.activeInnerTab,
            ]}
            onPress={() => setActiveTab('information')}
          >
            <Text style={styles.innerTabText}>Thông tin</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'debit' && <DebitTab />}
        {activeTab === 'information' && (
          <InformationTab dataDetail={dataDetail?.raw_data} />
        )}
      </SafeAreaView>
    </View>
  );
};

export default CustomerDetailScreen;
