import { View } from 'react-native';

import MenuItem from './MenuItem';

import { styles } from '../style';

export default function MenuSection({
  menus,
}: any) {
  return (
    <View style={styles.menuCard}>
      {menus.map((item: any) => (
        <MenuItem
          key={item.id}
          item={item}
        />
      ))}
    </View>
  );
}