import { Text, View } from 'react-native';

import { CurriculumItem } from '../types';
import { styles } from '../styles';

interface Props {
  items: CurriculumItem[];
}

export default function CurriculumSection({ items }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Chương trình học tập</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Khóa học chưa có chương trình học tập.</Text>
      ) : (
        items.map((item, index) => (
          <View key={item.id} style={[styles.curriculumItem, index === 0 && styles.curriculumItemFirst]}>
            <View style={styles.curriculumOrderBadge}>
              <Text style={styles.curriculumOrderText}>{String(item.order).padStart(2, '0')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.curriculumTitle}>{item.title || '—'}</Text>
              {!!item.content && <Text style={styles.curriculumContent}>{item.content}</Text>}
            </View>
          </View>
        ))
      )}
    </View>
  );
}
