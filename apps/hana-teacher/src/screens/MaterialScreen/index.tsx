import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-paper';

import { useMaterialList } from '@tera/modules/education/material';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { MaterialHeader } from './components/MaterialHeader';
import { MaterialStatsRow } from './components/MaterialStats';
import { CategoryTabs, CategoryTab } from './components/CategoryTabs';
import { FolderSection } from './components/FolderSection';
import { MaterialCard } from './components/MaterialCard';
import { UploadBanner } from './components/UploadBanner';

import { MaterialResponse, MaterialType, MaterialStats, MaterialItem } from './types';

// ─── Category tabs config ─────────────────────────────────────────────────────
const CATEGORY_TABS: CategoryTab[] = [
  { value: 'all',        text: 'Tất cả',       icon: 'view-grid-outline' },
  { value: 'lesson',     text: 'Giáo án',       icon: 'book-outline' },
  { value: 'slide',      text: 'Bài giảng',     icon: 'presentation' },
  { value: 'exercise',   text: 'Bài tập',       icon: 'pencil-outline' },
  { value: 'exam',       text: 'Đề kiểm tra',   icon: 'file-document-outline' },
  { value: 'other',      text: 'Khác',          icon: 'dots-horizontal' },
];

// ─── Type → icon config ───────────────────────────────────────────────────────
const TYPE_CONFIG: Record<MaterialType, { icon: string; iconColor: string; iconBg: string; typeName: string }> = {
  pdf:   { icon: 'file-pdf-box',        iconColor: '#E74C3C', iconBg: '#FDF2F0', typeName: 'PDF' },
  doc:   { icon: 'file-word-box',       iconColor: '#2980B9', iconBg: '#EEF6FA', typeName: 'DOC' },
  docx:  { icon: 'file-word-box',       iconColor: '#2980B9', iconBg: '#EEF6FA', typeName: 'DOCX' },
  ppt:   { icon: 'file-powerpoint-box', iconColor: '#E67E22', iconBg: '#FFF4EB', typeName: 'PPT' },
  pptx:  { icon: 'file-powerpoint-box', iconColor: '#E67E22', iconBg: '#FFF4EB', typeName: 'PPTX' },
  xls:   { icon: 'file-excel-box',      iconColor: '#27AE60', iconBg: '#EBF7EE', typeName: 'XLS' },
  xlsx:  { icon: 'file-excel-box',      iconColor: '#27AE60', iconBg: '#EBF7EE', typeName: 'XLSX' },
  mp4:   { icon: 'file-video-outline',  iconColor: '#9B5DE5', iconBg: '#F5EFFF', typeName: 'MP4' },
  mp3:   { icon: 'file-music-outline',  iconColor: '#8E44AD', iconBg: '#F5EFFF', typeName: 'MP3' },
  image: { icon: 'file-image-outline',  iconColor: '#007AFF', iconBg: '#EBF5FF', typeName: 'Hình ảnh' },
  link:  { icon: 'link-variant',        iconColor: '#00A896', iconBg: '#E6FAF8', typeName: 'Liên kết' },
  other: { icon: 'file-outline',        iconColor: '#64748B', iconBg: '#F1F5F9', typeName: 'Khác' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatSize(bytes?: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isHocLieu(type: MaterialType): boolean {
  return ['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(type);
}

function isDaPhuongTien(type: MaterialType): boolean {
  return ['mp4', 'mp3'].includes(type);
}

function mapToMaterialItem(item: MaterialResponse): MaterialItem {
  const typeCfg = TYPE_CONFIG[item.material_type] ?? TYPE_CONFIG.other;
  return {
    id: String(item.id),
    name: item.material_name,
    type: item.material_type,
    className: item.class?.name ?? item.course?.name,
    typeName: typeCfg.typeName,
    size: formatSize(item.file_size),
    date: item.created_at ? formatDate(item.created_at) : '',
    icon: typeCfg.icon,
    iconColor: typeCfg.iconColor,
    iconBg: typeCfg.iconBg,
    status: item.status,
  };
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function MaterialScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useMaterialList({
    params: {
      per_page: 50,
      search: search || undefined,
    },
  });

  const { items, pagination } = getListData<MaterialResponse>(data);

  const stats: MaterialStats = {
    total:           pagination.total,
    hoc_lieu:        items.filter((i) => isHocLieu(i.material_type)).length,
    tai_lieu:        items.filter((i) => !isHocLieu(i.material_type) && !isDaPhuongTien(i.material_type)).length,
    da_phuong_tien:  items.filter((i) => isDaPhuongTien(i.material_type)).length,
  };

  const materialList = items.map(mapToMaterialItem);

  return (
    <View style={styles.container}>
      <MaterialHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MaterialStatsRow stats={stats} />

        <CategoryTabs
          tabs={CATEGORY_TABS}
          activeTab={activeCategory}
          setActiveTab={setActiveCategory}
        />

        {/* Search + Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Icon source="magnify" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm tài liệu..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon source="tune-variant" size={16} color="#007AFF" />
            <Text style={styles.filterButtonText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>

        {/* Folder Section */}
        <FolderSection />

        {/* Material List */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Icon source="clock-outline" size={22} color="#007AFF" />
            <Text style={styles.sectionTitle}>Tài liệu mới nhất</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {isLoading || isFetching ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 32 }} />
          ) : materialList.length > 0 ? (
            materialList.map((item) => <MaterialCard key={item.id} item={item} />)
          ) : (
            <Text style={{ textAlign: 'center', color: '#94A3B8', paddingVertical: 32 }}>
              Chưa có tài liệu nào
            </Text>
          )}
        </View>

        <UploadBanner />
      </ScrollView>
    </View>
  );
}
