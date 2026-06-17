import { Image, Text, View } from 'react-native';

import AppCard from '@components/common/AppCard';

import { styles } from './style';

export default function TodayActivityCard() {
  return (
    <AppCard style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View>
          <Text style={styles.activityTitle}>Hoạt động hôm nay</Text>

          <Text style={styles.activitySubTitle}>Tiếp tục cố gắng nhé 🚀</Text>
        </View>
      </View>

      <View style={styles.activityContent}>
        <Image
          source={require('@tera/assets/app/element_4.png')}
          style={styles.activityImage}
          resizeMode="contain"
        />

        <View style={styles.activityInfo}>
          <View style={styles.activityItem}>
            <Image
              source={require('@tera/assets/app/element_15.png')}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMode="contain"
            />
            <Text style={styles.activityItemText}>Bài tập: 3/5 bài</Text>
          </View>

          <View style={styles.activityItem}>
            <Image
              source={require('@tera/assets/app/element_29.png')}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMode="contain"
            />
            <Text style={styles.activityItemText}>Vàng tích lũy: 120</Text>
            <Image
              source={require('@tera/assets/app/element_29.png')}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.activityItem}>
            <Image
              source={require('@tera/assets/app/element_30.png')}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMode="contain"
            />
            <Text style={styles.activityItemText}>Điểm thi đua: 4.8</Text>
            <Image
              source={require('@tera/assets/app/element_19.png')}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </AppCard>
  );
}
