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
import { useLogin } from '@hana/teacher/services/auth.service';

import { styles } from './style';

interface LoginFormValues {
  username: string;
  password: string;
  industry: string;
}

const LoginScreen = observer(() => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
      industry: 'general',
    },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    if (isPending) return;
    mutate({ ...data });
  };

  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <Image
        source={require('@tera/assets/app/element_107.png')}
        style={styles.screenBackground}
        resizeMode="cover"
      />

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
            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>
              Chào mừng bạn trở lại Hana Edu 👋
            </Text>

            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập email hoặc số điện thoại',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    leftIcon="email-outline"
                    placeholder="Email hoặc số điện thoại"
                    autoCapitalize="none"
                    autoComplete="username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="username"
              />
              {errors.username && (
                <Text style={styles.error}>{errors.username.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: 'Mật khẩu không được để trống',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu tối thiểu 6 ký tự',
                  },
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    leftIcon="lock-outline"
                    placeholder="Mật khẩu"
                    autoComplete="current-password"
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

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMe}
                  onPress={toggleRememberMe}
                >
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={toggleRememberMe}
                    color={colors.primary}
                  />
                  <Text style={styles.rememberMeText}>Ghi nhớ đăng nhập</Text>
                </TouchableOpacity>

                {/* Route /auth/forgot-password chưa được scaffold trong app */}
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                style={styles.submitButton}
              >
                Đăng nhập
              </Button>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
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
                <Icon source="microsoft" size={18} color={colors.textPrimary} />
                <Text style={styles.socialText}>Microsoft</Text>
              </TouchableOpacity>
              {/* TODO(OAuth): nối Apple OAuth khi có route/infra tương ứng */}
              <TouchableOpacity style={styles.socialButton}>
                <Icon source="apple" size={18} color={colors.textPrimary} />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityBox}>
              <View style={styles.securityIconWrapper}>
                <Icon source="shield-check" size={20} color={colors.primary} />
              </View>
              <View style={styles.securityTextWrapper}>
                <Text style={styles.securityTitle}>Bảo mật tuyệt đối</Text>
                <Text style={styles.securityDesc}>
                  Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích
                  giáo dục
                </Text>
              </View>
              <Icon
                source="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </View>

            <Text style={styles.footerText}>
              Chưa có tài khoản?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => router.push('/auth/register')}
              >
                Đăng ký ngay
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
});

export default LoginScreen;
