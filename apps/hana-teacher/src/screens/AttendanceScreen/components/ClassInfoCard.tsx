import { Text, View } from 'react-native';

import { styles } from '../style';

export default function ClassInfoCard() {
  return (
    <View style={styles.classCard}>
      <View style={styles.classCode}>
        <Text style={styles.classCodeText}>
          2A
        </Text>
      </View>

      <View style={styles.classInfo}>
        <Text style={styles.className}>
          Lớp Starters 2A
        </Text>

        <Text style={styles.classText}>
          Ca học: 08:00 - 09:30
        </Text>

        <Text style={styles.classText}>
          Phòng 201 • Cơ sở 1
        </Text>
      </View>

      <View>
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>
            Đang diễn ra
          </Text>
        </View>

        <Text style={styles.dateText}>
          15/05/2025
        </Text>
      </View>
    </View>
  );
}