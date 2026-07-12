import { TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { styles } from '../styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function CourseSearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.searchWrapper}>
      <Search size={16} color="#94A3B8" />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm khóa học..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
