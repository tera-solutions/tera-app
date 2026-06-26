import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { QuestionBankInfo } from '../../types';
import { styles } from '../../styles';

interface Props {
  info: QuestionBankInfo;
}

export default function QuestionBankSection({ info }: Props) {
  const ITEMS = [
    { label: 'Tổng số câu hỏi', value: info.totalQuestions, unit: 'câu', iconName: 'format-list-numbered', iconColor: '#2196F3' },
    { label: 'Câu trắc nghiệm', value: info.multipleChoice, unit: 'câu', iconName: 'checkbox-marked-outline', iconColor: '#22C55E' },
    { label: 'Câu tự luận', value: info.essay, unit: 'câu', iconName: 'text-box-outline', iconColor: '#F97316' },
    { label: 'Tổng điểm', value: info.totalScore, unit: 'điểm', iconName: 'star-outline', iconColor: '#8B5CF6' },
  ];

  return (
    <View style={styles.qbCard}>
      <Text style={styles.qbTitle}>Ngân hàng câu hỏi</Text>
      <View style={styles.qbRow}>
        {ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.qbItem, i > 0 && styles.qbItemBorder]}>
            <Icon source={item.iconName} size={16} color={item.iconColor} />
            <Text style={styles.qbLabel}>{item.label}</Text>
            <Text style={styles.qbValue}>{item.value}</Text>
            <Text style={styles.qbUnit}>{item.unit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
