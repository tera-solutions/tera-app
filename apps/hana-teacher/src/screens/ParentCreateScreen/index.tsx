import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { ParentService, ParentStudentService } from '@tera/modules/crm';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { ParentCreateForm } from './types';
import ParentInfoSection from './components/ParentInfoSection';
import RelationSection from './components/RelationSection';
import StudentSection from './components/StudentSection';

export default function ParentCreateScreen() {
  const router = useRouter();
  const form = useForm<ParentCreateForm>({ defaultValues: DEFAULT_FORM_VALUES });
  const [submitting, setSubmitting] = useState(false);

  const { mutate: createParent } = ParentService.useParentCreate();
  const { mutate: linkStudent } = ParentStudentService.useParentStudentCreate();

  const handleSubmit = form.handleSubmit(
    (values) => {
      setSubmitting(true);
      createParent(
        { params: { name: values.name, phone: values.phone, email: values.email } },
        {
          onSuccess: (res: any) => {
            const parentId = res?.data?.id;
            if (parentId && values.student_id) {
              linkStudent(
                {
                  params: {
                    parent_id: parentId,
                    student_id: values.student_id,
                    relation: values.relation,
                  },
                },
                {
                  onError: (error: any) => {
                    Toast.show({
                      type: 'error',
                      text1: error?.msg ?? error?.message ?? 'Không thể liên kết học viên',
                    });
                  },
                },
              );
            }
            setSubmitting(false);
            Toast.show({ type: 'success', text1: 'Thêm phụ huynh thành công' });
            router.back();
          },
          onError: (error: any) => {
            setSubmitting(false);
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? 'Không thể thêm phụ huynh',
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin phụ huynh' });
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
          <Text style={styles.headerTitle}>Thêm phụ huynh</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ParentInfoSection form={form} />
        <RelationSection form={form} />
        <StudentSection form={form} />
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
