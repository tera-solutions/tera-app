import { Text, View, Image } from 'react-native';

import AppCard from '@components/common/AppCard';
import ProgressBar from '@components/common/ProgressBar';

export default function WeeklyChallengeCard() {
  return (
    <AppCard
      style={{
        marginHorizontal: 20,
        marginTop: 20,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('@tera/assets/app/element_25.png')}
          style={{
            width: 55
          }}
          resizeMode="contain"
        />

        <View
          style={{
            flex: 1,
            marginLeft: 16,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            Hoàn thành 10 bài học
          </Text>

          <ProgressBar progress={0.7} />
        </View>

        <Image
          source={require('@tera/assets/app/element_0.png')}
          style={{
            width: 55
          }}
          resizeMode="contain"
        />
      </View>
    </AppCard>
  );
}
