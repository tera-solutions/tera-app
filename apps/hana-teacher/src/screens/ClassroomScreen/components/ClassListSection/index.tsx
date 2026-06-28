import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ArrowUpDown } from 'lucide-react-native';

import ClassCard from '../ClassCard';

import { ClassItem } from '../../types';

import { styles } from './style';

interface Props {
  classes: ClassItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function ClassListSection({ classes, isLoading = false, onRefresh }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách lớp học</Text>

        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sắp xếp</Text>

          <ArrowUpDown size={16} color="#0B84FF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginVertical: 32 }} />
      ) : (
        <FlatList
          data={classes}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <ClassCard item={item} />}
          onRefresh={onRefresh}
          refreshing={false}
        />
      )}
    </View>
  );
}
