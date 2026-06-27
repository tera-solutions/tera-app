import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const SearchBarSection = () => (
  <View style={styles.searchRow}>
    <View style={styles.searchBar}>
      <Icon source="magnify" size={20} color="#94A3B8" />
      <Text style={styles.searchInputPlaceholder}>Tìm kiếm bài tập...</Text>
    </View>
    <TouchableOpacity style={styles.filterButton}>
      <Icon source="filter-variant" size={18} color="#007AFF" />
      <Text style={styles.filterButtonText}>Lọc</Text>
    </TouchableOpacity>
  </View>
);
