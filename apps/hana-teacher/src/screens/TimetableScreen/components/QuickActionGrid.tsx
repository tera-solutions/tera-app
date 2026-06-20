import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
}

interface QuickActionGridProps {
  actions?: QuickActionItem[];
  onActionPress?: (action: QuickActionItem) => void;
}

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: 'attendance',
    title: 'Điểm danh',
    icon: 'checkmark-circle-outline',
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
  },
  {
    id: 'lesson-plan',
    title: 'Ghi chú',
    icon: 'book-outline',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  {
    id: 'grade',
    title: 'Thay đổi lịch',
    icon: 'calendar-outline',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  {
    id: 'homework',
    title: 'Lịch nghỉ',
    icon: 'document-text-outline',
    color: '#8B5CF6',
    backgroundColor: '#EDE9FE',
  },
];

export default function QuickActionGrid({
  actions = DEFAULT_ACTIONS,
  onActionPress,
}: QuickActionGridProps) {
  return (
    <View style={styles.quickActionContainer}>
      <View style={styles.sessionHeader}>
        <Ionicons name="flash-outline" size={22} color="#0066cc" />

        <Text style={styles.sessionTitle}>Truy cập nhanh</Text>
      </View>

      <View style={styles.quickActionGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.8}
            style={styles.quickActionItem}
            onPress={() => onActionPress?.(action)}
          >
            <View
              style={[
                styles.quickActionIcon,
                {
                  backgroundColor: action.backgroundColor,
                },
              ]}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>

            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
