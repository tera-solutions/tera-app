import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export interface BaseScreenProps {
  title: string;
  isLoading: boolean;
  error?: any;
  headerActions?: any;
  onClose: () => void;
  onConfirm?: ((value: number, type: "VNĐ" | "%") => void) | undefined;
  children?: React.ReactNode;
}

const { height } = Dimensions.get("window");

const BaseScreen = ({
  children,
  isLoading,
  error,
  headerActions,
  title,
}: BaseScreenProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.text}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Icon source="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>{title}</Text>
          <View style={{ minWidth: 24 }}>{headerActions}</View>
        </View>

        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFull: {
    overflow: "scroll",
    height: Platform.OS === "web" ? height - 10 : "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  titleText: { fontSize: 18, fontWeight: "700", color: "#1F2937" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  // Header
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 10, color: "#666" },
  errorText: { marginTop: 10, color: "red", fontWeight: "500" },
});

export default BaseScreen;
