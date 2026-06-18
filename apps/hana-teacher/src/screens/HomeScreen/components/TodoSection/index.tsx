import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import {
  ChevronRight,
  ClipboardCheck,
  FileText,
  MessageSquare,
  PencilLine,
} from 'lucide-react-native';

import TodoItem, { Todo } from './TodoItem';

import { styles } from './style';

const todos: Todo[] = [
  {
    id: 1,
    title: 'Chấm bài tập',
    count: 12,
    icon: (
      <FileText
        size={20}
        color="#FF9800"
      />
    ),
  },
  {
    id: 2,
    title: 'Nhập điểm',
    count: 8,
    icon: (
      <PencilLine
        size={20}
        color="#3B82F6"
      />
    ),
  },
  {
    id: 3,
    title: 'Nhận xét học viên',
    count: 15,
    icon: (
      <MessageSquare
        size={20}
        color="#10B981"
      />
    ),
  },
  {
    id: 4,
    title: 'Điểm danh',
    count: 2,
    icon: (
      <ClipboardCheck
        size={20}
        color="#8B5CF6"
      />
    ),
  },
];

export default function TodoSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Việc cần xử lý
        </Text>

        <TouchableOpacity>
          <Text style={styles.viewAll}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        scrollEnabled={false}
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem item={item} />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </View>
  );
}