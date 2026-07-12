import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { MOCK_STUDENT_CONTACTS } from '../../constants';
import { styles } from '../../styles';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export default function StudentsTab() {
  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabCardTitle}>Liên hệ phụ huynh</Text>
      <Text style={styles.tabCardHint}>
        Dữ liệu minh họa — quản lý liên hệ phụ huynh theo bài kiểm tra chưa được tích hợp API.
      </Text>

      {MOCK_STUDENT_CONTACTS.map((c) => (
        <View key={c.id} style={styles.studentListRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initialOf(c.name)}</Text>
          </View>
          <View style={styles.studentListInfo}>
            <Text style={styles.studentListName}>{c.name}</Text>
            <Text style={styles.studentListCode}>
              {c.parentName} • {c.parentPhone}
            </Text>
          </View>
          <TouchableOpacity style={styles.actionBtnIcon}>
            <Icon source="phone-outline" size={18} color="#0066CC" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
