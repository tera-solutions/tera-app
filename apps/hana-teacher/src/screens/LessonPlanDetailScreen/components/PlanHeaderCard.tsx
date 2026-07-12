import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { LessonPlanDetailInfo } from '../types';
import { PLAN_STATUS_CONFIG } from '../constants';
import { styles } from '../styles';

interface Props {
  plan: LessonPlanDetailInfo;
}

export default function PlanHeaderCard({ plan }: Props) {
  const statusCfg = PLAN_STATUS_CONFIG[plan.status] ?? PLAN_STATUS_CONFIG.draft;
  const meta = [plan.planCode, plan.courseName, `v${plan.version}`].filter(Boolean).join(' • ');

  return (
    <View style={styles.planCard}>
      <View style={styles.planCardTop}>
        <View style={styles.planIconBox}>
          <Icon source="file-document-outline" size={24} color="#0066CC" />
        </View>

        <View style={styles.planBody}>
          <View style={styles.planTitleRow}>
            <Text style={styles.planTitle} numberOfLines={2}>
              {plan.planName || 'Giáo án'}
            </Text>
            <View style={[styles.planStatusBadge, { backgroundColor: statusCfg.bg }]}>
              <Text style={[styles.planStatusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </View>
          </View>
          {!!meta && <Text style={styles.planMeta}>{meta}</Text>}
          {!!plan.description && (
            <Text style={styles.planDescription} numberOfLines={2}>
              {plan.description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
