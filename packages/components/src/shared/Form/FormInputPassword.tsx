import { InputPassword } from "@components/ui";
import { Controller, useFormContext } from "react-hook-form";
import { KeyboardTypeOptions, StyleSheet, Text, View } from "react-native";

// --- Component Input Tùy chỉnh (dùng cho các trường thông tin) ---
export interface FormInputPasswordProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: (args?: any) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
}

export const FormInputPassword: React.FC<FormInputPasswordProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  ...rest
}) => {
  const { control } = useFormContext();
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <View
              style={[styles.inputValueWrapper, !!error && styles.inputError]}
            >
              <InputPassword
                style={styles.textInput}
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
                placeholderTextColor="#9CA3AF"
                {...rest}
              />
            </View>
            {error && (
              <Text style={styles.textError}>{error?.message as string}</Text>
            )}
          </View>
        )}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  inputLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 5,
  },
  inputValueWrapper: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  inputError: {
    borderBottomColor: "#dd1515",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 0,
    color: "#1F2937",
    borderWidth: 0,
    backgroundColor: "translate",
  },
  textError: {
    color: "#dd1515",
    fontSize: 14,
    marginTop: 5,
  },
});
