import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper'; // Hoặc import từ 'react-native' tùy DLS của anh

interface Props {
  progress: number; // Mong đợi giá trị từ 0 đến 1 (ví dụ: 0.5 là 50%)
  text?: string;
}

export default function ProgressBar({ progress, text = '' }: Props) {
  const safeProgress = typeof progress !== 'number' || isNaN(progress) ? 0 : progress;
  const percentage = Math.min(Math.max(safeProgress * 100, 0), 100);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
      }}
    >
      <View
        style={{
          flex: 1, 
          height: 10,
          borderRadius: 999,
          backgroundColor: '#E5E7EB',
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: 999,
            backgroundColor: '#0066cc',
          }}
        />
      </View>

      {text ? (
        <Text style={{ fontSize: 14, color: '#374151' }}>
          {text}
        </Text>
      ) : null}
    </View>
  );
}