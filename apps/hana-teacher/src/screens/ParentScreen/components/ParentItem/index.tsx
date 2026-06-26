import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ellipsis, MessageCircle, Phone } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ParentItem as ParentItemType } from '../../types';
import { styles } from '../../styles';

interface Props {
  item: ParentItemType;
  onMessage?: (item: ParentItemType) => void;
  onCall?: (item: ParentItemType) => void;
  onPress?: (item: ParentItemType) => void;
}

const STATUS_CONFIG = {
  contacted: { label: 'Đã liên hệ', bg: '#F0FDF4', color: '#16A34A' },
  not_contacted: { label: 'Chưa liên hệ', bg: '#FFF7ED', color: '#EA580C' },
} as const;

export default function ParentItem({ item, onMessage, onCall, onPress }: Props) {
  const router = useRouter();
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <TouchableOpacity
      style={styles.parentCard}
      onPress={() => {
        router.push(`/student/parent-detail?parentId=${item.id}` as any);
        onPress?.(item);
      }}
    >
      <View style={styles.parentCardTop}>
        {/* Avatar */}
        <Image
          source={item.avatar}
          style={styles.avatar}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.parentInfo}>
          <Text style={styles.parentName}>
            {item.title} {item.name}
          </Text>
          <View style={styles.parentMeta}>
            <Icon source="account-outline" size={13} color="#94A3B8" />
            <Text style={styles.parentMetaText}>
              {item.relation} của {item.studentName}
            </Text>
          </View>
          <View style={styles.parentMeta}>
            <Icon source="phone-outline" size={13} color="#94A3B8" />
            <Text style={styles.parentMetaText}>{item.phone}</Text>
          </View>
        </View>

        {/* Right: status + menu */}
        <View style={styles.parentRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
          {item.lastContact && (
            <Text style={styles.lastContactText}>{item.lastContact}</Text>
          )}
          <TouchableOpacity style={styles.menuBtn}>
            <Ellipsis size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onMessage?.(item)}>
          <MessageCircle size={15} color="#0066CC" />
          <Text style={styles.actionBtnText}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onCall?.(item)}>
          <Phone size={15} color="#22C55E" />
          <Text style={styles.actionBtnText}>Gọi điện</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
