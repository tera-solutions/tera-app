import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const DataItem: React.FC<{ item: any }> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => {
        if (!item?.table) return;

        router.push({
          pathname: '/operation/data-local/[id]',
          params: { id: item?.table },
        });
      }}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.locationName}>{item.name}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.transactionStatus,
            { color: item?.active_text?.color },
          ]}
        >
          {item?.total} rows
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DataItem;
