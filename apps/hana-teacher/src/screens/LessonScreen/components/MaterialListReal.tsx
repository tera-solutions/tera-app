import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { DEFAULT_MATERIAL_STYLE, MATERIAL_STYLE } from '../constants';
import type { LessonMaterialItem } from '../types';
import { styles } from '../styles';

interface Props {
  materials: LessonMaterialItem[];
}

export const MaterialListReal = ({ materials }: Props) => {
  if (materials.length === 0) {
    return <Text style={styles.emptyText}>Chưa có tài liệu đính kèm.</Text>;
  }

  const handleOpen = (material: LessonMaterialItem) => {
    if (!material.url) {
      Toast.show({ type: 'info', text1: 'Tài liệu chưa có đường dẫn để mở' });
      return;
    }
    Linking.openURL(material.url).catch(() =>
      Toast.show({ type: 'error', text1: 'Không thể mở tài liệu' }),
    );
  };

  return (
    <View>
      {materials.map((material) => {
        const style = MATERIAL_STYLE[material.ext] ?? DEFAULT_MATERIAL_STYLE;
        const meta = [style.label, material.size].filter(Boolean).join(' • ');
        return (
          <TouchableOpacity
            key={material.id}
            style={styles.materialRow}
            activeOpacity={0.7}
            onPress={() => handleOpen(material)}
          >
            <View style={[styles.materialIconBg, { backgroundColor: style.bg }]}>
              <Icon source={style.icon} size={22} color={style.color} />
            </View>
            <View style={styles.materialBody}>
              <Text style={styles.materialName} numberOfLines={1}>
                {material.name}
              </Text>
              <Text style={styles.materialMeta}>{meta}</Text>
            </View>
            <Icon source="open-in-new" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
