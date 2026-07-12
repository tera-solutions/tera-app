import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export interface AssignmentItem {
  id: string;
  title: string;
  classRoom: string;
  startDate: string;
  endDate: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  progress: number;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'danger' | 'neutral';
}

const badgeColorMap = {
  success: { bg: '#E2FBEB', text: '#27AE60' },
  warning: { bg: '#FFF4EB', text: '#E67E22' },
  danger: { bg: '#FDF2F0', text: '#E74C3C' },
  neutral: { bg: '#F1F5F9', text: '#64748B' },
};

interface Props {
  item: AssignmentItem;
  onPress?: () => void;
}

export const AssignmentCard = ({ item, onPress }: Props) => {
  const badgeStyle = badgeColorMap[item.badgeType] || badgeColorMap.neutral;
  const circleColor =
    item.progress === 100
      ? '#27AE60'
      : item.progress < 50
        ? '#E74C3C'
        : '#007AFF';

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.cardIconBg, { backgroundColor: item.iconBg }]}>
        <Icon source={item.icon} size={28} color={item.iconColor} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardClass}>{item.classRoom}</Text>
        <Text style={styles.cardDates}>• Ngày giao: {item.startDate}</Text>
        <Text style={[styles.cardDates, { color: 'red' }]}>
          • Hạn nộp: {item.endDate}
        </Text>
      </View>

      <View style={styles.cardRight}>
        <View style={[styles.tagBadge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.tagBadgeText, { color: badgeStyle.text }]}>
            {item.badgeText}
          </Text>
        </View>
        <View style={[styles.progressCircle, { borderColor: circleColor }]}>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton} onPress={onPress}>
        <Icon source="dots-vertical" size={22} color="#94A3B8" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
