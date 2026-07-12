import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { AssignmentService } from '@tera/modules/education';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { AssignmentCreateForm } from './types';
import { hasAssignmentScope, toAssignPayload, toBasePayload } from './_utils';
import AssignmentInfoSection from './components/AssignmentInfoSection';
import DueDateSection from './components/DueDateSection';
import ScopeSection from './components/ScopeSection';
import SubmissionOptionsSection from './components/SubmissionOptionsSection';

export default function AssignmentCreateScreen() {
  const router = useRouter();
  const form = useForm<AssignmentCreateForm>({ defaultValues: DEFAULT_FORM_VALUES });
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: createAssignment } = AssignmentService.useAssignmentCreate();
  const { mutateAsync: updateAssignment } = AssignmentService.useAssignmentUpdate();

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setSubmitting(true);
      try {
        const res: any = await createAssignment({ params: toBasePayload(values) });
        const newId = res?.data?.id;

        if (newId && hasAssignmentScope(values)) {
          await updateAssignment({ id: newId, params: toAssignPayload(values) });
        }

        Toast.show({ type: 'success', text1: 'Tạo bài tập thành công' });
        router.back();
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: err?.msg ?? err?.message ?? 'Không thể tạo bài tập',
        });
      } finally {
        setSubmitting(false);
      }
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin bài tập' });
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
          <Text style={styles.headerTitle}>Tạo bài tập mới</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AssignmentInfoSection form={form} />
        <DueDateSection form={form} />
        <ScopeSection form={form} />
        <SubmissionOptionsSection form={form} />
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
          Lưu
        </Button>
      </View>
    </View>
  );
}
