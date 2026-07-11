import { Text, View } from 'react-native';

import MoreItem from '../MoreItem';
import { styles } from '../../styles';
import { TIEN_ICH_ITEMS } from '../../constants';

export default function UtilitiesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiện ích khác</Text>
      <View style={styles.utilitiesCard}>
        <View style={styles.sectionGrid}>
          {TIEN_ICH_ITEMS.map((item) => (
            <MoreItem key={item.id} item={item} />
          ))}
        </View>
      </View>
    </View>
  );
}
