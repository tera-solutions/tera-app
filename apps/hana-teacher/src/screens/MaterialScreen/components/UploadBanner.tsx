import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const UploadBanner = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerIconBg}>
      <Icon source="cloud-upload-outline" size={26} color="#FFFFFF" />
    </View>
    <View style={styles.bannerTextContainer}>
      <Text style={styles.bannerTitle}>Tải lên tài liệu mới</Text>
      <Text style={styles.bannerDesc}>
        Chia sẻ giáo án, bài giảng và tài liệu với học viên nhanh chóng
      </Text>
      <TouchableOpacity style={styles.bannerButton}>
        <Text style={styles.bannerButtonText}>Tải lên ngay</Text>
      </TouchableOpacity>
    </View>
  </View>
);
