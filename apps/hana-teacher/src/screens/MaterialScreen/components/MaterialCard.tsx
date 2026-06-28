import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { MaterialItem } from '../types';

interface Props {
  item: MaterialItem;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: '#F1F5F9', color: '#64748B', label: 'Bản nháp' },
  published: { bg: '#EBF7EE', color: '#27AE60', label: 'Đã xuất bản' },
  archived:  { bg: '#FFF4EB', color: '#E67E22', label: 'Lưu trữ' },
};

export const MaterialCard = ({ item }: Props) => {
  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.draft;
  return (
    <TouchableOpacity style={styles.materialCard} activeOpacity={0.7}>
      <View style={[styles.materialIconBg, { backgroundColor: item.iconBg }]}>
        <Icon source={item.icon} size={24} color={item.iconColor} />
      </View>

      <View style={styles.materialContent}>
        <Text style={styles.materialName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.materialMeta}>
          {item.className ? `${item.className} • ` : ''}{item.typeName} • {item.size}
        </Text>
        <Text style={styles.materialDate}>{item.date}</Text>
      </View>

      <View style={styles.materialRight}>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
            {statusCfg.label}
          </Text>
        </View>
        <Icon source="dots-vertical" size={18} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};
