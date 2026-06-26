import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, MessageCircle, Phone, Mail, Users } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { ParentDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  parent: ParentDetail;
}

const QUICK_ACTIONS = [
  { label: 'Nhắn tin', icon: <MessageCircle size={22} color="#0066CC" /> },
  { label: 'Gọi điện', icon: <Phone size={22} color="#0066CC" /> },
  { label: 'Email', icon: <Mail size={22} color="#0066CC" /> },
  { label: 'Gặp mặt', icon: <Users size={22} color="#0066CC" /> },
];

export default function ParentProfileCard({ parent }: Props) {
  return (
    <View style={styles.profileCard}>
      {/* Top row: avatar + info + achievement */}
      <View style={styles.profileTopRow}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={parent.avatar} style={styles.avatar} resizeMode="cover" />
          <TouchableOpacity style={styles.cameraBtn}>
            <Icon source="camera-outline" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.parentName}>{parent.name}</Text>
          <View style={styles.studentTag}>
            <Text style={styles.studentTagText}>Phụ huynh của {parent.studentName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon source="phone-outline" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{parent.phone}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon source="email-outline" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{parent.email}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon source="map-marker-outline" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{parent.address}</Text>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity key={a.label} style={styles.actionBtn}>
            <View style={styles.actionBtnIcon}>{a.icon}</View>
            <Text style={styles.actionBtnLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
