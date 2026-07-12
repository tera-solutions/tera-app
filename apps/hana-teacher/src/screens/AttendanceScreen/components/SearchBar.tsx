import { TextInput, TouchableOpacity, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

import { styles } from '../style';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBox}>
        <Search size={20} color="#94A3B8" />

        <TextInput
          placeholder="Tìm kiếm học viên..."
          value={value}
          onChangeText={onChangeText}
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity style={styles.filterButton}>
        <SlidersHorizontal size={20} color="#0066cc" />
      </TouchableOpacity>
    </View>
  );
}
