import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { StudentService } from '@tera/modules/education';
import { useStates } from '@hooks/useStates';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { StudentFormValues } from './types';
import StudentInfoSection from './components/StudentInfoSection';
import ContactSection from './components/ContactSection';
import ParentSection from './components/ParentSection';

export default function StudentCreateScreen() {
  const router = useRouter();
  const { authStore } = useStates();
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const isEdit = !!studentId;

  const form = useForm<StudentFormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const detailQuery = StudentService.useStudentDetail({ id: studentId ?? '' });
  const editingStudent = isEdit ? detailQuery.data?.data?.student : null;

  useEffect(() => {
    if (!isEdit || !editingStudent?.id) return;
    const parent = editingStudent.parents?.[0];
    form.reset({
      name: editingStudent.name ?? '',
      dob: editingStudent.dob ?? '',
      gender: editingStudent.gender ?? 'male',
      email: editingStudent.email ?? '',
      phone: editingStudent.phone ?? '',
      parent_name: parent?.name ?? '',
      parent_phone: parent?.phone ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingStudent?.id]);

  const { mutate: upsertStudent, isPending: isSubmitting } = StudentService.useUpsertStudent();

  const handleSubmit = form.handleSubmit(
    (values) => {
      const parents =
        values.parent_name || values.parent_phone
          ? [{ name: values.parent_name || undefined, phone: values.parent_phone || undefined }]
          : undefined;

      const params: Record<string, unknown> = {
        name: values.name,
        dob: values.dob,
        gender: values.gender,
        email: values.email || undefined,
        phone: values.phone || undefined,
        parents,
      };

      if (!isEdit) {
        const businessId = Number((authStore.user as any)?.business_id);
        const branchId = Number((authStore.user as any)?.branch_id);
        params.business_id = businessId;
        params.branch_id = branchId;
        params.enrollment_date = new Date().toISOString().slice(0, 10);
      }

      upsertStudent(
        { id: isEdit ? Number(studentId) : undefined, params } as any,
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: isEdit ? 'Cập nhật học viên thành công' : 'Thêm học viên thành công',
            });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? (isEdit ? 'Không thể cập nhật học viên' : 'Không thể thêm học viên'),
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin học viên' });
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
          <Text style={styles.headerTitle}>{isEdit ? 'Sửa học viên' : 'Thêm học viên'}</Text>
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
            <StudentInfoSection form={form} />
            <ContactSection form={form} />
            <ParentSection form={form} />
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
