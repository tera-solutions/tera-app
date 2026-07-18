import { ScrollView, View } from 'react-native';

import HeaderSection from './components/HeaderSection';
import TodayScheduleCard from './components/TodayScheduleCard';
import QuickActionGrid from './components/QuickActionGrid';
import ClassOverviewCard from './components/ClassOverviewCard';
import StudentOverviewCard from './components/StudentOverviewCard';
import TodoSection from './components/TodoSection';
import NotificationSection from './components/NotificationSection';
import FeaturedMaterialsSection from './components/FeaturedMaterialsSection';

import { styles } from './style';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeaderSection />

        <TodayScheduleCard />

        <QuickActionGrid />

        <View style={styles.summaryRow}>
          <ClassOverviewCard
            data={{
              totalClass: 3,
              classes: ['Starters 2A', 'Movers 1B', 'Flyers 3A'],
            }}
            onPressViewAll={() => {}}
          />
          <StudentOverviewCard
            data={{
              totalStudent: 72,
              growthPercent: 8,
            }}
          />
        </View>

        <TodoSection />

        <FeaturedMaterialsSection />

        <NotificationSection />
      </ScrollView>
    </View>
  );
}
