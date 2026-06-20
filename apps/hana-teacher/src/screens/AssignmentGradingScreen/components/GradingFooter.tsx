import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const GradingFooter = () => (
  <View style={styles.bottomActions}>
    <TouchableOpacity style={styles.outlineBtn}>
      <Icon source="chevron-left" size={20} color="#64748B" />
      <Text style={styles.outlineBtnText}>Bài trước</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.primaryBtn}>
      <Text style={styles.primaryBtnText}>Lưu và chuyển bài sau</Text>
      <Icon source="chevron-right" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);
