import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ArrowUpDown } from 'lucide-react-native';

import ClassCard from '../ClassCard';

import { ClassItem } from '../../types';

import { styles } from './style';

interface Props {
  classes: ClassItem[];
}

export default function ClassListSection({
  classes,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Danh sách lớp học
        </Text>

        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>
            Sắp xếp
          </Text>

          <ArrowUpDown
            size={16}
            color="#0B84FF"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={classes}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <ClassCard item={item} />
        )}
      />
    </View>
  );
}