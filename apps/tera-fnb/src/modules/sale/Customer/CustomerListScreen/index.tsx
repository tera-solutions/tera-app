import { useStates } from '@hooks/useStates';
import { formatNumber } from '@tera/common/utils';
import DrawerFilter from '@components/domain/DrawerFilter';
import { SearchInput } from '@components/ui';
import { Loading } from '@components/ui/Loading';
import { useCustomer } from '@databases/customer/hook/useCustomer';
import CustomerService from '@databases/customer/service';
import { useGetCustomerListInfinite } from '@services/customer.service';
import { syncManager } from '@services/sync/SyncManager';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { debounce, omit } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerObjectText, CustomerObjectType } from '../_interface';
import CustomerItem from './CustomerItem';
import { FilterDrawer } from './FilterDrawer';
import { styles } from './styles';

const CustomerListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const queryClient = useQueryClient();
  const router = useRouter();
  const navigation = useNavigation();
  const flashListRef = useRef<any>(null);

  const {
    generalStore: { isSuper },
  } = useStates();

  const { lastUpdate, totalCount } = useCustomer();

  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isDrawerOpen, setSsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({
    limit: 20,
    page: 1,
    sort: 'desc',
    is_delete: 0,
  });

  const {
    data: dataList,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetCustomerListInfinite(omit(filters, ['is_filter']));

  const initSync = async () => {
    try {
      syncManager.addQueue({
        table_name: 'customers',
        type: 'realtime',
        action: 'GET',
      });
    } catch (e) {
      // Xử lý im lặng hoặc thông báo nhỏ (Toast)
    }
  };

  useEffect(() => {
    initSync();
  }, []);

  useEffect(() => {
    if (!lastUpdate) return;
    queryClient.invalidateQueries({
      queryKey: ['customer_local', 'list'],
    });
    const timeout = setTimeout(() => {
      flashListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [lastUpdate]);

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/(tabs)/more',
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

  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        keyword: nextValue,
      }));
      Keyboard.dismiss();
    }, 500),
    [],
  );

  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  const handleClearDB = () => {
    console.tron('handleClearDB');
    CustomerService.clearData();
    queryClient.invalidateQueries({
      queryKey: ['customer_local', 'list'],
    });
    router.back();
  };

  const handleSort = async () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      sort: prevFilters?.sort === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handelChangeTab = (tab: string) => {
    setActiveTab(tab);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      object: tab !== 'all' ? tab : undefined,
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
        <Text style={styles.titleText}>Khách hàng</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/operation/data-local/[id]',
                params: { id: 'customers' },
              });
            }}
            style={{ marginRight: 15 }}
          >
            <Icon source="cloud-sync-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.tron('User Group')}>
            <Icon source="account-group-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <SearchInput
        placeholder="Nhập tên, địa chỉ, số điện thoại"
        value={searchTerm}
        onClear={() => handleChangeText('')}
        onChangeText={handleChangeText}
      />

      {/* TAB & FILTER */}
      <View style={styles.tabFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'all' && styles.activeTabButton,
            ]}
            onPress={() => handelChangeTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          {Object.keys(CustomerObjectText).map((tab: string) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => handelChangeTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {CustomerObjectText[tab as CustomerObjectType]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* COUNT VÀ LIST HEADER */}
      <View style={[styles.tabFilterContainer, { backgroundColor: '#f1f1f1' }]}>
        <Text style={styles.customerCount}>
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
            renderItem={({ item }) => <CustomerItem item={item} />}
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
        onPress={() => router.push('/sale/customer/create')}
      >
        <Icon source="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>Thêm khách hàng</Text>
      </TouchableOpacity>
    </DrawerFilter>
  );
};

export default CustomerListScreen;
