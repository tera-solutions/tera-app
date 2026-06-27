import { Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { styles } from '../../styles';

interface StudentSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function StudentSearchBar({ value, onChangeText }: StudentSearchBarProps) {
  return (
    <View style={styles.searchWrapper}>
      <Search size={16} color="#94A3B8" />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm học viên..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
