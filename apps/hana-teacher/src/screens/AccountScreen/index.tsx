import { ScrollView, View } from 'react-native';

import ProfileHeader from './components/ProfileHeader';
import StatsCard from './components/StatsCard';
import MenuSection from './components/MenuSection';
import SupportCard from './components/SupportCard';
import LogoutButton from './components/LogoutButton';
import VersionInfo from './components/VersionInfo';

import { MENUS, STATS } from './constants';
import { styles } from './style';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader />

        <StatsCard data={STATS} />

        <MenuSection menus={MENUS} />

        <SupportCard />

        <LogoutButton />

        <VersionInfo version="1.0.0" />
      </ScrollView>
    </View>
  );
}