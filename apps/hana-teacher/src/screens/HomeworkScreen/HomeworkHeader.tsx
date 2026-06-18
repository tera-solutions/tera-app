import { Image, Text, View } from 'react-native';

import { styles } from './style';

export default function HomeworkHeader() {
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

          <Text style={styles.greeting}>Chào buổi sáng, Minh! 👋</Text>

          <Text style={styles.subGreeting}>Hôm nay chúng ta học gì nhé?</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@tera/assets/app/element_8.png')}
              style={styles.avatar}
            />

            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.coinBadge}>
            <Image
              source={require('@tera/assets/app/element_19.png')}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
            <Text style={styles.coinText}>120</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
