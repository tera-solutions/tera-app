import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './style';

interface Props {
  item: any;
}

export default function HomeworkCard({
  item,
}: Props) {
  return (
    <TouchableOpacity style={styles.homeworkCard}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.homeworkTitle}>
            {item.title}
          </Text>

          <Text style={styles.lesson}>
            {item.lesson}
          </Text>
        </View>

        <StatusBadge status={item.status} />
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${item.progress}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        {item.progress}% hoàn thành
      </Text>
    </TouchableOpacity>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colorMap = {
    pending: '#F59E0B',
    doing: '#3B82F6',
    completed: '#22C55E',
  };

  const labelMap = {
    pending: 'Chưa làm',
    doing: 'Đang làm',
    completed: 'Hoàn thành',
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            colorMap[
              status as keyof typeof colorMap
            ],
        },
      ]}
    >
      <Text style={styles.badgeText}>
        {
          labelMap[
            status as keyof typeof labelMap
          ]
        }
      </Text>
    </View>
  );
}