import { formatNumber } from '@tera/commons/utils';
import { Loading } from '@components/ui/Loading';
import BusinessLocationService from '@databases/business_locations/service';
import CustomerService from '@databases/customer/service';
import GeneralService from '@databases/general/service';
import SyncQueueService from '@databases/sync_queues/service';
import TableVersionService from '@databases/table_version/service';
import { syncManager } from '@services/sync/SyncManager';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoItem from './InfoItem';
import { styles } from './styles';

const DataLocalList: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const flashListRef = useRef<any>(null);
  const { id } = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    is_delete: 0,
  });

  const initSync = async () => {
    console.tron('id', id);
    try {
      let dataLocal: any[] = [];
      switch (id) {
        case 'table_version_logs':
          dataLocal = await TableVersionService.fetchAll();
          break;
        case 'generals':
          dataLocal = await GeneralService.fetchAll();
          break;
        case 'business_locations':
          dataLocal = await BusinessLocationService.fetchAll();
          break;
        case 'sync_queues':
          dataLocal = await SyncQueueService.fetchAll();
          break;
        case 'customers':
          dataLocal = await CustomerService.fetchAll();
          break;

        default:
          break;
      }
      setDataList(dataLocal);
    } catch (e) {
      console.warn(e);
      // Xử lý im lặng hoặc thông báo nhỏ (Toast)
    } finally {
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

  const onSyncData = () => {
    syncManager.processQueue('background');
    setTimeout(() => {
      onRefresh();
    }, 2000);
  };
  const onSyncDataContinue = () => {
    syncManager.processQueueContinue();
    setTimeout(() => {
      onRefresh();
    }, 1000);
  };
  const onSyncDataFail = () => {
    syncManager.processQueueManual('manual');
    setTimeout(() => {
      onRefresh();
    }, 2000);
  };

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
          <Text style={styles.titleText}>{id}</Text>
          <View style={styles.headerActions} />
        </View>

        {/* COUNT VÀ LIST HEADER */}
        <View style={styles.listHeader}>
          <Text style={styles.locationCount}>
            {formatNumber(dataList?.length)} bảng
          </Text>
          <View style={styles.rightAction}>
            {id === 'sync_queues' && (
              <>
                <View style={styles.filterIcons}>
                  <TouchableOpacity onPress={onSyncDataContinue}>
                    <Icon source="backup-restore" size={24} color="#ff9100" />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterIcons}>
                  <TouchableOpacity onPress={onSyncData}>
                    <Icon source="database-export" size={24} color="#00a6e7" />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterIcons}>
                  <TouchableOpacity onPress={onSyncDataFail}>
                    <Icon source="cloud-sync" size={24} color="#d30e00" />
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={styles.filterIcons}>
              <TouchableOpacity onPress={onRefresh}>
                <Icon source="sync" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DANH SÁCH KHÁCH HÀNG */}
        <Loading isLoading={refreshing}>
          <View style={{ flex: 1 }}>
            <FlashList
              ref={flashListRef}
              data={dataList}
              renderItem={({ item }) => <InfoItem item={item} />}
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
