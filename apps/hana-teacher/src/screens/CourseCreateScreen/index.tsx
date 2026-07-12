import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { CourseService } from '@tera/modules/education';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { CourseFormValues } from './types';
import CourseInfoSection from './components/CourseInfoSection';
import CourseDescriptionSection from './components/CourseDescriptionSection';
import CourseStatusSection from './components/CourseStatusSection';

export default function CourseCreateScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const isEdit = !!courseId;

  const form = useForm<CourseFormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const detailQuery = CourseService.useCourseDetail({ id: courseId ?? '' });
  const editingCourse = isEdit ? detailQuery.data?.data?.course ?? detailQuery.data?.data : null;

  useEffect(() => {
    if (!isEdit || !editingCourse?.id) return;
    form.reset({
      name: editingCourse.name ?? '',
      code: editingCourse.code ?? '',
      duration_minutes: editingCourse.duration_minutes != null ? String(editingCourse.duration_minutes) : '',
      price_per_lesson: editingCourse.price_per_lesson != null ? String(editingCourse.price_per_lesson) : '',
      description: editingCourse.description ?? '',
      status: editingCourse.is_active === false ? 'inactive' : 'active',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingCourse?.id]);

  const { mutate: upsertCourse, isPending: isSubmitting } = CourseService.useUpsertCourse();

  const handleSubmit = form.handleSubmit(
    (values) => {
      const params: Record<string, unknown> = {
        name: values.name,
        code: values.code || undefined,
        duration_minutes: Number(values.duration_minutes),
        price_per_lesson: Number(values.price_per_lesson),
        description: values.description || undefined,
        is_active: values.status === 'active',
      };

      upsertCourse(
        { id: isEdit ? Number(courseId) : undefined, params } as any,
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: isEdit ? 'Cập nhật khóa học thành công' : 'Thêm khóa học thành công',
            });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? (isEdit ? 'Không thể cập nhật khóa học' : 'Không thể thêm khóa học'),
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin khóa học' });
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
          <Text style={styles.headerTitle}>{isEdit ? 'Sửa khóa học' : 'Thêm khóa học'}</Text>
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
            <CourseInfoSection form={form} />
            <CourseDescriptionSection form={form} />
            {isEdit && <CourseStatusSection form={form} />}
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
