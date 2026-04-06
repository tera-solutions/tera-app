import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
// Tính toán kích thước mỗi ô (trừ đi padding chung của màn hình nếu có)
const ITEM_WIDTH = width / NUM_COLUMNS;

export interface GridItemType {
  id: string;
  name: string;
  icon: string;
  route: string;
  color?: string;
  isNew?: boolean;
}

interface GridItemProps {
  item: GridItemType;
  onPress: (item: GridItemType) => void;
}

export const GridItem: React.FC<GridItemProps> = ({ item, onPress }) => {
  const iconBgColor = item.color || '#F5F5F5';

  return (
    <TouchableOpacity
      style={styles.gridItemWrapper}
      onPress={() => onPress(item)}
    >
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: iconBgColor + '20' }]}>
          <Icon source={item.icon} size={28} color={item.color || '#333'} />
        </View>
        <Text style={styles.gridText}>
          {item.name}
        </Text>
        {item.isNew && (
          <View style={styles.newTag}>
            <Text style={styles.newText}>Mới</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItemWrapper: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10
  },
  content: {
    alignItems: 'center',
    width: '90%',
    position: 'relative',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    lineHeight: 16,
  },
  newTag: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
