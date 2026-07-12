import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { LessonService } from '@tera/modules/education';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { LessonUpdateFormValues } from './types';
import LessonInfoSection from './components/LessonInfoSection';
import ContentSection from './components/ContentSection';
import ActivityHomeworkSection from './components/ActivityHomeworkSection';

export default function LessonUpdateScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const id = lessonId ? Number(lessonId) : undefined;

  const form = useForm<LessonUpdateFormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const detailQuery = LessonService.useLessonDetail({ id: id ?? '' });
  const raw = detailQuery.data?.data?.lesson ?? detailQuery.data?.data;

  useEffect(() => {
    if (!raw?.id) return;
    form.reset({
      lesson_title: raw.lesson_title ?? '',
      room_id: raw.room_id ?? raw.room?.id ?? null,
      room_name: raw.room?.name ?? '',
      objective: raw.objective ?? '',
      vocabulary: raw.vocabulary ?? '',
      grammar: raw.grammar ?? '',
      activities: typeof raw.activities === 'string' ? raw.activities : '',
      homework: raw.homework ?? '',
      lesson_note: raw.lesson_note ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw?.id]);

  const { mutate: updateLesson, isPending: isSubmitting } = LessonService.useLessonUpdate();

  const handleSubmit = form.handleSubmit(
    (values) => {
      if (!id) return;
      updateLesson(
        {
          id,
          params: {
            lesson_title: values.lesson_title,
            room_id: values.room_id ?? undefined,
            objective: values.objective || undefined,
            vocabulary: values.vocabulary || undefined,
            grammar: values.grammar || undefined,
            activities: values.activities || undefined,
            homework: values.homework || undefined,
            lesson_note: values.lesson_note || undefined,
          },
        },
        {
          onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Cập nhật bài học thành công' });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? 'Không thể cập nhật bài học',
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin bài học' });
    },
  );

  const notFound = !id || (!detailQuery.isLoading && (detailQuery.isError || !raw?.id));

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
          <Text style={styles.headerTitle}>Cập nhật bài học</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {notFound ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không tìm thấy bài học</Text>
        </View>
      ) : detailQuery.isLoading || !raw?.id ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <LessonInfoSection form={form} />
            <ContentSection form={form} />
            <ActivityHomeworkSection form={form} />
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
