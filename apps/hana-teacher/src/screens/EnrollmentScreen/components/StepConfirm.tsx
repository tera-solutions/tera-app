import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Icon, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { EnrollmentService, StudentService } from '@tera/modules/education';
import { useStates } from '@hooks/useStates';

import { styles } from '../styles';
import type { EnrollmentClassroom, EnrollmentDraftStudent, EnrollmentPricing, EnrollmentRowResult } from '../types';
import { calcTuitionAmount, formatVnd } from '../_utils';

interface StepConfirmProps {
  classroom: EnrollmentClassroom;
  pricing: EnrollmentPricing;
  students: EnrollmentDraftStudent[];
  onBack: () => void;
}

const StepConfirm = ({ classroom, pricing, students, onBack }: StepConfirmProps) => {
  const router = useRouter();
  const { authStore } = useStates();
  const { mutateAsync: createStudent } = StudentService.useStudentCreate();
  const { mutateAsync: createEnrollment } = EnrollmentService.useEnrollmentCreate();

  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<EnrollmentRowResult[]>([]);

  const tuitionAmount = calcTuitionAmount(pricing);
  const total = tuitionAmount * students.length;

  const handleConfirm = async () => {
    setSubmitting(true);
    const rows: EnrollmentRowResult[] = students.map((s) => ({ key: s.key, name: s.name, status: 'pending' }));
    setResults(rows);

    const businessId = Number((authStore.user as any)?.business_id);
    const branchId = Number((authStore.user as any)?.branch_id);

    let successCount = 0;

    for (const student of students) {
      try {
        let studentId: number;
        if (student.mode === 'existing') {
          studentId = student.student_id;
        } else {
          const res: any = await createStudent({
            params: {
              name: student.name,
              dob: student.dob,
              gender: student.gender,
              email: student.email || undefined,
              phone: student.phone || undefined,
              business_id: businessId,
              branch_id: branchId,
              enrollment_date: new Date().toISOString().slice(0, 10),
              parents:
                student.parent_name || student.parent_phone
                  ? [{ name: student.parent_name, phone: student.parent_phone }]
                  : undefined,
            },
          });
          studentId = res?.data?.id;
        }

        await createEnrollment({
          params: {
            student_id: studentId,
            course_id: classroom.course_id,
            class_id: classroom.id,
            total_lessons: pricing.total_lessons,
            price_per_lesson: pricing.price_per_lesson,
            discount_percent: pricing.discount_percent || undefined,
            bonus_lessons: pricing.bonus_lessons || undefined,
            paid_amount: pricing.paid_amount || undefined,
            payment_method: pricing.payment_method,
            enrolled_at: new Date().toISOString().slice(0, 10),
          },
        });

        successCount += 1;
        setResults((prev) => prev.map((r) => (r.key === student.key ? { ...r, status: 'success' } : r)));
      } catch (error: any) {
        const message = error?.data?.msg ?? error?.message ?? 'Ghi danh thất bại';
        setResults((prev) =>
          prev.map((r) => (r.key === student.key ? { ...r, status: 'error', message } : r)),
        );
      }
    }

    setSubmitting(false);

    if (successCount === students.length) {
      Toast.show({ type: 'success', text1: 'Ghi danh thành công' });
      router.back();
    } else if (successCount > 0) {
      Toast.show({ type: 'error', text1: `Đã ghi danh ${successCount}/${students.length} học viên` });
    } else {
      Toast.show({ type: 'error', text1: 'Ghi danh thất bại' });
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Xác nhận ghi danh</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>Lớp học</Text>
          <Text style={styles.summaryBoxValue} numberOfLines={1}>
            {classroom.name}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>Học phí / học viên</Text>
          <Text style={styles.summaryBoxValue} numberOfLines={1}>
            {pricing.total_lessons} buổi × {formatVnd(pricing.price_per_lesson)}
          </Text>
        </View>
      </View>

      <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>
        Danh sách học viên ({students.length})
      </Text>
      {students.map((s) => {
        const result = results.find((r) => r.key === s.key);
        return (
          <View key={s.key} style={styles.resultRow}>
            <Text style={styles.resultRowName} numberOfLines={1}>
              {s.name}
            </Text>
            {result?.status === 'success' && <Icon source="check-circle" size={18} color="#16A34A" />}
            {result?.status === 'error' && (
              <Text style={styles.resultErrorText} numberOfLines={2}>
                {result.message}
              </Text>
            )}
            {result?.status === 'pending' && submitting && <ActivityIndicator size="small" />}
          </View>
        );
      })}

      <Text style={styles.totalAmount}>
        Tổng thanh toán: <Text style={styles.totalAmountValue}>{formatVnd(total)}</Text>
      </Text>

      <View style={styles.stepFooterRow}>
        <Button mode="outlined" onPress={onBack} disabled={submitting} style={styles.stepFooterBtn} textColor="#64748B">
          Quay lại
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirm}
          loading={submitting}
          disabled={submitting}
          style={[styles.stepFooterBtn, styles.btnSubmit]}
        >
          Xác nhận
        </Button>
      </View>
    </View>
  );
};

export default StepConfirm;
