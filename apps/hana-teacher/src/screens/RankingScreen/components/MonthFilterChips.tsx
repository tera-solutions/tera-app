import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '../styles';
import { MONTH_OPTIONS } from '../_utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const MonthFilterChips = ({ value, onChange }: Props) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {MONTH_OPTIONS.map((option) => {
      const active = option.value === value;
      return (
        <TouchableOpacity
          key={option.value}
          style={[styles.monthChip, active && styles.monthChipActive, { marginRight: 8 }]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.monthChipText, active && styles.monthChipTextActive]}>{option.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
