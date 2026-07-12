import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ProfileService } from '@tera/modules/system';

import DetailHeader from './components/DetailHeader';
import ProfileCard from './components/ProfileCard';
import InfoSection from './components/InfoSection';
import SecuritySection from './components/SecuritySection';
import ChangePasswordModal from './components/ChangePasswordModal';

import { toProfileData } from './_utils';
import { styles } from './styles';

export default function ProfileScreen() {
  const router = useRouter();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const profileQuery = ProfileService.useProfile();
  const profile = useMemo(() => toProfileData(profileQuery.data?.data), [profileQuery.data]);

  const notFound = !profileQuery.isLoading && (profileQuery.isError || !profile.user_id);

  return (
    <View style={styles.container}>
      <DetailHeader />

      {notFound ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không thể tải hồ sơ cá nhân</Text>
        </View>
      ) : profileQuery.isLoading ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 80 }} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ProfileCard profile={profile} onEdit={() => router.push('/setting/profile-update' as any)} />
          <InfoSection profile={profile} />
          <SecuritySection onChangePassword={() => setPasswordModalVisible(true)} />
        </ScrollView>
      )}

      <ChangePasswordModal visible={passwordModalVisible} onDismiss={() => setPasswordModalVisible(false)} />
    </View>
  );
}
