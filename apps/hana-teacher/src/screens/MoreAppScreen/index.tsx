import { ScrollView, View } from 'react-native';

import MoreHeader from './components/MoreHeader';
import ProfileCard from './components/ProfileCard';
import SectionGroup from './components/SectionGroup';
import UtilitiesSection from './components/UtilitiesSection';
import PromoBanner from './components/PromoBanner';

import { MAIN_SECTIONS } from './constants';
import { styles } from './styles';

export default function MoreAppScreen() {
  return (
    <View style={styles.container}>
      <MoreHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileCard />

        {MAIN_SECTIONS.map((section) => (
          <SectionGroup key={section.id} section={section} />
        ))}

        <UtilitiesSection />

        <PromoBanner />
      </ScrollView>
    </View>
  );
}
