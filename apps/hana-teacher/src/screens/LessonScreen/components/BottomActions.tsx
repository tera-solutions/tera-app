import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const BottomActions = () => (
  <View style={styles.bottomActions}>
    <TouchableOpacity style={styles.outlineBtn}>
      <Icon source="calendar-text-outline" size={20} color="#007AFF" />
      <Text style={styles.outlineBtnText}>Xem kế hoạch</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.primaryBtn}>
      <Icon source="play-circle-outline" size={20} color="#FFFFFF" />
      <Text style={styles.primaryBtnText}>Bắt đầu giảng dạy</Text>
    </TouchableOpacity>
  </View>
);