import { Text, View } from 'react-native';

import NotificationItem from '../NotificationItem';
import { NotificationGroupType, NotificationItemType } from '../../types';
import { styles } from '../../styles';

interface NotificationGroupProps {
  group: NotificationGroupType;
  onPressItem?: (item: NotificationItemType) => void;
}

export default function NotificationGroup({ group, onPressItem }: NotificationGroupProps) {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupDateLabel}>{group.date}</Text>
      <View style={styles.groupCard}>
        {group.items.map((item, index) => (
          <NotificationItem
            key={item.id}
            item={item}
            showSeparator={index > 0}
            onPress={onPressItem}
          />
        ))}
      </View>
    </View>
  );
}
