import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const InfoItem: React.FC<{ item: any }> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.locationItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.locationName}>{item.id}</Text>
      </View>

      <View style={styles.statusContainer}>
        {Object.keys(item).map((key) => (
          <Text
            key={key}
            style={[
              styles.transactionStatus,
              { color: item?.active_text?.color },
            ]}
          >
            {key} : {item[key]}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default InfoItem;
