import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const MaterialHeader = () => (
  <View style={styles.headerBg}>
    <View style={styles.headerTop}>
      <Icon source="book-open-variant" size={28} color="#FFFFFF" />
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon source="magnify" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon source="upload-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitle}>Học liệu & Tài liệu</Text>
      <Text style={styles.headerSubtitle}>Quản lý tài nguyên giảng dạy</Text>
    </View>
  </View>
);
