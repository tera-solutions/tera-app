import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './style';

interface Props {
  title: string;
  image: string;
  rating: number;
  duration?: string;
  level?: string;
  tag?: string;
  onPress?: () => void;
}

export default function LessonCard({
  title,
  image,
  rating,
  duration = '15 phút',
  level = 'Beginner',
  tag = 'Tiếng Anh',
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.lessonCard}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={styles.lessonImage}
        resizeMode="cover"
      />

      <View style={styles.lessonBody}>
        <View style={styles.lessonTag}>
          <Text style={styles.lessonTagText}>{tag}</Text>
        </View>

        <Text numberOfLines={2} style={styles.lessonTitle}>
          {title}
        </Text>

        <View style={styles.lessonFooter}>
          <Text style={styles.lessonDuration}>⏱ {duration}</Text>

          <Text style={styles.lessonLevel}>📚 {level}</Text>
        </View>

        <View style={styles.lessonRatingContainer}>
          <Text style={styles.lessonRating}>⭐ {rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
