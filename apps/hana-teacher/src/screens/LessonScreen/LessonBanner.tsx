import { Image, View } from 'react-native';

import { styles } from './style';

interface LessonBannerProps {
  image: any;
  onPress?: () => void;
}

export default function LessonBanner({ image, onPress }: LessonBannerProps) {
  return (
    <View style={styles.bannerContent}>
      <Image source={image} style={styles.bannerImage} resizeMode="cover" />
    </View>
  );
}
