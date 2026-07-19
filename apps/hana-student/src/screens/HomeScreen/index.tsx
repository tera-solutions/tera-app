import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { LogOut, Sparkles } from 'lucide-react-native';

import { useStates } from '@hooks/useStates';
import { useLogout } from '@hana/student/services/auth.service';

import { styles } from './style';

const HomeScreen = observer(() => {
  const { authStore } = useStates();
  const { mutate: logout, isPending } = useLogout();

  const userName = (authStore.user as any)?.name || 'Học viên';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerGreeting}>Xin chào,</Text>
              <Text style={styles.headerName}>{userName}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => logout()}
              disabled={isPending}
            >
              <LogOut size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Chào mừng đến với Hana Student</Text>
          </View>
          <Text style={styles.sectionBody}>
            Đây là khung dự án khởi tạo cho module "Học viên". Các màn hình học tập (lớp học,
            bài tập, từ vựng, điểm số...) sẽ được thêm dần vào tab này ở các bước tiếp theo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
});

export default HomeScreen;
