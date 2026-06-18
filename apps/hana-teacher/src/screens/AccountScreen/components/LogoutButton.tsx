import { Text, TouchableOpacity } from 'react-native';

import { styles } from '../style';

export default function LogoutButton() {
  return (
    <TouchableOpacity style={styles.logoutBtn}>
      <Text style={styles.logoutText}>
        Đăng xuất
      </Text>
    </TouchableOpacity>
  );
}