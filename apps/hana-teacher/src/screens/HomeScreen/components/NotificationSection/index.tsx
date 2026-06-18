import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Bell } from 'lucide-react-native';

import NotificationItem, {
  Notification,
} from './NotificationItem';

import { styles } from './style';

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Lớp Starters 2A có 2 học viên nghỉ học hôm nay',
    time: '5 phút trước',
    isRead: false,
  },
  {
    id: 2,
    title: 'Đã có 8 bài tập mới cần chấm điểm',
    time: '30 phút trước',
    isRead: false,
  },
  {
    id: 3,
    title: 'Phụ huynh Nguyễn Minh Anh đã gửi phản hồi',
    time: '2 giờ trước',
    isRead: true,
  },
  {
    id: 4,
    title: 'Lịch dạy tuần tới đã được cập nhật',
    time: 'Hôm qua',
    isRead: true,
  },
];

export default function NotificationSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bell
            size={22}
            color="#0066cc"
          />

          <Text style={styles.title}>
            Thông báo mới
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.viewAll}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        scrollEnabled={false}
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem item={item} />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </View>
  );
}