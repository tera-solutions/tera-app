import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, Searchbar, Text, TouchableRipple } from 'react-native-paper';

import { ClassRoomService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { styles } from '../styles';
import type { ClassRoomResponse, EnrollmentClassroom } from '../types';
import { toEnrollmentClassroom } from '../_utils';

interface StepSelectClassProps {
  selectedClass: EnrollmentClassroom | null;
  /** Pre-select a class when arriving from a class-scoped entry point (e.g. Student list). */
  initialClassId?: number;
  onNext: (classroom: EnrollmentClassroom) => void;
}

const StepSelectClass = ({ selectedClass, initialClassId, onNext }: StepSelectClassProps) => {
  const [search, setSearch] = useState('');
  const [pickedId, setPickedId] = useState<number | null>(
    selectedClass?.id ?? initialClassId ?? null,
  );

  const { data, isLoading } = ClassRoomService.useClassRoomList({
    params: { per_page: 50, filters: { status: 'active' } },
  });
  const { items } = getListData<ClassRoomResponse>(data);
  const classes = useMemo(() => items.map(toEnrollmentClassroom), [items]);

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const picked = classes.find((c) => c.id === pickedId) ?? null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Chọn lớp học</Text>

      <Searchbar
        placeholder="Tìm lớp học..."
        value={search}
        onChangeText={setSearch}
        style={[styles.input, { marginBottom: 12 }]}
        inputStyle={{ minHeight: 0 }}
      />

      {!isLoading && filtered.length === 0 && (
        <Text style={styles.emptyStateText}>Không có lớp học phù hợp</Text>
      )}

      {filtered.map((classroom) => {
        const isFull = classroom.studentCount >= classroom.maxStudents && classroom.maxStudents > 0;
        const isActive = pickedId === classroom.id;
        return (
          <TouchableRipple
            key={classroom.id}
            disabled={isFull}
            onPress={() => setPickedId(classroom.id)}
            style={[
              styles.radioCard,
              isActive && styles.radioCardActive,
              isFull && styles.radioCardDisabled,
            ]}
          >
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.radioDot, isActive && styles.radioDotActive]}>
                  {isActive && <View style={styles.radioDotInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioTitle} numberOfLines={1}>
                    {classroom.name}
                  </Text>
                  <Text style={styles.radioSubtitle} numberOfLines={1}>
                    {classroom.scheduleDays || 'Chưa xếp lịch'}
                    {classroom.room ? ` — ${classroom.room}` : ''}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon source="account-group-outline" size={14} color="#64748B" />
                  <Text style={styles.radioMeta}>
                    {classroom.studentCount}/{classroom.maxStudents || '—'}
                  </Text>
                </View>
                {isFull && (
                  <View style={styles.badgeFull}>
                    <Text style={styles.badgeFullText}>Đầy</Text>
                  </View>
                )}
              </View>
            </>
          </TouchableRipple>
        );
      })}

      <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
        <Button
          mode="contained"
          disabled={!picked}
          onPress={() => picked && onNext(picked)}
          style={styles.btnSubmit}
        >
          Tiếp theo
        </Button>
      </View>
    </View>
  );
};

export default StepSelectClass;
