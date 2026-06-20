import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from '../styles';

interface HeaderProps {
  title: string;
  notificationCount: number;
}

export default function AchievementHeader({
  title,
  notificationCount,
}: HeaderProps) {
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
          onPress={() => router.back()}
        >
          <Icon source="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon source="magnify" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon source="bell-outline" size={22} color="#FFF" />
            {notificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
