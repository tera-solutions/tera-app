import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useLogout } from '@hana/teacher/services/auth.service';

import { styles } from '../style';

export default function LogoutButton() {
  const router = useRouter();

  const { mutate: logout, isPending } = useLogout(() => {
    router.replace('/auth/login');
  });

  return (
    <TouchableOpacity
      style={styles.logoutBtn}
      onPress={() => logout()}
      disabled={isPending}
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#EF4444" />
      ) : (
        <Text style={styles.logoutText}>Đăng xuất</Text>
      )}
    </TouchableOpacity>
  );
}
