import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { EvaluationService, StudentService } from '@tera/modules/education';
import AsyncPickerField, { AsyncPickerOption } from '@components/common/AsyncPickerField';
import { TextInput } from '@components/ui';

import { DEFAULT_SKILL_SCORE, SKILL_KEYS, SKILL_LABEL, SkillKey } from '../constants';
import { styles } from '../styles';

interface FormValues {
  student_id: number | null;
  student_name: string;
  skills: Record<SkillKey, number>;
  comment: string;
}

const defaultSkills = SKILL_KEYS.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_SKILL_SCORE }), {} as Record<SkillKey, number>);

const DEFAULT_VALUES: FormValues = {
  student_id: null,
  student_name: '',
  skills: defaultSkills,
  comment: '',
};

interface Props {
  visible: boolean;
  classId: number | null;
  lessonId: number;
  onDismiss: () => void;
}

const studentToOption = (s: any): AsyncPickerOption => ({ value: s.id, label: s.name });

export default function SkillEvaluationModal({ visible, classId, lessonId, onDismiss }: Props) {
  const form = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });
  const { control, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (visible) form.reset(DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const { mutate: createEvaluation, isPending } = EvaluationService.useEvaluationCreate();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onDismiss();
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!values.student_id || !classId) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn học viên' });
      return;
    }

    createEvaluation(
      {
        params: {
          evaluation_type: 'student',
          target_id: values.student_id,
          evaluator_type: 'teacher',
          class_room_id: classId,
          lesson_id: lessonId,
          evaluation_period: 'lesson',
          criteria: SKILL_KEYS.map((key) => ({ criterion: key, score: values.skills[key] })),
          comment: values.comment,
        },
      },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Lưu đánh giá kỹ năng thành công' });
          handleClose();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.msg ?? error?.message ?? 'Không thể lưu đánh giá',
          });
        },
      },
    );
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đánh giá kỹ năng theo bài học</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>Học viên</Text>
              <Controller
                control={control}
                name="student_id"
                rules={{ required: 'Vui lòng chọn học viên' }}
                render={({ field: { onChange, value } }) => (
                  <AsyncPickerField
                    title="Chọn học viên"
                    placeholder="Chọn học viên"
                    value={value}
                    valueLabel={watch('student_name')}
                    disabled={!classId}
                    useList={StudentService.useStudentList}
                    toOption={studentToOption}
                    filters={classId ? { class_id: classId } : undefined}
                    onSelect={(option) => {
                      onChange(Number(option.value));
                      setValue('student_name', option.label);
                    }}
                  />
                )}
              />
              {!!errors.student_id && <Text style={styles.modalErrorText}>{errors.student_id.message}</Text>}
            </View>

            <Text style={[styles.modalFieldLabel, { marginBottom: 10 }]}>Điểm kỹ năng (1-5)</Text>
            {SKILL_KEYS.map((key) => (
              <View key={key} style={styles.skillRow}>
                <Text style={styles.skillRowLabel}>{SKILL_LABEL[key]}</Text>
                <Controller
                  control={control}
                  name={`skills.${key}`}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.scorePicker}>
                      {[1, 2, 3, 4, 5].map((v) => {
                        const active = value === v;
                        return (
                          <TouchableOpacity
                            key={v}
                            style={[styles.scoreDot, active && styles.scoreDotActive]}
                            onPress={() => onChange(v)}
                          >
                            <Text style={[styles.scoreDotText, active && styles.scoreDotTextActive]}>{v}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                />
              </View>
            ))}

            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>Nhận xét</Text>
              <Controller
                control={control}
                name="comment"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nhận xét thêm về kỹ năng của học viên..."
                    style={styles.modalTextarea}
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button mode="outlined" style={styles.modalBtn} onPress={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button
              mode="contained"
              style={[styles.modalBtn, styles.modalBtnSubmit]}
              onPress={handleSubmit}
              loading={isPending}
              disabled={isPending}
            >
              Lưu đánh giá
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
