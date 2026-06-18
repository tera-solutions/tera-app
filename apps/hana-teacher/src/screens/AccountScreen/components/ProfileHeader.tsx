import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Mail, Phone, Star } from 'lucide-react-native';

import { styles } from '../style';

export default function ProfileHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <View style={styles.profileRow}>
        <Image
          source={require('@tera/assets/app/element_3.png')}
          style={styles.avatar}
        />

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Cô Hạ</Text>
            <Star fill="#FFD700" color="#FFD700" size={18} />
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Giáo viên</Text>
          </View>

          <View style={styles.contactRow}>
            <Mail size={16} color="#fff" />
            <Text style={styles.contactText}>anha2304@hanaedu.vn</Text>
          </View>

          <View style={styles.contactRow}>
            <Phone size={16} color="#fff" />
            <Text style={styles.contactText}>0123 456 789</Text>
          </View>
        </View>

        <TouchableOpacity>
          <ChevronRight color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
