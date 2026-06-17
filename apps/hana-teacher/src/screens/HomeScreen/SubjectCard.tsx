import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './style';

interface Props {
  title: string;
  color: string;
  image: any;
  badge?: number;
}

export default function SubjectCard({ title, color, image, badge }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.subjectCard]}>
      <View style={styles.subjectIconWrapper}>
        <Image
          source={image}
          style={styles.subjectImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}
