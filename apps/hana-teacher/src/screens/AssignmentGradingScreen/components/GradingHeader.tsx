import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from '../styles';

interface Props {
  title?: string;
}

export const GradingHeader = ({ title }: Props) => {
  const router = useRouter();

  return (
    <View style={styles.headerBg}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Icon source="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Chấm bài'}
        </Text>
        <View style={styles.iconButton} />
      </View>
    </View>
  );
};
