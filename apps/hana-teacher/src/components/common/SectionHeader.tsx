import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onPressAction?: () => void;
}

export default function SectionHeader({
  title,
  actionText,
  onPressAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {actionText && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressAction}
        >
          <Text style={styles.action}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  action: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0094D9',
  },
});