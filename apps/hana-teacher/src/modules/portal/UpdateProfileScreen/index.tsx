import Form from '@components/shared/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useStates } from '@hooks/useStates';
import { useUpdateProfile } from '@hana/teacher/services/user.service';
import { styles } from './styles';

const UpdateProfileScreen: React.FC = () => {
  const {
    authStore: { user },
  } = useStates();
  const router = useRouter();
  const { mutate: onUpdateProfile, isPending } = useUpdateProfile(() => {
    router.back();
  });

  const fnbSchema = z.object({
    full_name: z
      .string('Vui lòng nhập họ và tên')
      .min(6, 'Họ tên phải có ít nhất 6 ký tự'),
    phone: z
      .string('Vui lòng nhập số điện thoại')
      .regex(/^[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
    address: z.string().nullable(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng phải là YYYY-MM-DD')
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, 'Ngày tháng không hợp lệ'),
  });

  const methods = useForm({
    resolver: zodResolver(fnbSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!user) return;
    methods.reset({ ...methods.getValues(), ...user });
  }, [user]);

  const handleSave = (data: any) => {
    onUpdateProfile({ ...data });
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerIcon}
          >
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Chỉnh sửa thông tin</Text>
          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={styles.headerIcon}
          >
            <Icon source="home" size={24} color="#4c5768" />
          </TouchableOpacity>
        </View>
        <Form methods={methods}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Form.Input
              name="full_name"
              label="Họ tên"
              placeholder="Vui lòng nhập Họ và Tên"
            />
            <Form.Input
              name="phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
            <Form.Input
              name="address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
            />
            <Form.DateTime name="dob" label="Ngày sinh" />
            <View style={[styles.footer]}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={methods.handleSubmit(handleSave)}
              >
                <Text style={styles.saveButtonText}>XÁC NHẬN</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Form>
      </SafeAreaView>
    </View>
  );
};
export default UpdateProfileScreen;
