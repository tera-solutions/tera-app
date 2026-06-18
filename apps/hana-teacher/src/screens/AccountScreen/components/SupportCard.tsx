import { Text, Image, TouchableOpacity, View } from 'react-native';

import { styles } from '../style';

export default function SupportCard() {
  return (
    <View style={styles.supportCard}>
      <View style={{ width: '55%' }}>
        <Text style={styles.supportTitle}>Hana Edu Support</Text>

        <Text style={styles.supportDesc}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn!
        </Text>

        <TouchableOpacity style={styles.supportBtn}>
          <Text style={styles.supportBtnText}>Liên hệ hỗ trợ</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('@tera/assets/app/element_82.png')}
        style={{ width: 220, height: 120 }}
        resizeMode="contain"
      />
    </View>
  );
}
