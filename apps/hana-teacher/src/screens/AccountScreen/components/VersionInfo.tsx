import { Text } from 'react-native';

import { styles } from '../style';

export default function VersionInfo({
  version,
}: {
  version: string;
}) {
  return (
    <Text style={styles.version}>
      Phiên bản {version}
    </Text>
  );
}