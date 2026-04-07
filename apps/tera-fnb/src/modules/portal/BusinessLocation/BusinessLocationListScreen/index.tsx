import { useStates } from '@hooks/useStates';
import { formatNumber } from '@tera/commons/utils';
import DrawerFilter from '@components/domain/DrawerFilter';
import { SearchInput } from '@components/ui';
import { Loading } from '@components/ui/Loading';
import { useBusinessLocation } from '@databases/business_locations/hook/useBusinessLocation';
import BusinessLocationService from '@databases/business_locations/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetBusinessLocationListInfinite } from '@services/business_location.service';
import { syncManager } from '@services/sync/SyncManager';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { debounce, omit } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import BusinessLocationItem from './BusinessLocationItem';
import { FilterDrawer } from './FilterDrawer';
import { styles } from './styles';

const BusinessLocationListScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigation = useNavigation();

  const flashListRef = useRef<any>(null);
  const {
    generalStore: { isSuper },
  } = useStates();

  const [refreshing, setRefreshing] = useState(false);
  const [isDrawerOpen, setSsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({
    limit: 20,
    page: 1,
    sort: 'desc',
    is_delete: 0,
  });

  // useGetBusinessLocationList(filters);
  const { lastUpdate, totalCount } = useBusinessLocation();
  const {
    data: dataList,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetBusinessLocationListInfinite(omit(filters, ['is_filter']));

  const initSync = async () => {
    try {
      syncManager.addQueue({
        table_name: 'business_locations',
        type: 'realtime',
        action: 'GET',
      });
    } catch (e) {
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

  useEffect(() => {
    if (!lastUpdate) return;
    queryClient.invalidateQueries({
      queryKey: ['business_location_local', 'list'],
    });
    const timeout = setTimeout(() => {
      flashListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [lastUpdate]);

  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      setFilters((prevFilters: any) => ({ ...prevFilters, name: nextValue }));
      Keyboard.dismiss();
    }, 500),
    [],
  );

  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/operation/setting-store',
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await initSync();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [initSync]);

  const handleClearDB = async () => {
    await AsyncStorage.removeItem(`business_locations:lastPulledAt`);
    await BusinessLocationService.clearData();
    router.back();
  };

  const handleFilter = () => {
    console.tron('Filter');
  };

  const handleSort = async () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      sort: prevFilters?.sort === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <DrawerFilter
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setSsDrawerOpen}
      filterContent={
        <FilterDrawer
          filters={filters}
          setFilters={setFilters}
          onClose={() => setSsDrawerOpen(false)}
        />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          onPress={handelBack}
        >
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Quản lý chi nhánh</Text>
        <View style={styles.headerActions} />
      </View>

      {/* SEARCH BAR */}
      <SearchInput
        placeholder="Nhập tên chi nhánh"
        value={searchTerm}
        onClear={() => handleChangeText('')}
        onChangeText={handleChangeText}
      />
      {/* COUNT VÀ LIST HEADER */}
      <View style={styles.tabFilterContainer}>
        <Text style={styles.locationCount}>
          {formatNumber(dataList?.length)}/{formatNumber(totalCount)} kết quả
        </Text>
        <View style={styles.filterIcons}>
          {isSuper && (
            <TouchableOpacity
              onPress={handleClearDB}
              style={{ marginRight: 10 }}
            >
              <Icon source="database-remove" size={24} color="#da0000" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSort} style={{ marginRight: 10 }}>
            <Icon
              source={
                filters?.sort === 'desc' ? 'sort-descending' : 'sort-ascending'
              }
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSsDrawerOpen(true)}>
            <Icon
              source="filter-outline"
              size={24}
              color={filters?.is_filter ? '#da0000' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* DANH SÁCH KHÁCH HÀNG */}
      <Loading isLoading={isPending}>
        <View style={{ flex: 1 }}>
          <FlashList
            ref={flashListRef}
            data={dataList}
            keyExtractor={(item) => String(item?.id)}
            renderItem={({ item }) => <BusinessLocationItem item={item} />}
            contentContainerStyle={styles.listContent}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if (isPending) return;
              if (hasNextPage && !isFetchingNextPage) {
                console.tron('scroll next page');
                fetchNextPage();
              }
            }}
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

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push('/portal/business-location/create')}
      >
        <Icon source="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>Thêm chi nhánh</Text>
      </TouchableOpacity>
    </DrawerFilter>
  );
};

export default BusinessLocationListScreen;
