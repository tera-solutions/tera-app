import { useStates } from '@hooks/useStates';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

const NotificationScreen = observer(() => {
  const {
    authStore: { user, authenticated },
  } = useStates();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello {user?.username}!</Text>
      {!authenticated && (
        <Button
          icon="camera"
          mode="contained"
          onPress={() => router.push('/auth/login')}
        >
          Login
        </Button>
      )}

      <Button icon="camera" mode="contained" onPress={() => router.push('/')}>
        User
      </Button>
    </SafeAreaView>
  );
});

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
