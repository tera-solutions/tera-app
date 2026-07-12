import { Text, View } from 'react-native';

import { MOCK_QUESTIONS } from '../../constants';
import { styles } from '../../styles';

export default function QuestionsTab() {
  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabCardTitle}>Ngân hàng câu hỏi</Text>
      <Text style={styles.tabCardHint}>
        Dữ liệu minh họa — hệ thống câu hỏi chi tiết chưa được tích hợp API.
      </Text>

      {MOCK_QUESTIONS.map((q) => (
        <View key={q.id} style={styles.questionRow}>
          <View style={styles.questionNoBadge}>
            <Text style={styles.questionNoText}>{q.no}</Text>
          </View>
          <View style={styles.questionBody}>
            <Text style={styles.questionTypeText}>{q.type}</Text>
            <Text style={styles.questionContent}>{q.content}</Text>
            <Text style={styles.questionScore}>{q.score} điểm</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
