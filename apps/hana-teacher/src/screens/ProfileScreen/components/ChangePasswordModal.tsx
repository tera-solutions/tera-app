import { useEffect } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { InputPassword } from '@components/ui';
import { ProfileService } from '@tera/modules/system';

import { ChangePasswordFormValues } from '../types';
import { styles } from '../styles';

const DEFAULT_VALUES: ChangePasswordFormValues = {
  current_password: '',
  new_password: '',
  confirm_password: '',
};

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function ChangePasswordModal({ visible, onDismiss }: Props) {
  const form = useForm<ChangePasswordFormValues>({ defaultValues: DEFAULT_VALUES });
  const {
    control,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    if (visible) form.reset(DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const { mutate: changePassword, isPending } = ProfileService.useChangePassword();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onDismiss();
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (values.new_password !== values.confirm_password) {
      form.setError('confirm_password', { message: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    changePassword(
      { current_password: values.current_password, new_password: values.new_password },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công' });
          handleClose();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.msg ?? error?.message ?? 'Không thể đổi mật khẩu',
          });
        },
      },
    );
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

          <View style={styles.modalFieldGroup}>
            <Text style={styles.modalFieldLabel}>Mật khẩu hiện tại</Text>
            <Controller
              control={control}
              name="current_password"
              rules={{ required: 'Vui lòng nhập mật khẩu hiện tại' }}
              render={({ field: { onChange, value } }) => (
                <InputPassword value={value} onChangeText={onChange} placeholder="••••••••" />
              )}
            />
            {!!errors.current_password && (
              <Text style={styles.modalErrorText}>{errors.current_password.message}</Text>
            )}
          </View>

          <View style={styles.modalFieldGroup}>
            <Text style={styles.modalFieldLabel}>Mật khẩu mới</Text>
            <Controller
              control={control}
              name="new_password"
              rules={{
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
              }}
              render={({ field: { onChange, value } }) => (
                <InputPassword value={value} onChangeText={onChange} placeholder="••••••••" />
              )}
            />
            {!!errors.new_password && <Text style={styles.modalErrorText}>{errors.new_password.message}</Text>}
          </View>

          <View style={styles.modalFieldGroup}>
            <Text style={styles.modalFieldLabel}>Xác nhận mật khẩu mới</Text>
            <Controller
              control={control}
              name="confirm_password"
              rules={{
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (v) => v === watch('new_password') || 'Mật khẩu xác nhận không khớp',
              }}
              render={({ field: { onChange, value } }) => (
                <InputPassword value={value} onChangeText={onChange} placeholder="••••••••" />
              )}
            />
            {!!errors.confirm_password && (
              <Text style={styles.modalErrorText}>{errors.confirm_password.message}</Text>
            )}
          </View>

          <View style={styles.modalActions}>
            <Button mode="outlined" style={styles.modalBtn} onPress={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button
              mode="contained"
              style={[styles.modalBtn, styles.modalBtnSubmit]}
              onPress={handleSubmit}
              loading={isPending}
              disabled={isPending}
            >
              Lưu
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
