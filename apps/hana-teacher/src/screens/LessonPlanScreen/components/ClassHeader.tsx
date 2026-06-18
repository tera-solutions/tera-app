import React from 'react';
import { View, Text } from 'react-native';
import { Button, Avatar, Icon } from 'react-native-paper';
import { styles } from '../styles';

interface ClassHeaderProps {
  className: string;
  level: string;
  room: string;
  branch: string;
  avatarUrl?: string;
  onChangeClass: () => void;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
  className,
  level,
  room,
  branch,
  avatarUrl,
  onChangeClass,
}) => (
  <View style={styles.classCard}>
    <View style={styles.avatarContainer}>
      <Avatar.Image
        size={64}
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require('@tera/assets/app/element_70.png')
        }
        style={styles.avatar}
      />
    </View>
    <View style={styles.classInfo}>
      <Text style={styles.className}>{className}</Text>
      <Text style={styles.classTagline}>Trẻ em • {level}</Text>
      <View style={styles.locationRow}>
        <Icon source="map-marker" size={14} color="#64748B" />
        <Text style={styles.locationText}>
          {room} • {branch}
        </Text>
      </View>
    </View>
    <Button
      mode="outlined"
      compact
      onPress={onChangeClass}
      style={styles.btnChangeClass}
      labelStyle={{ fontSize: 13, color: '#0073e6', fontWeight: 600, lineHeight: 14 }}
      icon={({ size, color }) => (
        <Icon source="swap-horizontal" size={size} color={color} />
      )}
    >
      Đổi lớp
    </Button>
  </View>
);
