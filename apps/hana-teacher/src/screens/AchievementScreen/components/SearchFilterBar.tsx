import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

interface SearchFilterBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export default function SearchFilterBar({
  value,
  onChangeText,
  onFilterPress,
}: SearchFilterBarProps) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Icon source="magnify" size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm học viên, thành tích, chứng nhận..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Icon source="filter-variant" size={20} color="#0066cc" />
        <Text style={styles.filterText}>Bộ lọc</Text>
      </TouchableOpacity>
    </View>
  );
}
