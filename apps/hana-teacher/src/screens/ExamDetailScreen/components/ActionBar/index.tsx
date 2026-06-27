import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../../styles';

interface Props {
  onNotify?: () => void;
  onRemind?: () => void;
  onViewAnswers?: () => void;
  onExportReport?: () => void;
}

const ACTIONS = [
  { label: 'Gửi thông báo', iconName: 'bullhorn-outline', iconBg: '#EEF5FF', iconColor: '#2196F3' },
  { label: 'Nhắc nộp bài', iconName: 'bell-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { label: 'Xem đáp án', iconName: 'file-document-outline', iconBg: '#EEF5FF', iconColor: '#2196F3' },
  { label: 'Xuất báo cáo', iconName: 'download-outline', iconBg: '#F0FDF4', iconColor: '#22C55E' },
];

export default function ActionBar({ onNotify, onRemind, onViewAnswers, onExportReport }: Props) {
  const handlers = [onNotify, onRemind, onViewAnswers, onExportReport];

  return (
    <View style={styles.actionBar}>
      {ACTIONS.map((action, i) => (
        <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={handlers[i]}>
          <View style={[styles.actionBtnIcon, { backgroundColor: action.iconBg }]}>
            <Icon source={action.iconName} size={22} color={action.iconColor} />
          </View>
          <Text style={styles.actionBtnLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
