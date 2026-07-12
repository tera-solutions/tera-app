import React from 'react';
import { View } from 'react-native';
import { Icon, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { ACTIVITY_STATUS_OPTIONS, ActivityForm } from '../types';
import { emptyActivity } from '../_utils';

interface ActivityEditorProps {
  activities: ActivityForm[];
  onChange: (activities: ActivityForm[]) => void;
}

const ActivityEditor = ({ activities, onChange }: ActivityEditorProps) => {
  const updateAt = (index: number, patch: Partial<ActivityForm>) => {
    onChange(activities.map((activity, i) => (i === index ? { ...activity, ...patch } : activity)));
  };

  const removeAt = (index: number) => {
    onChange(activities.filter((_, i) => i !== index));
  };

  const addRow = () => onChange([...activities, emptyActivity()]);

  return (
    <View>
      <Text style={[styles.fieldLabel, { marginTop: 4 }]}>Hoạt động</Text>

      {activities.length === 0 && (
        <Text style={[styles.emptyStateText, { textAlign: 'left', marginBottom: 8 }]}>
          Chưa có hoạt động nào.
        </Text>
      )}

      {activities.map((activity, index) => (
        <View key={index} style={styles.activityRow}>
          <View style={styles.activityRowTop}>
            <TextInput
              value={activity.title}
              onChangeText={(text) => updateAt(index, { title: text })}
              placeholder="Tên hoạt động (vd: Warm-up)"
              style={[styles.input, { flex: 1 }]}
              maxLength={255}
            />
            <TextInput
              keyboardType="number-pad"
              value={activity.duration ? String(activity.duration) : ''}
              onChangeText={(text) => updateAt(index, { duration: text ? Number(text) : undefined })}
              placeholder="Phút"
              style={[styles.input, { width: 70 }]}
            />
            <IconButton icon="trash-can-outline" size={18} iconColor="#94A3B8" onPress={() => removeAt(index)} />
          </View>

          <TextInput
            value={activity.description}
            onChangeText={(text) => updateAt(index, { description: text })}
            placeholder="Mô tả hoạt động"
            multiline
            numberOfLines={2}
            style={[styles.input, { height: 60, marginTop: 8 }]}
            maxLength={5000}
          />

          <View style={styles.statusChipRow}>
            {ACTIVITY_STATUS_OPTIONS.map((option) => {
              const active = activity.status === option.value;
              return (
                <TouchableRipple
                  key={option.value}
                  onPress={() => updateAt(index, { status: option.value })}
                  style={[styles.statusChip, active && styles.statusChipActive]}
                >
                  <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableRipple>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableRipple onPress={addRow} style={styles.addActivityBtn}>
        <>
          <Icon source="plus" size={16} color="#64748B" />
          <Text style={styles.addActivityBtnText}>Thêm hoạt động</Text>
        </>
      </TouchableRipple>
    </View>
  );
};

export default ActivityEditor;
