import { Text, View } from 'react-native';

import { styles } from '../../styles';

interface Props {
  description: string;
}

export default function DescriptionSection({ description }: Props) {
  return (
    <View style={styles.descCard}>
      <Text style={styles.descTitle}>Mô tả bài kiểm tra</Text>
      <Text style={styles.descText}>{description}</Text>
    </View>
  );
}
