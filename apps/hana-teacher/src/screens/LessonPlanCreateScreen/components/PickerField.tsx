import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Icon, Modal, Portal, Searchbar, Text, TouchableRipple } from 'react-native-paper';

import { getListData } from '@tera/commons/hooks';

import { styles } from '../styles';
import type { PickerOption } from '../types';

interface PickerFieldProps<TItem> {
  value: number | null;
  valueLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  title: string;
  useList: (payload: { params: Record<string, unknown> }) => { data?: unknown; isFetching?: boolean };
  toOption: (item: TItem) => PickerOption;
  onSelect: (option: PickerOption) => void;
}

function PickerField<TItem = any>({
  value,
  valueLabel,
  placeholder = 'Vui lòng chọn',
  disabled,
  title,
  useList,
  toOption,
  onSelect,
}: PickerFieldProps<TItem>) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items } = getListData<TItem>(data);
  const options = useMemo(() => items.map(toOption), [items]);

  const handlePick = (option: PickerOption) => {
    onSelect(option);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <TouchableRipple
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[styles.pickerButton, disabled && { opacity: 0.6 }]}
      >
        <>
          <Text style={value ? styles.pickerButtonText : styles.pickerPlaceholderText} numberOfLines={1}>
            {value ? valueLabel : placeholder}
          </Text>
          <Icon source="chevron-down" size={18} color="#94A3B8" />
        </>
      </TouchableRipple>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          <Searchbar
            placeholder="Tìm kiếm..."
            value={search}
            onChangeText={setSearch}
            style={styles.modalSearchBar}
            inputStyle={{ minHeight: 0 }}
          />

          {isFetching ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              style={{ maxHeight: 320 }}
              ListEmptyComponent={
                <Text style={[styles.emptyStateText, { paddingVertical: 16 }]}>
                  Không có dữ liệu
                </Text>
              }
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <TouchableRipple onPress={() => handlePick(item)}>
                    <View style={styles.optionRow}>
                      <Text
                        style={[styles.optionRowText, active && styles.optionRowTextActive]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      {active && <Icon source="check" size={18} color="#007AFF" />}
                    </View>
                  </TouchableRipple>
                );
              }}
            />
          )}
        </Modal>
      </Portal>
    </>
  );
}

export default PickerField;
