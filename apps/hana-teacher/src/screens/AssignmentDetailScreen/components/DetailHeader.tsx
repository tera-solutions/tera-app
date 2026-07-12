import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../styles';

export const DetailHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Icon source="chevron-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài tập</Text>
        <View style={{ width: 28 }} />
      </View>
    </View>
  );
};
