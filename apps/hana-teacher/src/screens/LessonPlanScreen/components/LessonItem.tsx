import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IconButton, Icon } from 'react-native-paper';
import { styles } from '../styles';

export interface LessonData {
  id: string;
  index: string;
  title: string;
  unit: string;
  duration: string;
  status: 'done' | 'upcoming' | 'none';
  date: string;
  thumb: any;
}

const getStatusConfig = (status: LessonData['status']) => {
  switch (status) {
    case 'done':
      return {
        text: 'Đã giảng',
        bg: '#ECFDF5',
        color: '#10B981',
        icon: 'check-circle',
      };
    case 'upcoming':
      return {
        text: 'Sắp tới',
        bg: '#FFF7ED',
        color: '#F97316',
        icon: 'clock',
      };
    default:
      return {
        text: 'Chưa giảng',
        bg: '#F1F5F9',
        color: '#64748B',
        icon: 'minus-circle-outline',
      };
  }
};

export const LessonItem: React.FC<{
  item: LessonData;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const statusConfig = getStatusConfig(item.status);

  return (
    <View style={styles.lessonRowContainer}>
      <View style={styles.leftTimelineColumn}>
        <View style={styles.indexWrapper}>
          <Text style={styles.indexText}>{item.index}</Text>
        </View>
      </View>

      <View style={styles.rightCardColumn}>
        <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
          <Image
            source={item.thumb}
            style={styles.lessonThumb}
            resizeMode="contain"
          />

          <View style={styles.lessonMeta}>
            <Text style={styles.lessonTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.lessonUnit}>{item.unit}</Text>
            <Text style={styles.lessonDuration}>
              Thời gian: {item.duration}
            </Text>
          </View>

          <View style={styles.rightMeta}>
            <View
              style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
            >
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.text}
              </Text>
              <Icon
                source={statusConfig.icon}
                size={12}
                color={statusConfig.color}
              />
            </View>

            <Text style={styles.dateText}>{item.date}</Text>

            <View style={styles.actionRow}>
              <Icon
                source="file-document-edit-outline"
                size={16}
                color="#3B82F6"
              />
              <IconButton
                icon={({ size, color }) => (
                  <Icon source="chevron-right" size={size} color={color} />
                )}
                size={20}
                style={{ margin: 0, padding: 0, marginLeft: 4 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
