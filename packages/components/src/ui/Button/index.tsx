import colors from "@tera/commons/constants/colors";
import React from "react";
import { StyleSheet } from "react-native";
import { Button as ButtonPaper, ButtonProps } from "react-native-paper";

export const Button = ({ style, ...props }: ButtonProps) => {
  return (
    <ButtonPaper
      mode="contained"
      textColor={colors.white}
      {...props}
      style={[styles.button, style]}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: colors.bgButton,
  },
});
