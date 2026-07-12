import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { StudentDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  student: StudentDetail;
}

export default function InfoTab({ student }: Props) {
  const rows: { label: string; value: string }[] = [
    { label: 'Email', value: student.email || '—' },
    { label: 'Điện thoại', value: student.phone || '—' },
    { label: 'Địa chỉ', value: student.address || '—' },
    { label: 'Ngày ghi danh', value: student.enrolledAt || '—' },
  ];

  return (
    <>
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionTitleLeft}>
            <Icon source="information-outline" size={20} color="#0066CC" />
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          </View>
        </View>

        {rows.map((row) => (
          <View key={row.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}

        {!!student.note && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ghi chú</Text>
            <Text style={styles.infoValue}>{student.note}</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionTitleLeft}>
            <Icon source="account-heart-outline" size={20} color="#0066CC" />
            <Text style={styles.sectionTitle}>Phụ huynh</Text>
          </View>
        </View>

        {student.parents.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Chưa có thông tin phụ huynh</Text>
          </View>
        ) : (
          student.parents.map((p) => (
            <View key={p.id} style={styles.parentCard}>
              <Text style={styles.parentName}>
                {p.name || '—'}
                {p.relation ? ` (${p.relation})` : ''}
              </Text>
              {!!p.phone && <Text style={styles.parentMeta}>{p.phone}</Text>}
              {!!p.email && <Text style={styles.parentMeta}>{p.email}</Text>}
            </View>
          ))
        )}
      </View>
    </>
  );
}
