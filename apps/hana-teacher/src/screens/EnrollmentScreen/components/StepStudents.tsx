import React, { useState } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';
import { DateTime } from '@components/ui/DateTime';

import { StudentService } from '@tera/modules/education';
import AsyncPickerField, { AsyncPickerOption } from '@components/common/AsyncPickerField';

import { styles } from '../styles';
import { GENDER_OPTIONS } from '../constants';
import type { EnrollmentDraftStudent, EnrollmentDraftStudentNew } from '../types';

interface StepStudentsProps {
  classroomName: string;
  students: EnrollmentDraftStudent[];
  onChange: (students: EnrollmentDraftStudent[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const NEW_STUDENT_DEFAULTS: Omit<EnrollmentDraftStudentNew, 'mode' | 'key'> = {
  name: '',
  dob: '',
  gender: 'male',
  email: '',
  phone: '',
  parent_name: '',
  parent_phone: '',
};

const studentToOption = (student: any): AsyncPickerOption => ({
  value: student.id,
  label: `${student.name}${student.code ? ` (${student.code})` : ''}`,
});

const StepStudents = ({ classroomName, students, onChange, onBack, onNext }: StepStudentsProps) => {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [existingId, setExistingId] = useState<number | undefined>(undefined);
  const [existingLabel, setExistingLabel] = useState<string | undefined>(undefined);

  const { control, handleSubmit, reset } = useForm<typeof NEW_STUDENT_DEFAULTS>({
    defaultValues: NEW_STUDENT_DEFAULTS,
  });

  const existingStudentQuery = StudentService.useStudentDetail(
    { id: existingId ?? '' },
    { enabled: !!existingId },
  );

  const handleAddNew = (values: typeof NEW_STUDENT_DEFAULTS) => {
    onChange([...students, { mode: 'new', key: `new-${Date.now()}`, ...values }]);
    reset(NEW_STUDENT_DEFAULTS);
  };

  const handleAddExisting = () => {
    const student: any = (existingStudentQuery.data as any)?.data?.student;
    if (!existingId) return;
    onChange([
      ...students,
      {
        mode: 'existing',
        key: `existing-${existingId}`,
        student_id: existingId,
        name: student?.name ?? existingLabel ?? `#${existingId}`,
        dob: student?.dob ?? '',
        email: student?.email ?? '',
      },
    ]);
    setExistingId(undefined);
    setExistingLabel(undefined);
  };

  const handleRemove = (key: string) => onChange(students.filter((s) => s.key !== key));

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Học viên</Text>

      <View style={[styles.chipRow, { marginBottom: 12 }]}>
        {(['new', 'existing'] as const).map((m) => {
          const active = mode === m;
          return (
            <TouchableRipple
              key={m}
              onPress={() => setMode(m)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {m === 'new' ? 'Học viên mới' : 'Học viên đã có'}
              </Text>
            </TouchableRipple>
          );
        })}
      </View>

      {mode === 'new' ? (
        <>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Họ tên học viên <Text style={styles.requiredMark}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Vui lòng nhập tên học viên' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="VD: Nguyễn Minh An"
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Ngày sinh <Text style={styles.requiredMark}>*</Text>
            </Text>
            <Controller
              control={control}
              name="dob"
              rules={{ required: 'Vui lòng nhập ngày sinh' }}
              render={({ field: { onChange, value } }) => (
                <DateTime value={value} onChange={(v) => onChange(v ?? '')} />
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Giới tính</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={styles.chipRow}>
                  {GENDER_OPTIONS.map((option) => {
                    const active = value === option.value;
                    return (
                      <TouchableRipple
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {option.label}
                        </Text>
                      </TouchableRipple>
                    );
                  })}
                </View>
              )}
            />
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldRowItem}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="email@example.com"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                )}
              />
            </View>
            <View style={styles.fieldRowItem}>
              <Text style={styles.fieldLabel}>Số điện thoại</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="09xxxxxxxx"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldRowItem}>
              <Text style={styles.fieldLabel}>Tên phụ huynh</Text>
              <Controller
                control={control}
                name="parent_name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="VD: Nguyễn Văn B"
                    style={styles.input}
                  />
                )}
              />
            </View>
            <View style={styles.fieldRowItem}>
              <Text style={styles.fieldLabel}>SĐT phụ huynh</Text>
              <Controller
                control={control}
                name="parent_phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="09xxxxxxxx"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                )}
              />
            </View>
          </View>

          <TouchableRipple onPress={handleSubmit(handleAddNew)} style={styles.addStudentBtn}>
            <>
              <Icon source="plus" size={16} color="#64748B" />
              <Text style={styles.addStudentBtnText}>Thêm học viên</Text>
            </>
          </TouchableRipple>
        </>
      ) : (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <AsyncPickerField
              title="Tìm học viên đã có"
              placeholder="Tìm học viên đã có"
              value={existingId ?? null}
              valueLabel={existingLabel}
              useList={StudentService.useStudentList}
              toOption={studentToOption}
              onSelect={(option) => {
                setExistingId(Number(option.value));
                setExistingLabel(option.label);
              }}
            />
          </View>
          <Button mode="outlined" disabled={!existingId} onPress={handleAddExisting}>
            Thêm
          </Button>
        </View>
      )}

      <Text style={[styles.fieldLabel, { marginTop: 20, marginBottom: 8 }]}>
        Danh sách học viên ({students.length}) — Lớp {classroomName}
      </Text>

      {students.length === 0 && (
        <Text style={styles.emptyStateText}>Chưa thêm học viên nào</Text>
      )}

      {students.map((s) => (
        <View key={s.key} style={styles.studentRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.studentRowName}>{s.name || '—'}</Text>
            <Text style={styles.studentRowMeta}>
              {s.dob || 'Chưa có ngày sinh'}
              {s.email ? ` • ${s.email}` : ''}
            </Text>
          </View>
          <IconButton icon="trash-can-outline" size={18} iconColor="#94A3B8" onPress={() => handleRemove(s.key)} />
        </View>
      ))}

      <View style={styles.stepFooterRow}>
        <Button mode="outlined" onPress={onBack} style={styles.stepFooterBtn} textColor="#64748B">
          Quay lại
        </Button>
        <Button
          mode="contained"
          disabled={students.length === 0}
          onPress={onNext}
          style={[styles.stepFooterBtn, styles.btnSubmit]}
        >
          Tiếp theo
        </Button>
      </View>
    </View>
  );
};

export default StepStudents;
