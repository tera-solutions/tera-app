import { Switch } from "@components/ui/Switch";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

// --- Component Input Tùy chỉnh (dùng cho các trường thông tin) ---
export interface FormSwitchProps {
  name: string;
  label: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  onValueChange,
  ...rest
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <Switch
            label={label}
            value={value}
            onValueChange={(checked) => {
              onChange(checked);
              if (typeof onValueChange === "function") {
                onValueChange(checked);
              }
            }}
            {...rest}
          />
          {error && (
            <Text style={styles.textError}>{error?.message as string}</Text>
          )}
        </View>
      )}
      name={name}
    />
  );
};

const styles = StyleSheet.create({
  textError: {
    color: "#dd1515",
    fontSize: 14,
    marginTop: 5,
  },
});
