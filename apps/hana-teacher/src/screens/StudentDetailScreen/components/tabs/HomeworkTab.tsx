import { Text, View } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';

import { HomeworkItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  items: HomeworkItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasClass: boolean;
}

export default function HomeworkTab({ items, isLoading, isError, onRetry, hasClass }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="clipboard-text-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Bài tập của lớp</Text>
        </View>
      </View>

      {!hasClass ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Học viên chưa thuộc lớp nào bạn phụ trách</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={26} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được danh sách bài tập</Text>
          <Text style={styles.retryText} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Lớp chưa có bài tập nào</Text>
        </View>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={styles.listRowBody}>
              <Text style={styles.listRowTitle} numberOfLines={1}>
                {item.title || '—'}
              </Text>
              <Text style={styles.listRowSubtitle}>
                {item.dueDate ? `Hạn nộp: ${item.dueDate}` : ''}
              </Text>
            </View>
            {!!item.maxScore && <Text style={styles.listRowValue}>{item.maxScore}đ</Text>}
          </View>
        ))
      )}
    </View>
  );
}
