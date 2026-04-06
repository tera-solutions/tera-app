import colors from '@common/constants/colors';
import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { TextInput as InputPaper, TextInputProps } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: IconSource;
  rightIcon?: IconSource;
  style?: any;
}

export const TextInput = React.forwardRef<RNTextInput, CustomTextInputProps>(
  ({ leftIcon, rightIcon, style, ...props }, ref) => {
    return (
      <InputPaper
        mode="outlined"
        placeholderTextColor={colors.placeholderInputText}
        outlineStyle={{
          borderRadius:
            style?.borderRadius !== undefined ? style?.borderRadius : 8,
          borderColor:
            style?.borderColor !== undefined
              ? style?.borderColor
              : colors.borderInput,
          borderWidth:
            style?.borderWidth !== undefined ? style?.borderWidth : 1,
        }}
        contentStyle={{
          paddingHorizontal:
            style?.paddingHorizontal !== undefined
              ? style?.paddingHorizontal
              : 20,
          paddingVertical:
            style?.paddingVertical !== undefined ? style?.paddingVertical : 10,
        }}
        style={[styles.input, style]}
        {...props}
        ref={ref}
        left={
          leftIcon ? (
            <InputPaper.Icon
              color={colors.iconInput}
              style={styles.icon}
              icon={leftIcon}
            />
          ) : (
            props?.left
          )
        }
        right={
          rightIcon ? (
            <InputPaper.Icon color={colors.iconInput} icon={rightIcon} />
          ) : (
            props?.right
          )
        }
        returnKeyLabel="Xong"
        returnKeyType="done"
      />
    );
  },
);

Object.assign(TextInput, {
  Icon: InputPaper.Icon,
  Affix: InputPaper.Affix,
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgInput,
    height: 50,
  },
  icon: {
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
});
