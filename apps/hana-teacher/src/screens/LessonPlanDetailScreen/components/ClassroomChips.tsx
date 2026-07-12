import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

import { ClassroomOption } from '../types';
import { styles } from '../styles';

interface Props {
  classrooms: ClassroomOption[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

export default function ClassroomChips({ classrooms, selectedId, onSelect }: Props) {
  if (classrooms.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.classroomChipsScroll}
      style={styles.classroomSection}
    >
      {classrooms.map((c) => {
        const active = c.id === selectedId;
        return (
          <TouchableOpacity
            key={c.id}
            style={[styles.classroomChip, active && styles.classroomChipActive]}
            onPress={() => onSelect(c.id)}
          >
            <Icon source="account-group-outline" size={14} color={active ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.classroomChipText, active && styles.classroomChipTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
