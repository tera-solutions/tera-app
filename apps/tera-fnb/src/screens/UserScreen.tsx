import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useStates } from '@hooks/useStates';
import { useLogout } from '@services/auth.service';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';

const LoginScreen = observer(() => {
  const {
    authStore: { user, clear },
  } = useStates();
  const router = useRouter();
  const { mutate: onLogout, isPending } = useLogout();

  return (
    <View>
      <Text>Hello {user?.username}!</Text>
      <Button mode="outlined" onPress={() => onLogout()} loading={isPending}>
        Logout
      </Button>
      <Button mode="contained" onPress={() => router.push('/')}>
        Home
      </Button>
    </View>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
