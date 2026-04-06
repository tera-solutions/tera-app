import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

const InfoItem: React.FC<{
  label: string;
  value: string;
  isInteractive?: boolean;
  onPress?: () => void;
}> = ({ label, value, isInteractive = false, onPress }) => (
  <TouchableOpacity
    style={styles.infoItem}
    disabled={!isInteractive && !onPress}
    onPress={onPress}
  >
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueContainer}>
      <Text style={styles.infoValue}>{value}</Text>
      {isInteractive && (
        <Icon source="chevron-right" size={20} color="#9CA3AF" />
      )}
    </View>
  </TouchableOpacity>
);

export default InfoItem;
