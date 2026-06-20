import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface OverviewSectionProps {
  title: string;
  hasSeeAll?: boolean;
  onSeeAllPress?: () => void;
  children: React.ReactNode;
}

export default function OverviewSection({
  title,
  hasSeeAll,
  onSeeAllPress,
  children,
}: OverviewSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hasSeeAll && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.sectionAction}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
