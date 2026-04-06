import { TextInput } from '@components/ui';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Button,
  InputAccessoryView,
  Keyboard,
  KeyboardTypeOptions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// --- Component Input Tùy chỉnh (dùng cho các trường thông tin) ---
export interface FormInputProps {
  name: string;
  label: string;
  value?: string;
  style?: any;
  onChange?: (text: string) => void;
  onBlur?: (args?: any) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  onChange,
  onBlur,
  placeholder,
  style,
  ...rest
}) => {
  const { control } = useFormContext();
  const inputAccessoryViewID = String(name);

  return (
    <View style={[styles.inputContainer, style]}>
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
              <TextInput
                inputAccessoryViewID={inputAccessoryViewID}
                style={styles.textInput}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
                placeholderTextColor="#9CA3AF"
                {...rest}
              />
              {(Platform.OS === 'ios' || Platform.OS === 'android') && (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                  <View style={styles.keyboardButton}>
                    <View />
                    <Text style={styles.keyboardLabel}>{label}</Text>
                    <Button title="Xong" onPress={() => Keyboard.dismiss()} />
                  </View>
                </InputAccessoryView>
              )}
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
    color: '#9CA3AF',
    marginBottom: 5,
  },
  inputValueWrapper: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  inputError: {
    borderBottomColor: '#dd1515',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 0,
    color: '#1F2937',
    borderWidth: 0,
    backgroundColor: 'translate',
  },
  textError: {
    color: '#dd1515',
    fontSize: 14,
    marginTop: 5,
  },
  keyboardLabel: {
    color: '#9e9e9eff',
    fontSize: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 9,
  },
  keyboardButton: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
});
