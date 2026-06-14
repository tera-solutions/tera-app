import colors from '@tera/commons/constants/colors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Switch as SwitchPaper,
  SwitchProps as SwitchPaperProps,
} from 'react-native-paper';

export interface SwitchProps extends SwitchPaperProps {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
  label?: string;
}

export const Switch = ({
  value = false,
  style,
  label,
  onValueChange,
  ...props
}: SwitchProps) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(value);
    if (typeof onValueChange === 'function') {
      onValueChange(value);
    }
  }, [value]);

  const handleChangeValue = (checked: boolean) => {
    setChecked(checked);
    if (typeof onValueChange === 'function') {
      onValueChange(checked);
    }
  };

  return (
    <View style={[styles.switch, style]}>
      <SwitchPaper
        onValueChange={handleChangeValue}
        value={checked}
        trackColor={{ false: '#E5E7EB', true: colors.primaryLight }}
        thumbColor={'#FFFFFF'}
      />
      {label && <Text>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
});
