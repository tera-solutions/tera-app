import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import HeaderSection from './components/HeaderSection';
import StatsSection from './components/StatsSection';
import ClassListSection from './components/ClassListSection';
import CreateClassBanner from './components/CreateClassBanner';

import { classes } from './mocks';

import { styles } from './style';

export default function ClassroomScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeaderSection />

        <StatsSection />

        <ClassListSection classes={classes} />

        <CreateClassBanner />
      </ScrollView>
    </View>
  );
}