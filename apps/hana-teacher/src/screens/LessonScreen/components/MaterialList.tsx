import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const MATERIALS = [
  { id: '1', name: 'Giáo trình My World 1', meta: 'PDF • 2.4 MB', icon: 'file-pdf-box', iconColor: '#E74C3C', bg: '#FDF2F0' },
  { id: '2', name: 'Slide bài giảng', meta: 'PPT • 5.1 MB', icon: 'file-powerpoint-box', iconColor: '#2980B9', bg: '#EEF6FA' },
  { id: '3', name: 'Worksheet', meta: 'DOC • 1.2 MB', icon: 'file-word-box', iconColor: '#27AE60', bg: '#EBF7EE' },
  { id: '4', name: 'Audio bài nghe', meta: 'MP3 • 3.6 MB', icon: 'file-music-outline', iconColor: '#8E44AD', bg: '#F5EFFF' },
];

export const MaterialList = () => (
  <View style={{ marginTop: 24 }}>
    <View style={[styles.sectionContainer, { marginTop: 0 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon source="folder-open-outline" size={22} color="#007AFF" />
          <Text style={styles.sectionTitle}>Tài liệu sử dụng</Text>
        </View>
        <TouchableOpacity><Text style={styles.viewAllText}>Xem tất cả</Text></TouchableOpacity>
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.materialScroll}>
      {MATERIALS.map((mat) => (
        <View key={mat.id} style={styles.materialCard}>
          <View style={[styles.materialIconBg, { backgroundColor: mat.bg }]}>
            <Icon source={mat.icon} size={24} color={mat.iconColor} />
          </View>
          <Text style={styles.materialName} numberOfLines={2}>{mat.name}</Text>
          <Text style={styles.materialMeta}>{mat.meta}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);