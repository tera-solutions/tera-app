import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '../styles';

export const EvaluationTabPlaceholder = () => (
  <View style={styles.card}>
    <View style={styles.placeholderWrap}>
      <Icon source="message-text-outline" size={32} color="#CBD5E1" />
      <Text style={styles.placeholderText}>
        Xem và gửi đánh giá chi tiết cho từng học viên tại trang Đánh giá trên phiên bản web
      </Text>
    </View>
  </View>
);
