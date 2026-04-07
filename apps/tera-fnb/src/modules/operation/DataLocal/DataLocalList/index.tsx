import { formatNumber } from '@tera/commons/utils';
import { Loading } from '@components/ui/Loading';
import BusinessLocationService from '@databases/business_locations/service';
import CustomerService from '@databases/customer/service';
import GeneralService from '@databases/general/service';
import { resetDatabase } from '@databases/sync/service/sync.service';
import SyncQueueService from '@databases/sync_queues/service';
import TableVersionService from '@databases/table_version/service';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DataItem from './DataItem';
import { styles } from './styles';

const DataLocalList: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const flashListRef = useRef<any>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    is_delete: 0,
  });

  const initSync = async () => {
    try {
      const dataLocal = [];
      const tableVersion = await TableVersionService.fetchAll();
      dataLocal.push({
        table: 'table_version_logs',
        name: 'table_version_logs',
        total: tableVersion?.length,
      });
      const general = await GeneralService.fetchAll();
      dataLocal.push({
        table: 'generals',
        name: 'generals',
        total: general?.length,
      });
      const BusinessLocation = await BusinessLocationService.fetchAll();
      dataLocal.push({
        table: 'business_locations',
        name: 'business_locations',
        total: BusinessLocation?.length,
      });
      const Customer = await CustomerService.fetchAll();
      dataLocal.push({
        table: 'customers',
        name: 'customers',
        total: Customer?.length,
      });
      const SyncQueue = await SyncQueueService.fetchAll();
      dataLocal.push({
        table: 'sync_queues',
        name: 'sync_queues',
        total: SyncQueue?.length,
      });
      setDataList(dataLocal);
    } catch (e) {
      console.warn('ERRO Init', e);
      // Xử lý im lặng hoặc thông báo nhỏ (Toast)
    } finally {
      queryClient.invalidateQueries({
        queryKey: ['business_location_local', 'list'],
      });
    }
  };

  useEffect(() => {
    initSync();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await initSync();
      console.log('Data refreshed từ local DB');
    } catch (error) {
      setRefreshing(false);
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [initSync]);

  const handleResetData = () => {
    resetDatabase(true);
  };
  const showConfirmDialog = () => {
    Alert.alert(
      'Xác nhận', // Title
      `Bạn có chắc chắn muốn dữ liệu cục bộ không?`,
      [
        {
          text: 'Hủy',
          onPress: () => console.tron('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => handleResetData(),
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  console.tron('dataList local', dataList);

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            onPress={() => router.back()}
          >
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Quản lý dữ liệu cụ bộ</Text>
          <View style={styles.headerActions} />
        </View>

        {/* COUNT VÀ LIST HEADER */}
        <View style={styles.listHeader}>
          <Text style={styles.locationCount}>
            {formatNumber(dataList?.length)} bảng
          </Text>
          <View style={styles.filterIcons}>
            <TouchableOpacity onPress={onRefresh} style={{ marginRight: 10 }}>
              <Icon source="sync" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={showConfirmDialog}>
              <Icon source="database-remove" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* DANH SÁCH KHÁCH HÀNG */}
        <Loading isLoading={refreshing}>
          <View style={{ flex: 1 }}>
            <FlashList
              ref={flashListRef}
              data={dataList}
              renderItem={({ item }) => <DataItem item={item} />}
              contentContainerStyle={styles.listContent}
              onEndReachedThreshold={0.3}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#ff5722']}
                />
              }
            />
          </View>
        </Loading>
      </SafeAreaView>
    </View>
  );
};

export default DataLocalList;
