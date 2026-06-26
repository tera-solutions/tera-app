import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ToolItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  tools: ToolItem[];
}

export default function InClassTools({ tools }: Props) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiện ích trong học</Text>

      <View style={styles.toolsGrid}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolItem}
            onPress={() => tool.route && router.push(tool.route as any)}
          >
            <View style={[styles.toolIcon, { backgroundColor: tool.iconBg }]}>
              <Icon source={tool.iconName} size={26} color={tool.iconColor} />
            </View>
            <Text style={styles.toolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
