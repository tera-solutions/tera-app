import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useClassRoomList } from '@tera/modules/education/class-room';

import HeaderSection from './components/HeaderSection';
import StatsSection from './components/StatsSection';
import ClassListSection from './components/ClassListSection';
import CreateClassBanner from './components/CreateClassBanner';

import { ClassItem, ClassRoomResponse } from './types';
import { getListData } from '@tera/commons/hooks';

import { styles } from './style';

const CLASS_COLORS = ['#0B84FF', '#14AE5C', '#FF9900', '#8B5CF6', '#EF4444'];

const CLASS_IMAGES = [
  require('@tera/assets/app/element_66.png'),
  require('@tera/assets/app/element_67.png'),
  require('@tera/assets/app/element_68.png'),
];

const WEEKDAY_LABELS: Record<number, string> = {
  2: 'T2',
  3: 'T3',
  4: 'T4',
  5: 'T5',
  6: 'T6',
  7: 'T7',
  8: 'CN',
};

function mapToClassItem(room: ClassRoomResponse, index: number): ClassItem {
  const schedules = room.schedules ?? [];
  const firstSchedule = schedules[0] ?? {};
  const scheduleText = schedules
    .map((s) => WEEKDAY_LABELS[s.weekday ?? 0] ?? '')
    .filter(Boolean)
    .join(', ');

  return {
    id: String(room.id),
    name: room.name ?? '',
    level: room.course?.name ?? '',
    ageGroup: '',
    room: (room.room as { name?: string } | null)?.name ?? '',
    branch: '',
    startTime: firstSchedule.start_time?.slice(0, 5) ?? '',
    endTime: firstSchedule.end_time?.slice(0, 5) ?? '',
    schedule: scheduleText,
    students: 0,
    totalStudents: room.max_capacity ?? 0,
    color: CLASS_COLORS[index % CLASS_COLORS.length],
    image: CLASS_IMAGES[index % CLASS_IMAGES.length],
  };
}

export default function ClassroomScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useClassRoomList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<ClassRoomResponse>(data);

  const classList: ClassItem[] = items.map(mapToClassItem);
  const totalClasses = pagination.total;
  const totalStudents = classList.reduce((sum, c) => sum + c.totalStudents, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeaderSection search={search} onSearch={setSearch} />

        <StatsSection totalClasses={totalClasses} totalStudents={totalStudents} />

        <ClassListSection
          classes={classList}
          isLoading={isLoading || isFetching}
          onRefresh={refetch}
        />

        <CreateClassBanner />
      </ScrollView>
    </View>
  );
}
