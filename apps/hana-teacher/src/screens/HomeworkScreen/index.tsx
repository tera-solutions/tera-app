import { ScrollView } from 'react-native';

import HomeworkCard from './HomeworkCard';
import HomeworkHeader from './HomeworkHeader';
import HomeworkReward from './HomeworkReward';
import HomeworkStats from './HomeworkStats';

import { styles } from './style';

const HOMEWORKS = [
  {
    id: 1,
    title: 'Vocabulary - Animals',
    lesson: 'Lesson 5',
    progress: 70,
    status: 'doing',
  },
  {
    id: 2,
    title: 'Listening Practice',
    lesson: 'Lesson 6',
    progress: 0,
    status: 'pending',
  },
  {
    id: 3,
    title: 'Reading Practice',
    lesson: 'Lesson 4',
    progress: 100,
    status: 'completed',
  },
];

export default function HomeworkScreen() {
  return (
    <ScrollView style={styles.container}>
      <HomeworkHeader />

      <HomeworkStats />

      {HOMEWORKS.map((item) => (
        <HomeworkCard key={item.id} item={item} />
      ))}

      <HomeworkReward />
    </ScrollView>
  );
}
