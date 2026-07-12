import { Text, View } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';

import { ScoreItem } from '../../types';
import { RANK_CONFIG } from '../../constants';
import { styles } from '../../styles';

interface Props {
  scores: ScoreItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export default function ScoresTab({ scores, isLoading, isError, onRetry }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="monitor-screenshot" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Điểm đánh giá</Text>
        </View>
      </View>

      {isError ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={26} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được điểm đánh giá</Text>
          <Text style={styles.retryText} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      ) : scores.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Chưa có điểm đánh giá nào</Text>
        </View>
      ) : (
        scores.map((s) => {
          const rank = RANK_CONFIG(s.score);
          return (
            <View key={s.id} style={styles.listRow}>
              <View style={styles.listRowBody}>
                <Text style={styles.listRowTitle}>{s.periodLabel || 'Đánh giá'}</Text>
                <Text style={styles.listRowSubtitle}>{s.date}</Text>
              </View>
              <View style={styles.listRowRight}>
                <Text style={[styles.listRowValue, { color: rank.color }]}>{s.score}</Text>
                <Text style={[styles.listRowSubtitle, { color: rank.color, marginTop: 0 }]}>
                  {rank.label}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
