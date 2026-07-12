import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { ProfileService } from '@tera/modules/system';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { ProfileFormValues } from './types';
import ProfileInfoSection from './components/ProfileInfoSection';

export default function ProfileUpdateScreen() {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const profileQuery = ProfileService.useProfile();
  const profile = profileQuery.data?.data;

  useEffect(() => {
    if (!profile?.id) return;
    form.reset({
      full_name: profile.full_name ?? '',
      dob: profile.dob ?? '',
      gender: profile.gender ?? 'male',
      phone: profile.phone ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const { mutate: updateProfile, isPending: isSubmitting } = ProfileService.useProfileUpdate();

  const handleSubmit = form.handleSubmit(
    (values) => {
      updateProfile(
        {
          full_name: values.full_name,
          dob: values.dob || undefined,
          gender: values.gender || undefined,
          phone: values.phone || undefined,
        },
        {
          onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Cập nhật hồ sơ thành công' });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? 'Không thể cập nhật hồ sơ',
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin hồ sơ' });
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
          <Text style={styles.headerTitle}>Cập nhật hồ sơ</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {profileQuery.isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ProfileInfoSection form={form} />
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.bottomBarBtn}
              textColor="#64748B"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={[styles.bottomBarBtn, styles.btnSubmit]}
            >
              Lưu
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
