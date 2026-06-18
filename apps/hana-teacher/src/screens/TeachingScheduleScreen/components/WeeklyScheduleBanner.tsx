import React from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { styles } from '../styles';

export const WeeklyScheduleBanner: React.FC = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerLeft}>
      <Icon source="calendar-clock-outline" size={38} color="#3B82F6" />
      <View style={styles.bannerTexts}>
        <Text style={styles.bannerTitle}>Xem lịch dạy tuần</Text>
        <Text style={styles.bannerSubtitle}>
          Theo dõi lịch dạy và kế hoạch giảng dạy cả tuần một cách dễ dàng.
        </Text>
      </View>
    </View>
    <Button
      mode="contained"
      style={styles.btnViewWeekly}
      labelStyle={{ fontSize: 13, fontWeight: '700' }}
      contentStyle={{ flexDirection: 'row-reverse' }}
      icon={({ size, color }) => (
        <Icon source="chevron-right" size={size} color={color} />
      )}
      onPress={() => {}}
    >
      Xem lịch tuần
    </Button>
  </View>
);
