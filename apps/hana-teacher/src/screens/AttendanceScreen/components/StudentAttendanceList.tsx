import { FlatList } from 'react-native';

import StudentAttendanceItem from './StudentAttendanceItem';

export default function StudentAttendanceList({
  data,
}: any) {
  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StudentAttendanceItem item={item} />
      )}
    />
  );
}