import { Image, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from './style';

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={{ position: 'relative' }}>
            <Text style={styles.logo}>Hana Edu </Text>
            <Image
              source={require('@tera/assets/app/element_19.png')}
              style={{
                width: 28,
                height: 28,
                position: 'absolute',
                left: 180,
                top: 10,
                transform: [{ rotate: '-30deg' }],
              }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.greeting}>Xin chào, Cô Hạ! 👋</Text>

          <Text style={styles.subGreeting}>Chúc cô một ngày dạy học hiệu quả</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@tera/assets/app/element_3.png')}
              style={styles.avatar}
            />

            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.coinBadge}>
            <Icon source="school" size={20} color="#002080" />
            <Text style={styles.coinText}>Giáo viên</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
