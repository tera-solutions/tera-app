import { useStates } from '@hooks/useStates';
import { formatDate } from '@tera/commons/utils';
import { Loading } from '@components/ui/Loading';
import { ScreenLoader } from '@components/ui/ScreenLoader';
import { useLogout } from '@hana/teacher/services/auth.service';
import { useGetProfile } from '@hana/teacher/services/user.service';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

interface ProfileItemProps {
  iconName: string;
  label: string;
  value: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  iconName,
  label,
  value,
}) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}>
      <Icon source={iconName} size={20} color="#6B7280" />
    </View>
    <View style={styles.infoTextWrapper}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

console.log('>>> FILE ProfileScreen ĐÃ ĐƯỢC LOAD VÀO BỘ NHỚ');

// --- Màn hình chính ProfileScreen ---
const ProfileScreen = observer(() => {
  const {
    authStore: { user },
  } = useStates();
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPending } = useGetProfile();
  const { mutate: onLogout } = useLogout();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['get_profile'] });
  }, []);

  const handleEditInfo = () => {
    router.push('/portal/update-profile');
  };

  const handleChangePassword = () => {
    router.push('/portal/change-password');
  };

  if (!user) return <ScreenLoader />;

  return (
    <View style={styles.containerFull}>
      <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Loading isLoading={isPending}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* 1. THÔNG TIN CƠ BẢN VÀ AVATAR */}
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatarCircle}
              />
              <Text style={styles.userName}>{user.full_name}</Text>
              <Text style={styles.storeUrl}>{user.type_text}</Text>
            </View>

            {/* 2. ACTIONS: Chỉnh sửa & Đổi mật khẩu */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEditInfo}
              >
                <Icon source="account-edit-outline" size={24} color="#4d5868" />
                <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleChangePassword}
              >
                <Icon source="lock-reset" size={24} color="#4d5868" />
                <Text style={styles.actionText}>Đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>

            {/* 3. THÔNG TIN CHI TIẾT */}
            <View style={styles.infoContainer}>
              <ProfileItem
                iconName="email-outline"
                label="Email"
                value={user.email ?? 'Chưa cập nhật'}
              />
              <ProfileItem
                iconName="phone-outline"
                label="SĐT"
                value={user.phone ?? 'Chưa cập nhật'}
              />
              <ProfileItem
                iconName="calendar-range-outline"
                label="Ngày sinh"
                value={formatDate(user.dob, 'DD/MM/YYYY', 'YYYY-MM-DD')}
              />
              <ProfileItem
                iconName="map-marker-outline"
                label="Địa chỉ"
                value={user.address ?? 'Chưa cập nhật'}
              />
              <ProfileItem
                iconName="note-edit-outline"
                label="Ghi chú"
                value={user.note ?? 'Chưa cập nhật'}
              />
            </View>

            {/* Nút Đăng xuất (Thường có ở màn hình profile) */}
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: '#fff4f4' }]}
              onPress={() => onLogout()}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => console.tron('Xóa tài khoản')}
          >
            <Text style={styles.logoutText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </Loading>
      </View>
    </View>
  );
});

export default ProfileScreen;
