import { Image, Text, View } from 'react-native';

import { styles } from './style';

export default function LessonHeader() {
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
            <Text style={styles.logo}>Bài học </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Image
            source={require('@tera/assets/app/element_2.png')}
            style={styles.avatar}
            resizeMode="contain"
          />

          <View style={styles.onlineBadge} />
        </View>
      </View>
    </View>
  );
}
