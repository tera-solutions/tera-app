import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ClassScheduleCard, { ClassScheduleItem } from './ClassScheduleCard';

import { styles } from '../styles';

interface SessionSectionProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  data: ClassScheduleItem[];
  onItemPress?: (item: ClassScheduleItem) => void;
}

export default function SessionSection({
  title,
  icon = 'time-outline',
  data,
  onItemPress,
}: SessionSectionProps) {
  return (
    <View style={styles.sessionContainer}>
      <View style={styles.sessionHeader}>
        <Ionicons name={icon} size={22} color="#0066cc" />

        <Text style={styles.sessionTitle}>{title}</Text>

        <View
          style={{
            marginLeft: 'auto',
            backgroundColor: '#EEF6FF',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#0066cc',
            }}
          >
            {data.length} lớp
          </Text>
        </View>
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />

          <Text style={styles.emptyText}>Không có lịch dạy</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClassScheduleCard item={item} onPress={onItemPress} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}
