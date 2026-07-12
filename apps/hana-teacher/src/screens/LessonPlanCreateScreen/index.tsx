import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { LessonPlanService, LessonPlanLessonService } from '@tera/modules/education';

import { styles } from './styles';
import { LessonTemplateForm, PlanInfoForm } from './types';
import { toTemplateParams } from './_utils';
import PlanInfoSection from './components/PlanInfoSection';
import LessonTemplatesSection from './components/LessonTemplatesSection';

const EMPTY_PLAN: PlanInfoForm = {
  plan_code: '',
  plan_name: '',
  course_id: null,
  course_name: '',
  level_id: null,
  level_name: '',
  description: '',
};

export default function LessonPlanCreateScreen() {
  const router = useRouter();
  const form = useForm<PlanInfoForm>({ defaultValues: EMPTY_PLAN });
  const [templates, setTemplates] = useState<LessonTemplateForm[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: upsertPlan } = LessonPlanService.useUpsertLessonPlan();
  const { mutateAsync: createLesson } = LessonPlanLessonService.useLessonPlanLessonCreate();

  const handleSubmit = form.handleSubmit(
    async (planInfo) => {
      setSubmitting(true);
      try {
        const planRes: any = await upsertPlan({
          id: undefined,
          params: {
            plan_code: planInfo.plan_code.trim(),
            plan_name: planInfo.plan_name.trim(),
            course_id: planInfo.course_id,
            level_id: planInfo.level_id || undefined,
            description: planInfo.description.trim() || '',
          },
        } as any);
        const planId = Number(planRes?.data?.id);

        for (const template of templates) {
          await createLesson({ id: planId, params: toTemplateParams(template) });
        }

        Toast.show({
          type: 'success',
          text1: 'Tạo giáo án thành công',
          text2: 'Giáo án đang chờ quản trị viên xét duyệt và xuất bản.',
        });
        router.back();
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: err?.msg ?? err?.message ?? 'Tạo giáo án thất bại',
        });
      } finally {
        setSubmitting(false);
      }
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin giáo án' });
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
          <Text style={styles.headerTitle}>Tạo giáo án</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PlanInfoSection form={form} />
          <LessonTemplatesSection templates={templates} onChange={setTemplates} />
          <Text style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
            Giáo án sẽ được lưu ở trạng thái nháp. Quản trị viên sẽ xem xét và xuất bản.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

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
          Lưu nháp
        </Button>
      </View>
    </View>
  );
}
