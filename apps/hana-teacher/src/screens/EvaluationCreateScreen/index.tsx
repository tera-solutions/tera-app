import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { EvaluationService } from '@tera/modules/education';

import { styles } from './styles';
import { CRITERION_KEYS, DEFAULT_CRITERIA } from './constants';
import type { EvaluationCreateForm } from './types';
import CriteriaSection from './components/CriteriaSection';
import PeriodSection from './components/PeriodSection';
import CommentSection from './components/CommentSection';

export default function EvaluationCreateScreen() {
  const router = useRouter();
  const { studentId, studentName, classId } = useLocalSearchParams<{
    studentId?: string;
    studentName?: string;
    classId?: string;
  }>();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EvaluationCreateForm>({
    defaultValues: { criteria: DEFAULT_CRITERIA, comment: '', evaluation_period: 'session' },
  });

  const { mutate: createEvaluation } = EvaluationService.useEvaluationCreate();

  const canSubmit = !!studentId && !!classId;

  const handleSubmit = form.handleSubmit(
    (values) => {
      if (!canSubmit) {
        Toast.show({ type: 'error', text1: 'Học viên chưa thuộc lớp bạn phụ trách, không thể nhận xét' });
        return;
      }

      setSubmitting(true);
      createEvaluation(
        {
          params: {
            evaluation_type: 'student',
            target_id: Number(studentId),
            evaluator_type: 'teacher',
            class_room_id: Number(classId),
            evaluation_period: values.evaluation_period,
            criteria: CRITERION_KEYS.map((key) => ({ criterion: key, score: values.criteria[key] })),
            comment: values.comment,
          },
        },
        {
          onSuccess: () => {
            setSubmitting(false);
            Toast.show({ type: 'success', text1: 'Thêm nhận xét thành công' });
            router.back();
          },
          onError: (error: any) => {
            setSubmitting(false);
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? 'Không thể lưu nhận xét',
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin nhận xét' });
    },
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {studentName ? `Thêm nhận xét — ${studentName}` : 'Thêm nhận xét'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CriteriaSection form={form} />
        <PeriodSection form={form} />
        <CommentSection form={form} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={submitting}
          style={styles.bottomBarBtn}
          textColor="#64748B"
        >
          Hủy
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={[styles.bottomBarBtn, styles.btnSubmit]}
        >
          Lưu nhận xét
        </Button>
      </View>
    </View>
  );
}
