import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { PROMO_IMAGE } from '../../constants';
import { styles } from '../../styles';

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.promoBanner}>
      <Image
        source={PROMO_IMAGE}
        style={styles.promoImage}
        resizeMode="contain"
      />

      <View style={styles.promoBody}>
        <Text style={styles.promoTitle}>
          Giao tiếp hiệu quả với phụ huynh
        </Text>
        <Text style={styles.promoText}>
          Chia sẻ tiến bộ của học viên và cùng nhau đồng hành trong hành trình học tập.
        </Text>
        <TouchableOpacity style={styles.promoBtn}>
          <Text style={styles.promoBtnText}>Tìm hiểu thêm</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.promoClose} onPress={() => setVisible(false)}>
        <X size={16} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}
