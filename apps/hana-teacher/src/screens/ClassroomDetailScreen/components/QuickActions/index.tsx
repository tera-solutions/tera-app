import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface QuickAction {
  iconName: string;
  label: string;
  iconBg: string;
  iconColor: string;
  route?: string;
}

const ACTIONS: QuickAction[] = [
  { iconName: 'calendar-check', label: 'Điểm danh', iconBg: '#EEF9F0', iconColor: '#22C55E', route: '/student/attendance' },
  { iconName: 'book-open-page-variant', label: 'Bài học', iconBg: '#FFF7ED', iconColor: '#F97316', route: '/edu/lesson' },
  { iconName: 'clipboard-list', label: 'Bài tập', iconBg: '#F5F3FF', iconColor: '#8B5CF6', route: '/edu/homework' },
  { iconName: 'star-outline', label: 'Đánh giá', iconBg: '#FFFBEB', iconColor: '#F59E0B' },
  { iconName: 'message-outline', label: 'Nhắn tin', iconBg: '#EFF6FF', iconColor: '#2196F3' },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <View style={styles.quickActions}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.quickActionItem}
          onPress={() => action.route && router.push(action.route as any)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: action.iconBg }]}>
            {/* Using react-native-paper Icon */}
            {renderIcon(action.iconName, action.iconColor)}
          </View>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function renderIcon(name: string, color: string) {
  const { Icon } = require('react-native-paper');
  return <Icon source={name} size={24} color={color} />;
}
