import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { styles } from '../styles';

export const QuickCreateBanner: React.FC<{ onCreate: () => void }> = ({
  onCreate,
}) => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerLeft}>
      <Image
        source={require('@tera/assets/app/element_76.png')}
        style={{ width: 75, height: 75 }}
        resizeMode="contain"
      />
      <View style={styles.bannerTexts}>
        <Text style={styles.bannerTitle}>Tạo giáo án mới</Text>
        <Text style={styles.bannerSubtitle}>
          Thêm bài học vào kế hoạch giảng dạy
        </Text>
      </View>
    </View>
    <Button
      mode="contained"
      onPress={onCreate}
      style={styles.btnCreate}
      labelStyle={{ fontSize: 13, fontWeight: '700' }}
    >
      + Tạo giáo án
    </Button>
  </View>
);
