import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { FolderItem } from '../types';

const MOCK_FOLDERS: FolderItem[] = [
  { id: '1', name: 'Giáo án',      count: 24, color: '#E67E22', bg: '#FFF4EB', icon: 'folder' },
  { id: '2', name: 'Bài giảng',    count: 36, color: '#007AFF', bg: '#EBF5FF', icon: 'folder' },
  { id: '3', name: 'Bài tập',      count: 18, color: '#27AE60', bg: '#EBF7EE', icon: 'folder' },
  { id: '4', name: 'Đề kiểm tra',  count: 12, color: '#9B5DE5', bg: '#F5EFFF', icon: 'folder' },
  { id: '5', name: 'Tham khảo',    count: 8,  color: '#E74C3C', bg: '#FDF2F0', icon: 'folder' },
];

interface Props {
  folders?: FolderItem[];
}

export const FolderSection = ({ folders = MOCK_FOLDERS }: Props) => (
  <>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Icon source="folder-multiple-outline" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thư mục</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.viewAllText}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.foldersScroll}
    >
      {folders.map((folder) => (
        <TouchableOpacity key={folder.id} style={styles.folderCard}>
          <View style={[styles.folderIconBg, { backgroundColor: folder.bg }]}>
            <Icon source={folder.icon} size={24} color={folder.color} />
          </View>
          <Text style={styles.folderName}>{folder.name}</Text>
          <Text style={styles.folderCount}>{folder.count} tài liệu</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </>
);
