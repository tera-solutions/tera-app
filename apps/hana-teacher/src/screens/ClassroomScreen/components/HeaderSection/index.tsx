import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Search, SlidersHorizontal, Plus } from 'lucide-react-native';

import { styles } from './style';

export default function HeaderSection() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Lớp học</Text>

        <Text style={styles.subtitle}>
          Quản lý và theo dõi các lớp bạn chủ nhiệm
        </Text>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#0B84FF" />
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={20} color="#888" />
            <TextInput
              placeholder="Tìm kiếm lớp học, học viên..."
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color="#0B84FF" />
            <Text style={styles.filterText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
