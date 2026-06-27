import { CheckCircle2, Clock3, Users, XCircle } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../style';

interface Props {
  attended?: number;
  total?: number;
}

export default function AttendanceActionBar({ attended = 0, total = 0 }: Props) {
  return (
    <View style={styles.actionBar}>
      <View style={styles.summaryBox}>
        <Users color="#0066cc" size={32} />
        <Text style={styles.summaryText}>Đã điểm danh</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text
            style={[
              styles.summaryText,
              { color: '#0066cc', fontSize: 20, fontWeight: 700 },
            ]}
          >
            {attended}
          </Text>
          <Text style={[styles.summaryText, { color: '#0066cc', fontSize: 12 }]}>
            /{total}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.presentBtn}>
        <CheckCircle2 color="#fff" />
        <Text style={styles.actionText}>Điểm danh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.lateBtn}>
        <Clock3 color="#fff" />
        <Text style={styles.actionText}>Đi muộn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.absentBtn}>
        <XCircle color="#fff" />
        <Text style={styles.actionText}>Vắng mặt</Text>
      </TouchableOpacity>
    </View>
  );
}
