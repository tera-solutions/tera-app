import { FlatList } from 'react-native';

import StudentAttendanceItem from './StudentAttendanceItem';
import type { AttendanceRow } from '../types';

interface Props {
  data: AttendanceRow[];
  selectedIds: Set<number>;
  onToggle: (studentId: number) => void;
}

export default function StudentAttendanceList({ data, selectedIds, onToggle }: Props) {
  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => String(item.student_id)}
      renderItem={({ item, index }) => (
        <StudentAttendanceItem
          item={item}
          index={index}
          selected={selectedIds.has(item.student_id)}
          onToggle={onToggle}
        />
      )}
    />
  );
}
