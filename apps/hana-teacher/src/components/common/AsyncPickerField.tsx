import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Icon,
  Modal,
  Portal,
  Searchbar,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { getListData } from '@tera/commons/hooks';

export interface AsyncPickerOption {
  value: number;
  label: string;
}

interface AsyncPickerFieldProps<TItem> {
  value: number | null;
  valueLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  title: string;
  useList: (
    payload: { params: Record<string, unknown> },
    options?: { enabled?: boolean },
  ) => { data?: unknown; isFetching?: boolean };
  toOption: (item: TItem) => AsyncPickerOption;
  onSelect: (option: AsyncPickerOption) => void;
  /** Narrows the list server-side, e.g. `{ class_room_id: 12 }` for a lesson picker scoped to a class. */
  filters?: Record<string, unknown>;
}

/**
 * Searchable async dropdown (course/level/class/student…) — mobile
 * equivalent of the web's `AsyncSearchSelect`. Calls the `useList` hook prop
 * directly; safe re: Rules of Hooks since it's invoked once per render at
 * the same position, same as `AsyncSearchSelect.tsx` does on web.
 */
function AsyncPickerField<TItem = any>({
  value,
  valueLabel,
  placeholder = 'Vui lòng chọn',
  disabled,
  title,
  useList,
  toOption,
  onSelect,
  filters,
}: AsyncPickerFieldProps<TItem>) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useList(
    { params: { search: search || undefined, per_page: 50, filters } },
    { enabled: !disabled },
  );

  const { items } = getListData<TItem>(data);
  const options = useMemo(() => items.map(toOption), [items]);

  const handlePick = (option: AsyncPickerOption) => {
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
              style={styles.optionsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không có dữ liệu</Text>
              }
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <TouchableRipple onPress={() => handlePick(item)}>
                    <View style={styles.optionRow}>
                      <Text
                        style={[styles.optionRowText, active && styles.optionRowTextActive]}
                        numberOfLines={2}
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

export default AsyncPickerField;

const styles = StyleSheet.create({
  pickerButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#0F172A',
  },
  pickerPlaceholderText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 16,
    maxHeight: '85%',
    padding: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  modalSearchBar: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginBottom: 8,
    elevation: 0,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 16,
  },
  optionsList: {
    maxHeight: 460,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionRowText: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  optionRowTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
