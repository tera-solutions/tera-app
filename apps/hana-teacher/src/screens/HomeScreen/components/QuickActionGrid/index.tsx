import { View } from 'react-native';
import { useRouter } from 'expo-router';

import QuickActionItem, { QuickAction } from './QuickActionItem';

import { styles } from './style';

const actions: QuickAction[] = [
  {
    key: 'attendance',
    title: 'Điểm danh',
    link: '/student/attendance',
    icon: require('@tera/assets/app/element_55.png'),
  },
  {
    key: 'grade',
    title: 'Nhập điểm',
    icon: require('@tera/assets/app/element_56.png'),
  },
  {
    key: 'homework',
    title: 'Bài tập',
    icon: require('@tera/assets/app/element_57.png'),
    badge: 6,
  },
  {
    key: 'comment',
    title: 'Nhận xét',
    icon: require('@tera/assets/app/element_58.png'),
  },
  {
    key: 'schedule',
    title: 'Lịch dạy',
    icon: require('@tera/assets/app/element_59.png'),
  },
  {
    key: 'lesson-plan',
    title: 'Giáo án',
    icon: require('@tera/assets/app/element_60.png'),
  },
  {
    key: 'report',
    title: 'Báo cáo',
    icon: require('@tera/assets/app/element_61.png'),
  },
  {
    key: 'more',
    title: 'Khác',
    icon: require('@tera/assets/app/element_62.png'),
  },
];

export default function QuickActionGrid() {
  const router = useRouter();

  const handlePress = (action: QuickAction) => {
    console.log(action.key);
    if (action?.link) {
      router.push(action?.link as any);
    }
  };

  return (
    <View style={styles.container}>
      {actions.map((item) => (
        <QuickActionItem key={item.key} item={item} onPress={handlePress} />
      ))}
    </View>
  );
}
