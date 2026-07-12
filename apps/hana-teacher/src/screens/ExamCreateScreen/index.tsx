import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { ExamService } from '@tera/modules/education';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { ExamCreateForm } from './types';
import ExamInfoSection from './components/ExamInfoSection';
import ScoreSection from './components/ScoreSection';
import ScopeSection from './components/ScopeSection';

export default function ExamCreateScreen() {
  const router = useRouter();
  const { examId } = useLocalSearchParams<{ examId?: string }>();
  const isEdit = !!examId;

  const form = useForm<ExamCreateForm>({ defaultValues: DEFAULT_FORM_VALUES });

  const detailQuery = ExamService.useExamDetail({ id: examId ?? '' });
  const editingExam = isEdit ? detailQuery.data?.data : null;

  useEffect(() => {
    if (!isEdit || !editingExam?.id) return;
    form.reset({
      exam_name: editingExam.exam_name ?? '',
      exam_type: editingExam.exam_type ?? 'final',
      course_id: editingExam.course_id ?? editingExam.course?.id ?? null,
      course_name: editingExam.course?.name ?? '',
      level_id: editingExam.level_id ?? editingExam.level?.id ?? null,
      level_name: editingExam.level?.level_name ?? '',
      // API returns decimal columns (duration, total_score, passing_score) as strings.
      duration: Number(editingExam.duration ?? 0),
      total_score: Number(editingExam.total_score ?? 0),
      passing_score: Number(editingExam.passing_score ?? 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingExam?.id]);

  const { mutate: createExam, isPending: isCreating } = ExamService.useExamCreate();
  const { mutate: updateExam, isPending: isUpdating } = ExamService.useExamUpdate();
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = form.handleSubmit(
    (values) => {
      const payload = {
        exam_name: values.exam_name,
        exam_type: values.exam_type,
        course_id: values.course_id,
        level_id: values.level_id,
        duration: values.duration,
        total_score: values.total_score,
        passing_score: values.passing_score,
      };

      if (isEdit) {
        updateExam(
          { id: examId, params: payload },
          {
            onSuccess: () => {
              Toast.show({ type: 'success', text1: 'Cập nhật bài kiểm tra thành công' });
              router.back();
            },
            onError: (error: any) => {
              Toast.show({
                type: 'error',
                text1: error?.msg ?? error?.message ?? 'Không thể cập nhật bài kiểm tra',
              });
            },
          },
        );
        return;
      }

      createExam(
        { params: payload },
        {
          onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Tạo bài kiểm tra thành công' });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? 'Không thể tạo bài kiểm tra',
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin bài kiểm tra' });
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
          <Text style={styles.headerTitle}>{isEdit ? 'Sửa bài kiểm tra' : 'Tạo bài kiểm tra'}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {isEdit && detailQuery.isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ExamInfoSection form={form} />
            <ScoreSection form={form} />
            <ScopeSection form={form} />
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.bottomBarBtn}
              textColor="#64748B"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={[styles.bottomBarBtn, styles.btnSubmit]}
            >
              Lưu
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
