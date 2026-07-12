import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { LessonTemplateSummary } from '../types';
import { styles } from '../styles';

interface Props {
  templates: LessonTemplateSummary[];
}

export default function TemplateLessonList({ templates }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Bài học mẫu</Text>
      </View>

      {templates.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Icon source="text-box-outline" size={26} color="#CBD5E1" />
          <Text style={styles.emptyText}>Giáo án chưa có bài học mẫu nào</Text>
        </View>
      ) : (
        templates.map((t) => (
          <View key={t.id} style={styles.rowItem}>
            <View style={styles.rowNoBadge}>
              <Text style={styles.rowNoText}>{String(t.lessonNo).padStart(2, '0')}</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {t.lessonTitle || '—'}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {t.duration ? `Thời gian: ${t.duration} phút` : ''}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowRightText}>
                {t.objectiveCount} mục tiêu • {t.activitiesCount} HĐ
              </Text>
              <Text style={styles.rowRightText}>{t.materialsCount} tài liệu</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
