import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

import { styles } from '../../styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilter?: () => void;
}

export default function SearchBar({ value, onChangeText, onFilter }: Props) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchInputWrapper}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm phụ huynh, học viên, số điện thoại..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilter}>
        <SlidersHorizontal size={16} color="#475569" />
        <Text style={styles.filterBtnText}>Bộ lọc</Text>
      </TouchableOpacity>
    </View>
  );
}
