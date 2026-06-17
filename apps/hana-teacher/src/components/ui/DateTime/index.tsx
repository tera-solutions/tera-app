import { DatePickerInput } from 'react-native-paper-dates';

import moment from 'moment';
import React, { useEffect } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

export interface DateTimeProps {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  value: any;
  editable?: boolean;
  onChange?: (value?: string) => void;
}

export const DateTime = ({
  style,
  onChange,
  value,
  editable = false,
  ...props
}: DateTimeProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!value) return;
    setDate(new Date(value));
  }, [value]);

  const onConfirmSingle = React.useCallback(
    (value: any) => {
      setDate(value);
      if (typeof onChange === 'function') {
        onChange(moment(value).format('YYYY-MM-DD'));
      }
    },
    [setDate],
  );

  return (
    <>
      {/* <Button onPress={() => setOpen(true)} style={styles.dateTimePicker}>
        {moment(date).format('DD/MM/YYYY')}
      </Button> */}
      <DatePickerInput
        locale="vi"
        value={date}
        onChange={onConfirmSingle}
        inputMode="start"
        presentationStyle="pageSheet"
        style={styles.dateTimePicker}
        withDateFormatInLabel={false}
        placeholder="DD/MM/YYYY"
        inputEnabled={!editable}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dateTimePicker: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
});
