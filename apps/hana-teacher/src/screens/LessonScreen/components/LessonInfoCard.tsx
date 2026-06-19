import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const LessonInfoCard = () => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardTop}>
      <View style={styles.lessonImageBg}>
        <Icon source="alphabetical-variant" size={36} color="#FFB300" />
      </View>
      <View style={styles.lessonMeta}>
        <View style={styles.lessonTitleRow}>
          <Text style={styles.lessonTitle} numberOfLines={2}>Hello! – Getting to know you</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Đã giảng</Text>
            <Icon source="check-circle" size={14} color="#27AE60" />
          </View>
        </View>
        <View style={styles.unitTag}>
          <Text style={styles.unitText}>Unit 1: My World</Text>
        </View>
      </View>
    </View>

    <View style={styles.gridInfo}>
      <View style={styles.gridItem}>
        <Icon source="clock-outline" size={16} color="#007AFF" />
        <Text style={styles.gridText}>45 phút</Text>
      </View>
      <View style={styles.gridItem}>
        <Icon source="account-child-outline" size={16} color="#007AFF" />
        <Text style={styles.gridText}>Trẻ em – Beginner</Text>
      </View>
      <View style={styles.gridItem}>
        <Icon source="calendar-blank" size={16} color="#007AFF" />
        <Text style={styles.gridText}>10/05/2025</Text>
      </View>
      <View style={styles.gridItem}>
        <Icon source="map-marker-outline" size={16} color="#007AFF" />
        <Text style={styles.gridText}>Starters 2A</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.editButton}>
      <Icon source="square-edit-outline" size={28} color="#007AFF" />
    </TouchableOpacity>
  </View>
);