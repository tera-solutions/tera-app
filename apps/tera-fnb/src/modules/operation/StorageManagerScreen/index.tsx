import { formatNumber } from '@tera/common/utils';
import DB from '@databases/database';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const storageData = [
  { id: '2', table: 'Đơn hàng', size: '60/100', records: 60, icon: 'cart' },
  {
    id: '3',
    table: 'Khách hàng',
    size: '15/200',
    records: 15,
    icon: 'account-group',
  },
  {
    id: '4',
    table: 'Sản phẩm',
    size: '20/100',
    records: 20,
    icon: 'package-variant-closed',
  },
];

const renderItem = ({ item }: any) => (
  <View style={styles.tableRow}>
    <Icon source={item.icon} size={24} color="#555" />
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.tableName}>{item.table}</Text>
      <Text style={styles.tableSub}>{item.records} items</Text>
    </View>
    <Text style={styles.tableSize}>{item.size}</Text>
  </View>
);

const StorageManagerScreen = () => {
  const router = useRouter();
  const [db_size, setDBSize] = useState(0);

  const handleSyncData = async () => {
    if (Platform.OS !== 'web') {
      console.log('Begin sync data');
      const dbSize = await DB.getStorageDatabase();
      setDBSize(dbSize);
    }
  };

  useEffect(() => {
    handleSyncData();
  }, []);

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Dung lượng lưu trữ</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Action Buttons */}
        <View style={styles.container}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnAction}>
              <Icon source="broom" size={20} color="#2196F3" />
              <Text style={styles.btnText}>Dọn dẹp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => handleSyncData()}
            >
              <Icon source="sync" size={20} color="#4CAF50" />
              <Text style={styles.btnText}>Đồng bộ lại</Text>
            </TouchableOpacity>
          </View>

          {/* Details List */}
          <Text style={styles.sectionTitle}>Chi tiết các bảng</Text>
          <FlatList
            data={[
              {
                id: '1',
                table: 'Bộ nhớ máy',
                size: `${formatNumber(db_size, '0,0.[000000]')} MB`,
                records: 1200,
                icon: 'package-variant',
              },
              ...storageData,
            ]}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default StorageManagerScreen;
