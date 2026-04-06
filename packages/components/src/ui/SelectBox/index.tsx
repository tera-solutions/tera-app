import colors from '@tera/common/constants/colors';
import { FONT_FAMILY } from '@tera/common/constants/typography';
import FloatButtonModal, {
  floatStyles,
} from '@components/shared/FloatButtonModal';
import React, { useMemo, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Icon, TextInput } from 'react-native-paper';

interface SelectBoxItemProps {
  value: string | number;
  text: string;
}

interface SelectBoxProps {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  value: any;
  items?: SelectBoxItemProps[];
  onChange?: (item: SelectBoxItemProps) => void;
}

export const SelectBox = ({
  style,
  items = [],
  onChange,
  ...props
}: SelectBoxProps) => {
  const [value, setValue] = useState<string | number>(items?.[0].value);
  const [showFloatModal, setShowFloatModal] = useState(false);

  const renderValue = useMemo(() => {
    return items?.find((item: SelectBoxItemProps) => item?.value === value)
      ?.text;
  }, [items, value]);

  return (
    <>
      <TextInput style={styles.input} value={`${value}`} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowFloatModal(true)}
      >
        <Text style={styles.textValue}>{renderValue}</Text>
        <View style={styles.icon}>
          <Icon source={'chevron-down'} size={20} color={colors.gray} />
        </View>
      </TouchableOpacity>
      <FloatButtonModal
        visible={showFloatModal}
        onClose={() => setShowFloatModal(false)}
        itemCount={items?.length}
      >
        {items?.map((item: SelectBoxItemProps) => (
          <TouchableOpacity
            key={item.value}
            style={[
              floatStyles.menuItem,
              {
                backgroundColor:
                  item.value === value ? colors.bgButtonActive : colors.bgWhite,
              },
            ]}
            onPress={() => {
              if (typeof onChange === 'function') {
                onChange(item);
              }
              setValue(item.value);
              setShowFloatModal(false);
            }}
          >
            <Text style={floatStyles.textStyle}>{item.text}</Text>
            {item.value === value && (
              <View style={styles.icon}>
                <Icon
                  source="check-circle-outline"
                  size={20}
                  color={colors.primaryLight}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </FloatButtonModal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    display: 'none',
  },
  icon: {
    position: 'absolute',
    zIndex: 9,
    right: 10,
  },
  button: {
    position: 'relative',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 8,
    backgroundColor: colors.white,
    color: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textValue: {
    color: colors.black,
    fontSize: 16,
    fontFamily: FONT_FAMILY.REGULAR,
  },
});
