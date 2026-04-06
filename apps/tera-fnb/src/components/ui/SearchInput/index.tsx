import colors from '@common/constants/colors';
import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Icon,
  TextInput as InputPaper,
  TextInputProps,
} from 'react-native-paper';

interface CustomTextInputProps extends TextInputProps {
  style?: any;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<RNTextInput, CustomTextInputProps>(
  ({ style, value, onClear, ...props }, ref) => {
    return (
      <View style={styles.searchContainer}>
        <View>
          <Icon source="magnify" size={22} color="#9CA3AF" />
        </View>
        <InputPaper
          mode="outlined"
          placeholderTextColor={colors.placeholderInputText}
          outlineStyle={{
            borderRadius: 0,
            borderColor: 'translate',
            borderWidth: 0,
          }}
          contentStyle={{
            paddingHorizontal:
              style?.paddingHorizontal !== undefined
                ? style?.paddingHorizontal
                : 20,
            paddingVertical:
              style?.paddingVertical !== undefined
                ? style?.paddingVertical
                : 10,
          }}
          style={[styles.searchInput, style]}
          {...props}
          value={value}
          ref={ref}
          returnKeyLabel="Xong"
          returnKeyType="done"
        />
        {!!(value && value.length > 0) && (
          <TouchableOpacity
            onPress={() => typeof onClear === 'function' && onClear()}
            style={{ marginLeft: 10 }}
          >
            <Icon source="close-circle" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'translate',
    borderWidth: 0,
    height: 40,
  },
  icon: {
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
});
