import { formatNumber } from '@tera/commons/utils';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

export interface Table {
  id: string;
  name: string;
  status: 'available' | 'using' | 'reserved';
  timeUsage?: string;
  currentTotal?: number;
  customerCount?: number;
}

interface TableCardProps {
  table: Table;
  onPress: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPress }) => {
  const isUsing = table.status === 'using';

  const TableIcon = () => (
    <View style={styles.tableIconWrapper}>
      <Icon
        source="table-furniture"
        size={35}
        color={isUsing ? '#3B82F6' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.tableCard,
        isUsing ? styles.tableCardUsing : styles.tableCardAvailable,
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.tableName, { color: isUsing ? '#3B82F6' : '#1F2937' }]}
      >
        {table.name}
      </Text>

      {isUsing ? (
        <View style={styles.tableInfo}>
          <Text style={styles.tableTime}>{table.timeUsage}</Text>
          <Text style={styles.tableTotal}>
            {formatNumber(table.currentTotal)} VNĐ
          </Text>
          <View style={styles.customerCountBadge}>
            <Text style={styles.customerCountText}>{table.customerCount}</Text>
            <Icon source="plus" size={14} color="#3B82F6" />
          </View>
        </View>
      ) : (
        <TableIcon />
      )}
    </TouchableOpacity>
  );
};

export default TableCard;
