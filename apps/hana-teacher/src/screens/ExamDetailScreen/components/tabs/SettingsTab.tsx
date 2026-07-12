import { useState } from 'react';
import { Text, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';

import { MOCK_SETTINGS } from '../../constants';
import { styles } from '../../styles';

export default function SettingsTab() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_SETTINGS.map((s) => [s.id, s.value])),
  );

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabCardTitle}>Cài đặt bài kiểm tra</Text>
      <Text style={styles.tabCardHint}>
        Dữ liệu minh họa — các tùy chọn dưới đây chưa được lưu lên hệ thống.
      </Text>

      {MOCK_SETTINGS.map((s) => (
        <View key={s.id} style={styles.settingRow}>
          <View style={styles.settingIconBox}>
            <Icon source={s.iconName} size={18} color="#64748B" />
          </View>
          <Text style={styles.settingLabel}>{s.label}</Text>
          <Switch
            value={values[s.id]}
            onValueChange={(v) => setValues((prev) => ({ ...prev, [s.id]: v }))}
            color="#0066CC"
          />
        </View>
      ))}
    </View>
  );
}
