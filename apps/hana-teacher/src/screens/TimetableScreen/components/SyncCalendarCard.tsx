import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles';

interface SyncCalendarCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onPress?: () => void;
}

export default function SyncCalendarCard({
  title = 'Đồng bộ thời khóa biểu',
  description = 'Kết nối với Google Calendar để tự động cập nhật lịch dạy và nhận thông báo nhắc lịch.',
  buttonText = 'Đồng bộ',
  onPress,
}: SyncCalendarCardProps) {
  return (
    <View style={styles.syncCard}>
      <View style={styles.classIcon}>
        <Ionicons
          name="calendar-outline"
          size={28}
          color="#0066cc"
        />
      </View>

      <View style={styles.syncContent}>
        <Text style={styles.syncTitle}>
          {title}
        </Text>

        <Text style={styles.syncDescription}>
          {description}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.syncButton}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Text style={styles.syncButtonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}