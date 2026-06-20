import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const AssignmentInfo = () => (
  <View style={styles.infoCard}>
    <View style={styles.cardIconBg}>
      <Icon source="file-document-outline" size={30} color="#007AFF" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>Bài 2: Nghe hiểu – School</Text>
      <Text style={styles.cardClass}>Lớp Starters 2A</Text>
      <Text style={styles.cardDates}>
        Ngày giao: 12/05/2025 • Hạn nộp: 19/05/2025
      </Text>
    </View>
    <View style={styles.cardRight}>
      <View style={[styles.statusPendingBadge, { backgroundColor: '#FFF4EB' }]}>
        <Text style={[styles.statusPendingText, { color: '#E67E22' }]}>
          Đang chấm
        </Text>
      </View>
      <View style={styles.progressCircle}>
        <Text style={styles.progressText}>20/22</Text>
      </View>
    </View>
  </View>
);
