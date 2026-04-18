import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Drawer as DrawerLayout } from "react-native-drawer-layout";
import { SafeAreaView } from "react-native-safe-area-context";

interface DrawerFilterProps {
  children: React.ReactNode;
  filterContent: React.ReactNode;
  drawerWidth?: number;
  swipeEnabled?: boolean;
  contentStyle?: ViewStyle;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const { width, height } = Dimensions.get("window");

const DrawerFilter: React.FC<DrawerFilterProps> = ({
  children,
  filterContent,
  isDrawerOpen,
  setIsDrawerOpen,
  drawerWidth,
  swipeEnabled = true,
  contentStyle,
}) => {
  const { width } = useWindowDimensions();
  const finalDrawerWidth = drawerWidth ?? width * 0.8;

  return (
    <DrawerLayout
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      drawerPosition="left"
      drawerType="front"
      swipeEnabled={swipeEnabled}
      drawerStyle={[styles.drawer, { width: finalDrawerWidth }]}
      renderDrawerContent={() => (
        <View style={styles.containerFull}>
          <SafeAreaView style={styles.safeArea}>{filterContent}</SafeAreaView>
        </View>
      )}
    >
      <View style={styles.containerFull}>
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </View>
    </DrawerLayout>
  );
};

export default DrawerFilter;

const styles = StyleSheet.create({
  containerFull: {
    overflow: "scroll",
    height: Platform.OS === "web" ? height - 10 : "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  drawer: {
    backgroundColor: "#FFF",
    // Shadow cho iOS & Android (RNP Style)
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  filterContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
