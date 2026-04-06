import colors from '@tera/common/constants/colors';
import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { TextInput as InputPaper, TextInputProps } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: IconSource;
  style?: any;
}

export const InputPassword = React.forwardRef<
  RNTextInput,
  CustomTextInputProps
>(({ leftIcon, style, ...props }, ref) => {
  const passwordRef = React.useRef<RNTextInput>(ref as any);
  const [isShow, setIsShow] = React.useState(false);
  const [forceUpdate, setForceUpdate] = React.useState(0);
  return (
    <InputPaper
      key={forceUpdate}
      mode="outlined"
      placeholderTextColor={colors.placeholderInputText}
      outlineStyle={{
        borderRadius:
          style?.borderRadius !== undefined ? style?.borderRadius : 8,
        borderColor:
          style?.borderColor !== undefined
            ? style?.borderColor
            : colors.borderInput,
        borderWidth: style?.borderWidth !== undefined ? style?.borderWidth : 1,
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
      secureTextEntry={!isShow}
      {...props}
      ref={passwordRef}
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
        <InputPaper.Icon
          color={colors.iconInput}
          icon={isShow ? 'eye-off' : 'eye'}
          onPress={() => {
            setIsShow(!isShow);
            setForceUpdate(new Date().getTime());
            setTimeout(() => {
              if (passwordRef.current) {
                passwordRef.current.focus();
              }
            }, 50);
          }}
        />
      }
    />
  );
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
