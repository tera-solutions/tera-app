import colors from '@tera/commons/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native-paper';

export interface LoadingProps extends ActivityIndicatorProps {
  children: React.ReactElement | React.ReactNode;
  isLoading: boolean;
}

export const Loading = ({
  isLoading = false,
  style,
  children,
  ...props
}: LoadingProps) => {
  if (!isLoading) return <>{children}</>;
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingMark} />
      <ActivityIndicator
        style={[styles.loadingIndicator, style]}
        animating={isLoading}
        size="large"
        color={colors.primaryLight}
        {...props}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'relative',
  },
  loadingMark: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#b3b3b3ff',
    opacity: 0.05,
    zIndex: 998,
  },
  loadingIndicator: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 999,
  },
});
