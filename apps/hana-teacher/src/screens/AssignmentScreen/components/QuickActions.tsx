import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const ACTIONS = [
  {
    id: '1',
    label: 'Tạo bài tập mới',
    icon: 'clipboard-plus-outline',
    color: '#007AFF',
    bg: '#EBF5FF',
  },
  {
    id: '2',
    label: 'Bài tập đã giao',
    icon: 'clipboard-check-outline',
    color: '#27AE60',
    bg: '#EBF7EE',
  },
  {
    id: '3',
    label: 'Chấm bài',
    icon: 'chart-bar',
    color: '#E67E22',
    bg: '#FFF4EB',
  },
  {
    id: '4',
    label: 'Ngân hàng đề',
    icon: 'folder-outline',
    color: '#9B5DE5',
    bg: '#F5EFFF',
  },
];

export const QuickActions = () => (
  <View style={styles.quickActionsContainer}>
    {ACTIONS.map((action) => (
      <TouchableOpacity key={action.id} style={styles.actionItem}>
        <View style={[styles.actionIconBg, { backgroundColor: action.bg }]}>
          <Icon source={action.icon} size={24} color={action.color} />
        </View>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
