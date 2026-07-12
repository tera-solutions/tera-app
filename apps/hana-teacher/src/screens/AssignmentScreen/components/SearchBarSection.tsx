import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBarSection = ({ value, onChangeText }: Props) => (
  <View style={styles.searchRow}>
    <View style={styles.searchBar}>
      <Icon source="magnify" size={20} color="#94A3B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Tìm kiếm bài tập..."
        placeholderTextColor="#94A3B8"
        style={styles.searchInputPlaceholder}
      />
    </View>
    <TouchableOpacity style={styles.filterButton}>
      <Icon source="filter-variant" size={18} color="#007AFF" />
      <Text style={styles.filterButtonText}>Lọc</Text>
    </TouchableOpacity>
  </View>
);
