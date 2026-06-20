import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const TeacherTipBanner = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerIconBg}>
      <Icon source="clipboard-text-play" size={32} color="#007AFF" />
    </View>
    <View style={styles.bannerTextContainer}>
      <Text style={styles.bannerTitle}>Mẹo cho giáo viên</Text>
      <Text style={styles.bannerDesc} numberOfLines={2}>
        Sử dụng ngân hàng đề để tạo bài tập nhanh chóng và chấm bài dễ dàng hơn!
      </Text>
    </View>
    <TouchableOpacity style={styles.bannerButton}>
      <Text style={styles.bannerButtonText}>Khám phá ngay</Text>
      <Icon source="chevron-right" size={14} color="#007AFF" />
    </TouchableOpacity>
  </View>
);
