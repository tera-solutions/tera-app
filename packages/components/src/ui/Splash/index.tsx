import React from "react";
import { Dimensions, Image, View } from "react-native";
import { Loading } from "../Loading";

const { width, height } = Dimensions.get("window");

export const Splash = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View style={{ flex: 1 }}>
      <Loading isLoading={isLoading}>
        <Image
          source={require("@assets/images/splash.webp")}
          style={{ width: width, height: height, resizeMode: "cover" }}
        />
      </Loading>
    </View>
  );
};
