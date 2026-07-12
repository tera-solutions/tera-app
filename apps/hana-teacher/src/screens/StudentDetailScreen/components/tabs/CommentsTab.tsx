import { Text, View } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';

import { CommentItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  comments: CommentItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export default function CommentsTab({ comments, isLoading, isError, onRetry }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="comment-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Nhận xét</Text>
        </View>
      </View>

      {isError ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={26} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được nhận xét</Text>
          <Text style={styles.retryText} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      ) : comments.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Chưa có nhận xét nào</Text>
        </View>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={styles.listRow}>
            <View style={styles.listRowBody}>
              <Text style={styles.listRowTitle}>{c.content}</Text>
              <Text style={styles.listRowSubtitle}>{c.date}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
