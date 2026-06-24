import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './style';

export default function HomeworkReward() {
  return (
    <View style={styles.rewardCard}>
      <Text style={styles.rewardTitle}>
        🎁 Hoàn thành tất cả bài tập hôm nay
      </Text>

      <Text style={styles.rewardDesc}>
        Nhận thêm 20 ⭐ và huy hiệu siêng năng
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Tiếp tục học
        </Text>
      </TouchableOpacity>
    </View>
  );
}