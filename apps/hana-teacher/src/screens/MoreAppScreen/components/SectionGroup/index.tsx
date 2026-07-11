import { Text, View } from 'react-native';

import MoreItem from '../MoreItem';
import { styles } from '../../styles';
import type { SectionType } from '../../types';

interface Props {
  section: SectionType;
}

export default function SectionGroup({ section }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionCard}>
        <View style={styles.sectionGrid}>
          {section.items.map((item) => (
            <MoreItem key={item.id} item={item} />
          ))}
        </View>
      </View>
    </View>
  );
}
