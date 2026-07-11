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
    title: 'Chấm bài',
    link: '/edu/assignment-grading',
    icon: require('@tera/assets/app/element_56.png'),
  },
  {
    key: 'assignment',
    title: 'Bài tập',
    link: '/edu/assignment',
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
    title: 'Thời khóa biểu',
    link: '/edu/timetable',
    icon: require('@tera/assets/app/element_59.png'),
  },
  {
    key: 'lesson-plan',
    title: 'Thành tích',
    link: '/edu/achievement',
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
    link: '/setting/more-app',
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
