import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { ChevronDown } from 'lucide-react-native';

import { styles } from '../style';
import type { AttendanceClassInfo, ClassSession } from '../types';

interface ClassInfoCardProps {
  classInfo?: AttendanceClassInfo;
  session?: ClassSession;
  sessions: ClassSession[];
  onChangeSession: (id: number) => void;
  loading?: boolean;
}

export default function ClassInfoCard({
  classInfo,
  session,
  sessions,
  onChangeSession,
  loading,
}: ClassInfoCardProps) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const code = (classInfo?.name || '—').trim().slice(0, 2).toUpperCase();

  return (
    <View style={styles.classCard}>
      <View style={styles.classCode}>
        <Text style={styles.classCodeText}>{code}</Text>
      </View>

      <View style={styles.classInfo}>
        <Text style={styles.className} numberOfLines={1}>
          {loading ? 'Đang tải...' : classInfo?.name || 'Chưa chọn lớp'}
        </Text>

        <Text style={styles.classText} numberOfLines={1}>
          {session ? `${session.startTime} - ${session.endTime}` : 'Chưa có buổi học'}
        </Text>

        {!!classInfo && (
          <Text style={styles.classText} numberOfLines={1}>
            {classInfo.room || 'Chưa xếp phòng'}
            {classInfo.branch ? ` • ${classInfo.branch}` : ''}
          </Text>
        )}
      </View>

      <View>
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>{session?.name || 'Buổi học'}</Text>
        </View>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 10 }}
          disabled={sessions.length === 0}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.dateText}>{session?.date || '—'}</Text>
          <ChevronDown size={12} color="#64748B" />
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={pickerVisible}
          onDismiss={() => setPickerVisible(false)}
          contentContainerStyle={{
            backgroundColor: '#FFF',
            marginHorizontal: 16,
            borderRadius: 16,
            maxHeight: '70%',
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 10 }}>
            Đổi buổi học
          </Text>
          <FlatList
            data={sessions}
            keyExtractor={(item) => String(item.id)}
            style={{ maxHeight: 320 }}
            renderItem={({ item }) => {
              const active = item.id === session?.id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onChangeSession(item.id);
                    setPickerVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: active ? '700' : '400',
                      color: active ? '#007AFF' : '#0F172A',
                    }}
                  >
                    {item.name} — {item.date}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Modal>
      </Portal>
    </View>
  );
}
