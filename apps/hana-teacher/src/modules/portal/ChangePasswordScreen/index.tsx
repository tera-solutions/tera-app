import Form from '@components/shared/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useStates } from '@hooks/useStates';
import { useChangePassword } from '@hana/teacher/services/user.service';

import { useRouter } from 'expo-router';
import { styles } from './styles';

// --- Màn hình chính ChangePasswordScreen ---
const ChangePasswordScreen: React.FC = () => {
  const {
    authStore: { user },
  } = useStates();
  const router = useRouter();

  const { mutate: onChangePassword, isPending } = useChangePassword();

  const fnbSchema = z
    .object({
      old_password: z.string('Vui lòng nhập mật khẩu cũ'),
      new_password: z
        .string('Vui lòng nhập mật khẩu mới')
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
      // .regex(/[a-zA-Z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ cái' })
      // .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ số' })
      // .regex(/[^a-zA-Z0-9]/, {
      //   message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
      // }),
      confirmed_password: z.string('Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.new_password === data.confirmed_password, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmed_password'],
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
    onChangePassword({ ...data });
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerIcon}
          >
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Đổi mật khẩu</Text>
          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={styles.headerIcon}
          >
            <Icon source="home" size={24} color="#4c5768" />
          </TouchableOpacity>
        </View>
        <Form methods={methods}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Form.InputPassword
              name="old_password"
              label="Mật khẩu cũ"
              placeholder="Vui lòng nhập Mật khẩu cũ"
            />
            <Form.InputPassword
              name="new_password"
              label="Mật khẩu mới"
              placeholder="Vui lòng nhập Mật khẩu mới"
            />
            <Form.InputPassword
              name="confirmed_password"
              label="Xác nhận lại mật khẩu"
              placeholder="Vui lòng xác nhận lại mật khẩu"
            />
            {/* LƯU Ý VỀ CHÍNH SÁCH MẬT KHẨU (Dựa trên a62.jpg) */}
            <View style={styles.noteContainer}>
              <View style={styles.noteHeader}>
                <View style={{ marginRight: 5 }}>
                  <Icon
                    source="alert-circle-outline"
                    size={20}
                    color="#EF4444"
                  />
                </View>

                <Text style={styles.noteTitle}>Lưu ý:</Text>
              </View>
              <Text style={styles.noteText}>
                - Mật khẩu có độ dài ít nhất 8 ký tự.
              </Text>
              <Text style={styles.noteText}>
                - Chứa ít nhất 1 ký tự số, 1 ký tự chữ và 1 ký tự đặc biệt.
              </Text>
            </View>
          </ScrollView>
          {/* 5. FOOTER */}
          <View style={[styles.footer]}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={methods.handleSubmit(handleSave)}
            >
              <Text style={styles.saveButtonText}>XÁC NHẬN</Text>
            </TouchableOpacity>
          </View>
        </Form>
      </SafeAreaView>
    </View>
  );
};
export default ChangePasswordScreen;
