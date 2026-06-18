import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import AppCard from '@components/common/AppCard';
import ProgressBar from '@components/common/ProgressBar';

import { styles } from './style';
import colors from '@tera/commons/constants/colors';

interface LessonTopicCardProps {
  topic: any;
  onPress?: (topic: any) => void;
}

export default function LessonTopicCard({
  topic,
  onPress,
}: LessonTopicCardProps) {
  const percent = topic.completedWords / topic.totalWords;
  const isCompleted = topic.completedWords >= topic.totalWords;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 15,
      }}
    >
      <Image
        source={
          typeof topic.image === 'string' ? { uri: topic.image } : topic.image
        }
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {topic.title}
        </Text>

        <Text numberOfLines={2} style={styles.description}>
          {topic.description}
        </Text>

        <ProgressBar
          progress={percent}
          text={`${topic.completedWords}/${topic.totalWords}`}
        />

        <View style={styles.footer}>
          <Image
            source={require('@tera/assets/app/element_14.png')}
            style={{
              width: 18,
              height: 18,
            }}
            resizeMode="contain"
          />
          <Text style={styles.wordCount}>{topic.totalWords} từ mới</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {!!topic.icon && (
          <Image
            source={
              typeof topic.icon === 'string' ? { uri: topic.icon } : topic.icon
            }
            style={styles.icon}
            resizeMode="contain"
          />
        )}

        <TouchableOpacity
          style={styles.buttonCard}
          onPress={() => onPress?.(topic)}
        >
          <Text style={styles.buttonCardText}>
            {isCompleted ? 'Ôn tập' : 'Học ngay'}
          </Text>
          <Icon source="play" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
