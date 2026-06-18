import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import { ScrollView } from 'react-native';
import LessonHeader from './LessonHeader';
import LessonBanner from './LessonBanner';
import LessonCategoryTabs from './LessonCategoryTabs';
import LessonTopicCard from './LessonTopicCard';

const topics = [
  {
    id: 1,
    title: '1. Chào hỏi',
    description: 'Học cách chào hỏi bằng tiếng Anh',
    image: require('@tera/assets/app/element_48.png'),
    icon: require('@tera/assets/app/element_51.png'),
    totalWords: 10,
    completedWords: 7,
    newWords: 15,
  },
  {
    id: 2,
    title: '2. Trái cây',
    description: 'Nhận biết các loại trái cây',
    image: require('@tera/assets/app/element_49.png'),
    icon: require('@tera/assets/app/element_52.png'),
    totalWords: 10,
    completedWords: 6,
    newWords: 12,
  },
  {
    id: 3,
    title: '3. Động vật',
    description: 'Học tên các con vật quen thuộc',
    image: require('@tera/assets/app/element_50.png'),
    icon: require('@tera/assets/app/element_53.png'),
    totalWords: 10,
    completedWords: 5,
    newWords: 18,
  },
];

const LessonScreen = () => {
  const [category, setCategory] = useState('all');

  return (
    <ScrollView>
      <LessonHeader />

      <View
        style={{
          paddingHorizontal: 20,
          marginTop: -40,
        }}
      >
        <LessonCategoryTabs
          activeTab={category}
          data={[
            {
              id: 'all',
              name: 'Tất cả',
              icon: require('@tera/assets/app/element_15.png'),
            },
            {
              id: 'english',
              name: 'Tiếng Anh',
              icon: require('@tera/assets/app/element_23.png'),
            },
            {
              id: 'phonics',
              name: 'Phonics',
              icon: require('@tera/assets/app/element_21.png'),
            },
            {
              id: 'grammar',
              name: 'ngữ pháp',
              icon: require('@tera/assets/app/element_2.png'),
            },
          ]}
          onChange={setCategory}
        />

        <LessonBanner
          image={require('@tera/assets/app/element_47.png')}
          onPress={() => {}}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <FlashList
          data={topics}
          renderItem={({ item }) => <LessonTopicCard topic={item} />}
        />
      </View>
    </ScrollView>
  );
};

export default LessonScreen;
