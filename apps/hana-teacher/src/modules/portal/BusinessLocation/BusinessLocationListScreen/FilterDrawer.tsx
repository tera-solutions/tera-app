import { SearchInput } from '@components/ui';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import { styles } from './styles';

interface FilterDrawerProps {
  filters: any;
  setFilters: (data: any) => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const [isNewAddress, setIsNewAddress] = useState<number>(
    filters?.is_new_address || 0,
  );
  const [searchTerm, setSearchTerm] = useState(filters?.name);

  const handleChangeText = (text: string) => {
    setSearchTerm(text);
  };

  useEffect(() => {
    setSearchTerm(filters?.name);
    setIsNewAddress(filters?.is_new_address || 0);
  }, [filters]);

  const handleApply = () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      name: searchTerm,
      is_new_address: isNewAddress,
      is_filter: true,
    }));
    onClose();
  };

  const handleClear = () => {
    const cloneFilter = { ...filters };
    delete cloneFilter?.name;
    delete cloneFilter?.is_new_address;
    delete cloneFilter?.is_filter;

    setFilters(cloneFilter);
    onClose();
  };

  return (
    <View style={styles.drawerFilter}>
      <View style={styles.sectionTitle}>
        <Icon source="filter" size={22} color="#575757" />
        <Text>Lọc và tìm kiếm nâng cao</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <SearchInput
            placeholder="Nhập tên chi nhánh"
            value={searchTerm}
            onClear={() => handleChangeText('')}
            onChangeText={handleChangeText}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Địa chỉ mới</Text>
          <Switch
            value={!!isNewAddress}
            onValueChange={(checked) => setIsNewAddress(checked ? 1 : 0)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={!!isNewAddress ? '#3B82F6' : '#f4f3f4'}
          />
        </View>
      </View>
      <View style={styles.footerDrawer}>
        <TouchableOpacity style={styles.createButton} onPress={handleApply}>
          <Text style={styles.createButtonText}>Áp dụng lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.createButtonText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
