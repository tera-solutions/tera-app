import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import LessonCard from './LessonCard';
import SectionHeader from '@components/common/SectionHeader';

const lessons = [
  {
    id: '1',
    title: 'Thực hành nhân chia',
    rating: 4.8,
    image: 'https://picsum.photos/300',
  },
  {
    id: '2',
    title: 'Đọc truyện Doreamon',
    rating: 4.8,
    image: 'https://picsum.photos/301',
  },
  {
    id: '3',
    title: 'Học từ vựng cơ bản',
    rating: 4.8,
    image: 'https://picsum.photos/302',
  },
  {
    id: '4',
    title: 'Khám phá vũ trụ',
    rating: 4.8,
    image: 'https://picsum.photos/303',
  },
];

export default function LessonSection() {
  return (
    <>
      <SectionHeader title="Gợi ý bài học" actionText="Xem tất cả" />
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <FlashList
          horizontal
          data={lessons}
          renderItem={({ item }) => <LessonCard {...item} />}
        />
      </View>
    </>
  );
}
