import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../styles';

interface TimetableHeaderProps {
  notificationCount?: number;
  onProfilePress?: () => void;
  onCalendarPress?: () => void;
  onNotificationPress?: () => void;
}

export default function TimetableHeader({
  notificationCount = 12,
  onProfilePress,
  onCalendarPress,
  onNotificationPress,
}: TimetableHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Icon source="chevron-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thời khóa biểu</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.8}
            onPress={onCalendarPress}
          >
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.8}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />

            {notificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
