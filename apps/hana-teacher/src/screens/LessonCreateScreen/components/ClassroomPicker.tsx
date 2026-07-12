import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ClassroomOption } from '../types';
import { styles } from '../styles';

interface Props {
  classrooms: ClassroomOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ClassroomPicker({ classrooms, selectedId, onSelect }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Chọn lớp học</Text>
      <Text style={styles.hintText}>Chỉ hiển thị các lớp đang sử dụng giáo án này.</Text>

      {classrooms.length === 0 ? (
        <View style={{ alignItems: 'center', gap: 8, paddingVertical: 12 }}>
          <Icon source="google-classroom" size={26} color="#CBD5E1" />
          <Text style={styles.emptyText}>Chưa có lớp học nào sử dụng giáo án này</Text>
        </View>
      ) : (
        classrooms.map((c) => {
          const active = c.id === selectedId;
          const meta = [c.courseName, c.startDate && `Từ ${c.startDate}`].filter(Boolean).join(' • ');
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.classroomRow, active && styles.classroomRowActive]}
              onPress={() => onSelect(c.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                {active && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.classroomName}>{c.name}</Text>
                {!!meta && <Text style={styles.classroomMeta}>{meta}</Text>}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}
