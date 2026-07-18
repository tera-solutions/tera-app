import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Checkbox, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';

import colors from '@tera/commons/constants/colors';
import { Button, InputPassword, TextInput } from '@components/ui';
import { useRegister } from '@hana/teacher/services/auth.service';

import { styles } from './style';

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  subject: string;
  school: string;
}

const REGISTER_APP_ID = 2;

const RegisterScreen = observer(() => {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeError, setAgreeError] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      subject: '',
      school: '',
    },
  });

  const { mutate, isPending } = useRegister(() => {
    router.replace('/auth/login');
  });

  const toggleAgreeTerms = () => {
    setAgreeTerms((prev) => !prev);
    setAgreeError(undefined);
  };

  const onSubmit = (data: RegisterFormValues) => {
    if (isPending) return;
    if (!agreeTerms) {
      setAgreeError('Vui lòng đồng ý với điều khoản');
      return;
    }

    mutate({
      full_name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      password: data.password,
      password_confirmation: data.confirmPassword,
      school: data.school.trim(),
      subject: data.subject.trim(),
      app_id: REGISTER_APP_ID,
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <Image
        source={require('@tera/assets/app/element_107.png')}
        style={styles.screenBackground}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon source="chevron-left" size={24} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.illustration}>
          <Image
            source={require('@tera/assets/images/logo_teacher_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Image
            source={require('@tera/assets/app/element_108.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.card}>
        <KeyboardAvoidingView
          style={[styles.flex, { zIndex: 10 }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Đăng ký tài khoản</Text>
            <Text style={styles.subtitle}>
              Tạo tài khoản để quản lý lớp học và đồng hành cùng học viên
            </Text>

            <View style={styles.sectionTitle}>
              <Icon
                source="account-circle-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionTitleText}>Thông tin tài khoản</Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập họ và tên',
                  minLength: {
                    value: 2,
                    message: 'Họ và tên tối thiểu 2 ký tự',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="account-outline"
                    placeholder="Họ và tên"
                    autoComplete="name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="fullName"
              />
              {errors.fullName && (
                <Text style={styles.error}>{errors.fullName.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="email-outline"
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^0\d{9}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="phone-outline"
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={styles.error}>{errors.phone.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Mật khẩu không được để trống',
                  minLength: {
                    value: 8,
                    message: 'Mật khẩu tối thiểu 8 ký tự',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    leftIcon="lock-outline"
                    placeholder="Mật khẩu"
                    autoComplete="password-new"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value) =>
                    value === watch('password') ||
                    'Mật khẩu xác nhận không khớp',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    leftIcon="lock-outline"
                    placeholder="Xác nhận mật khẩu"
                    autoComplete="password-new"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <Text style={styles.error}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            <View style={styles.sectionTitle}>
              <Icon
                source="school-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionTitleText}>Thông tin giảng dạy</Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập bộ môn giảng dạy',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="book-open-variant"
                    placeholder="Bộ môn giảng dạy"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="subject"
              />
              {errors.subject && (
                <Text style={styles.error}>{errors.subject.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập trường / trung tâm công tác',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="office-building-outline"
                    placeholder="Trường / Trung tâm công tác"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="school"
              />
              {errors.school && (
                <Text style={styles.error}>{errors.school.message}</Text>
              )}
            </View>

            <View style={styles.termsRow}>
              <Checkbox
                status={agreeTerms ? 'checked' : 'unchecked'}
                onPress={toggleAgreeTerms}
                color={colors.primary}
              />
              <Text style={styles.termsText} onPress={toggleAgreeTerms}>
                Tôi đồng ý với{' '}
                {/* Route /policy/terms chưa được scaffold trong app */}
                <Text style={styles.termsLink}>Điều khoản sử dụng</Text> và{' '}
                {/* Route /policy/privacy chưa được scaffold trong app */}
                <Text style={styles.termsLink}>Chính sách bảo mật</Text>
              </Text>
            </View>
            {agreeError && <Text style={styles.error}>{agreeError}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              style={styles.submitButton}
            >
              Đăng ký
            </Button>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng ký với</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              {/* TODO(OAuth): nối Google OAuth khi có route/infra tương ứng */}
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="google" size={18} color={colors.textPrimary} />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              {/* TODO(OAuth): nối Microsoft OAuth khi có route/infra tương ứng */}
              <TouchableOpacity style={styles.socialButton}>
                <Icon
                  source="microsoft"
                  size={18}
                  color={colors.textPrimary}
                />
                <Text style={styles.socialText}>Microsoft</Text>
              </TouchableOpacity>
              {/* TODO(OAuth): nối Apple OAuth khi có route/infra tương ứng */}
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="apple" size={18} color={colors.textPrimary} />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Đã có tài khoản?{' '}
              <Text style={styles.footerLink} onPress={() => router.back()}>
                Đăng nhập ngay
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
});

export default RegisterScreen;
