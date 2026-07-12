import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { LESSON_STATUS_CONFIG } from '../constants';
import type { LessonDetail } from '../types';
import { styles } from '../styles';

interface Props {
  detail: LessonDetail;
}

const notImplemented = () => Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

export const HeaderCard = ({ detail }: Props) => {
  const router = useRouter();
  const statusCfg = LESSON_STATUS_CONFIG[detail.status] ?? LESSON_STATUS_CONFIG.upcoming;
  const audience = [detail.audience, detail.level].filter(Boolean).join(' – ');
  const location = [detail.class_name, detail.room].filter(Boolean).join(' • ');

  return (
    <>
      <View style={styles.headerBg}>
        <Image source={require('@tera/assets/app/element_46.png')} style={styles.headerBackground} resizeMode="cover" />
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Icon source="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài học</Text>
        <View style={styles.headerRightRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push(`/edu/lesson-update?lessonId=${detail.id}` as any)}
          >
            <Icon source="pencil-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={notImplemented}>
            <Icon source="dots-horizontal" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoCardTop}>
          <View style={styles.lessonImageBg}>
            {detail.avatar ? (
              <Image source={{ uri: detail.avatar }} style={{ width: 56, height: 56, borderRadius: 14 }} />
            ) : (
              <Icon source="book-open-variant" size={28} color="#0066CC" />
            )}
          </View>
          <View style={styles.lessonMeta}>
            <Text style={styles.lessonTitle} numberOfLines={2}>
              {detail.lesson_title || 'Bài học'}
            </Text>
            <View style={styles.badgeRow}>
              {!!detail.unit && (
                <View style={styles.unitTag}>
                  <Text style={styles.unitText}>{detail.unit}</Text>
                </View>
              )}
              <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                <Icon source={statusCfg.icon} size={12} color={statusCfg.color} />
                <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          {!!detail.duration && (
            <View style={styles.metaItem}>
              <Icon source="clock-outline" size={15} color="#007AFF" />
              <Text style={styles.metaText}>{detail.duration} phút</Text>
            </View>
          )}
          {!!audience && (
            <View style={styles.metaItem}>
              <Icon source="account-child-outline" size={15} color="#007AFF" />
              <Text style={styles.metaText} numberOfLines={1}>
                {audience}
              </Text>
            </View>
          )}
          {!!detail.date && (
            <View style={styles.metaItem}>
              <Icon source="calendar-blank" size={15} color="#007AFF" />
              <Text style={styles.metaText}>{detail.date}</Text>
            </View>
          )}
          {!!location && (
            <View style={styles.metaItem}>
              <Icon source="map-marker-outline" size={15} color="#007AFF" />
              <Text style={styles.metaText} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};
