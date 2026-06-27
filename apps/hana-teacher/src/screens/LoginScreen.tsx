import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

import colors from '@tera/commons/constants/colors';
import { useStates } from '@hooks/useStates';
import { Button, InputPassword, SelectBox, TextInput } from '@components/ui';
import { useLogin } from '@hana/teacher/services/auth.service';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = observer(() => {
  const queryClient = useQueryClient();
  const {
    generalStore: { device },
  } = useStates();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      industry: 'general',
    },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: any) => {
    if (isPending) return;
    mutate({ ...data });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[{ flex: 1, marginTop: 0, backgroundColor: 'transparent' }]}
      >
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.teraLogo}
        />
        <View style={styles.form}>
          {errors.username && (
            <Text style={{ color: 'red' }}>{errors.username.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: 'Bắt buộc nhập tên đăng nhập',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                leftIcon="account"
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={{ color: 'red' }}>{errors.username.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: 'Bắt buộc nhập mật khẩu',
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputPassword
                leftIcon="lock"
                placeholder="Mật khẩu"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ color: 'red' }}>{errors.password.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            style={styles.button}
          >
            Đăng nhập
          </Button>
          <Text style={styles.text1}>
            Sự cố khi đăng nhập?{' '}
            <Text style={styles.text2}>Vui lòng liên hệ admin</Text>
          </Text>
          <Text>{device}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  teraLogo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  form: {
    gap: 20,
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
  text1: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 5,
  },
  text2: {
    color: colors.primary,
    fontWeight: 600,
  },
});
