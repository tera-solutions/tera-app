import { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { CourseService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import CourseHeader from './components/CourseHeader';
import CourseSearchBar from './components/CourseSearchBar';
import CourseCard from './components/CourseCard';

import { CourseListItem, CourseResponse } from './types';
import { styles } from './styles';

function mapToCourseItem(course: CourseResponse): CourseListItem {
  return {
    id: String(course.id),
    name: course.name,
    code: course.code ?? '',
    thumbnail: course.thumbnail ?? '',
    durationMinutes: course.duration_minutes ?? 0,
    pricePerLesson: Number(course.price_per_lesson ?? 0),
    isActive: !!course.is_active,
  };
}

export default function CourseScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = CourseService.useCourseList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items } = getListData<CourseResponse>(data);
  const courses = items.map(mapToCourseItem);

  return (
    <View style={styles.container}>
      <CourseHeader />

      <CourseSearchBar value={search} onChangeText={setSearch} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Icon source="book-open-variant" size={32} color="#CBD5E1" />
              <Text style={styles.emptyText}>Chưa có khóa học nào</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CourseCard
              item={item}
              onPress={() => router.push(`/edu/course-detail?courseId=${item.id}` as any)}
              onEdit={() => router.push(`/edu/course-create?courseId=${item.id}` as any)}
            />
          )}
        />
      )}
    </View>
  );
}
