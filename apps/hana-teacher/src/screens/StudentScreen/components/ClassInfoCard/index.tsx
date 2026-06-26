import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftRight, MapPin } from 'lucide-react-native';

import { ClassInfo } from '../../types';
import { styles } from '../../styles';

interface ClassInfoCardProps {
  info: ClassInfo;
  onSwitch?: () => void;
}

export default function ClassInfoCard({ info, onSwitch }: ClassInfoCardProps) {
  return (
    <View style={styles.classCard}>
      <Image
        source={info.image}
        style={styles.classCardImage}
        resizeMode="contain"
      />

      <View style={styles.classCardBody}>
        <Text style={styles.classCardName}>{info.name}</Text>
        <Text style={styles.classCardMeta}>
          {info.ageGroup} • {info.level}
        </Text>
        <View style={styles.classCardLocation}>
          <MapPin size={12} color="#60A5FA" />
          <Text style={styles.classCardLocationText}>
            {info.room} • {info.branch}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.classCardSwitchBtn} onPress={onSwitch}>
        <ArrowLeftRight size={13} color="#0066CC" />
        <Text style={styles.classCardSwitchText}>Đổi lớp</Text>
      </TouchableOpacity>
    </View>
  );
}
