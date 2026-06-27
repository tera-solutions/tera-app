import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { useMaterialList } from '@tera/modules/education/material';
import { getListData } from '@tera/commons/hooks';
import { styles } from '../styles';

const TYPE_ICON: Record<string, { icon: string; color: string; bg: string }> = {
  pdf:   { icon: 'file-pdf-box',        color: '#E74C3C', bg: '#FDF2F0' },
  doc:   { icon: 'file-word-box',       color: '#2980B9', bg: '#EEF6FA' },
  docx:  { icon: 'file-word-box',       color: '#2980B9', bg: '#EEF6FA' },
  ppt:   { icon: 'file-powerpoint-box', color: '#E67E22', bg: '#FFF4EB' },
  pptx:  { icon: 'file-powerpoint-box', color: '#E67E22', bg: '#FFF4EB' },
  mp4:   { icon: 'file-video-outline',  color: '#9B5DE5', bg: '#F5EFFF' },
  mp3:   { icon: 'file-music-outline',  color: '#8E44AD', bg: '#F5EFFF' },
  image: { icon: 'file-image-outline',  color: '#007AFF', bg: '#EBF5FF' },
  link:  { icon: 'link-variant',        color: '#00A896', bg: '#E6FAF8' },
  other: { icon: 'file-outline',        color: '#64748B', bg: '#F1F5F9' },
};

interface Props {
  lessonId?: string;
}

export const MaterialTab = ({ lessonId }: Props) => {
  const { data, isLoading } = useMaterialList({
    params: {
      per_page: 50,
      filters: lessonId ? { lesson_id: lessonId } : undefined,
    },
  });

  const { items } = getListData(data);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 32 }} />
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon source="folder-open-outline" size={22} color="#007AFF" />
          <Text style={styles.sectionTitle}>Tài liệu buổi học</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#94A3B8', paddingVertical: 32 }}>
          Chưa có tài liệu nào
        </Text>
      ) : (
        items.map((item: any) => {
          const cfg = TYPE_ICON[item.material_type] ?? TYPE_ICON.other;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.materialCard}
              activeOpacity={0.7}
            >
              <View style={[styles.materialIconBg, { backgroundColor: cfg.bg }]}>
                <Icon source={cfg.icon} size={24} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.materialName} numberOfLines={1}>
                  {item.material_name}
                </Text>
                <Text style={styles.materialMeta}>
                  {String(item.material_type).toUpperCase()}
                </Text>
              </View>
              <Icon source="chevron-right" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};
