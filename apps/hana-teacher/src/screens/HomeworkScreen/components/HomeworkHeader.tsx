import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from '../styles';

export const HomeworkHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.headerBg}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Icon source="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Bài tập</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Icon source="dots-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
