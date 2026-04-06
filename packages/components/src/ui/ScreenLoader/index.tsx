import React from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export const ScreenLoader = () => (
  <View
    style={{
      flex: 1,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <ActivityIndicator size="large" color="#2196F3" />
  </View>
);
