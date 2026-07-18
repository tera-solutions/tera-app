import { useMemo, useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  HelpCircle,
  TrendingUp,
  Users,
} from 'lucide-react-native';

import {
  CLASS_FILTER_OPTIONS,
  CLASS_REPORT_ROWS,
  COLOR_COLLECTED,
  COLOR_OUTSTANDING,
  OVERVIEW_GROWTH,
  PAYMENT_METHOD_ROWS,
  STATUS_BUCKETS,
  TREND_SEED,
} from './constants';
import { MiniRing } from './components/MiniRing';
import { RateDonutChart } from './components/RateDonutChart';
import { TrendLineChart } from './components/TrendLineChart';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const CHART_WIDTH = Math.min(Dimensions.get('window').width - 40 - 32, 400);

const TuitionReportScreen = observer(() => {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);

  const [classFilter, setClassFilter] = useState('all');
  const [classModalVisible, setClassModalVisible] = useState(false);

  const rangeStart = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now]);
  const rangeEnd = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0), [now]);

  // 5 tháng gần nhất (tháng hiện tại là điểm cuối) — nhãn tháng được tính động
  // từ ngày hệ thống, còn số liệu là dữ liệu mẫu cố định (TREND_SEED).
  const trendPoints = useMemo(
    () =>
      TREND_SEED.map((seed, index) => {
        const offset = TREND_SEED.length - 1 - index;
        const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        return {
          label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
          collected: seed.collected,
          outstanding: seed.outstanding,
        };
      }),
    [now],
  );

  const latest = trendPoints[trendPoints.length - 1];
  const totalReceivable = latest.collected + latest.outstanding;
  const collectionRate = totalReceivable > 0 ? (latest.collected / totalReceivable) * 100 : 0;

  const overviewStats = [
    {
      id: 'total',
      label: 'Tổng thu',
      value: formatCurrency(totalReceivable),
      icon: TrendingUp,
      color: '#60A5FA',
      growth: OVERVIEW_GROWTH.total,
    },
    {
      id: 'collected',
      label: 'Đã thu',
      value: formatCurrency(latest.collected),
      icon: Calendar,
      color: '#34D399',
      growth: OVERVIEW_GROWTH.collected,
    },
    {
      id: 'outstanding',
      label: 'Còn phải thu',
      value: formatCurrency(latest.outstanding),
      icon: Users,
      color: '#FBBF24',
      growth: OVERVIEW_GROWTH.outstanding,
    },
    {
      id: 'rate',
      label: 'Tỷ lệ thu',
      value: `${collectionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: '#C4B5FD',
      growth: OVERVIEW_GROWTH.rate,
    },
  ];

  const filteredClassRows =
    classFilter === 'all'
      ? CLASS_REPORT_ROWS
      : CLASS_REPORT_ROWS.filter((c) => c.id === classFilter);

  const activeClassLabel =
    CLASS_FILTER_OPTIONS.find((c) => c.id === classFilter)?.name ?? 'Tất cả lớp học';

  const methodTotal = PAYMENT_METHOD_ROWS.reduce((sum, m) => sum + m.amount, 0) || 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Báo cáo học phí</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolbarRow}>
          {/* Chưa dựng bộ lọc khoảng ngày tuỳ chỉnh — chỉ hiển thị tháng hiện tại */}
          <TouchableOpacity style={styles.toolbarBtn} onPress={notImplemented}>
            <Calendar size={14} color="#0066cc" />
            <Text style={styles.toolbarBtnText}>
              {formatDate(rangeStart)} - {formatDate(rangeEnd)}
            </Text>
            <ChevronRight size={14} color="#0066cc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn} onPress={() => setClassModalVisible(true)}>
            <Users size={14} color="#0066cc" />
            <Text style={styles.toolbarBtnText} numberOfLines={1}>
              {activeClassLabel}
            </Text>
            <ChevronRight size={14} color="#0066cc" />
          </TouchableOpacity>
          {/* Chưa có màn hình bộ lọc nâng cao riêng */}
          <TouchableOpacity style={styles.toolbarBtn} onPress={notImplemented}>
            <Filter size={14} color="#0066cc" />
            <Text style={styles.toolbarBtnText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewCard}>
          <View style={styles.overviewHeaderRow}>
            <Text style={styles.overviewTitle}>Tổng quan trong kỳ</Text>
            {/* Chưa có dữ liệu kỳ trước thật để so sánh chi tiết */}
            <TouchableOpacity style={styles.overviewCompareBtn} onPress={notImplemented}>
              <TrendingUp size={12} color="#fff" />
              <Text style={styles.overviewCompareText}>So sánh kỳ trước</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewStatsRow}>
            {overviewStats.map((stat) => {
              const StatIcon = stat.icon;
              const isUp = stat.growth >= 0;
              return (
                <View key={stat.id} style={styles.overviewStatItem}>
                  <View style={[styles.overviewStatIcon, { backgroundColor: stat.color }]}>
                    <StatIcon size={20} color="#fff" />
                  </View>
                  <Text style={styles.overviewStatLabel}>{stat.label}</Text>
                  <Text style={styles.overviewStatValue}>{stat.value}</Text>
                  <View style={styles.overviewGrowthRow}>
                    <Text
                      style={[
                        styles.overviewGrowthText,
                        { color: isUp ? '#86EFAC' : '#FCA5A5' },
                      ]}
                    >
                      {isUp ? '↑' : '↓'} {Math.abs(stat.growth)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tình hình thu theo tháng</Text>
          <TrendLineChart points={trendPoints} width={CHART_WIDTH} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tỷ lệ thu theo tháng</Text>
          <View style={styles.donutRow}>
            <RateDonutChart collected={latest.collected} outstanding={latest.outstanding} />
            <View style={styles.donutLegend}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.chartLegendDot, { backgroundColor: COLOR_COLLECTED }]} />
                <Text style={styles.chartLegendText}>
                  Đã thu: {formatCurrency(latest.collected)} ({collectionRate.toFixed(1)}%)
                </Text>
              </View>
              <View style={[styles.chartLegendItem, { marginTop: 8 }]}>
                <View style={[styles.chartLegendDot, { backgroundColor: COLOR_OUTSTANDING }]} />
                <Text style={styles.chartLegendText}>
                  Còn phải thu: {formatCurrency(latest.outstanding)} (
                  {(100 - collectionRate).toFixed(1)}%)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bucketRow}>
          {STATUS_BUCKETS.map((bucket) => {
            const BucketIcon = bucket.icon;
            return (
              <View key={bucket.id} style={styles.bucketCard}>
                <View style={[styles.bucketIconWrapper, { backgroundColor: bucket.bg }]}>
                  <BucketIcon size={15} color={bucket.color} />
                </View>
                <Text style={styles.bucketLabel}>{bucket.label}</Text>
                <Text style={styles.bucketValue}>{formatCurrency(bucket.amount)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Tình hình thu theo lớp học</Text>
            <TouchableOpacity
              style={styles.sectionLinkRow}
              onPress={() => router.push('/setting/tuition-management')}
            >
              <Text style={styles.sectionLinkText}>Xem tất cả</Text>
              <ChevronRight size={14} color="#0066cc" />
            </TouchableOpacity>
          </View>

          {filteredClassRows.length === 0 ? (
            <Text style={{ marginTop: 12, fontSize: 12, color: '#64748B' }}>
              Không có dữ liệu cho lớp học này
            </Text>
          ) : (
            filteredClassRows.map((cls) => {
              const rate = cls.totalFee > 0 ? cls.collected / cls.totalFee : 0;
              return (
                <TouchableOpacity
                  key={cls.id}
                  style={styles.classRow}
                  onPress={() => router.push(`/edu/classroom-detail?classId=${cls.id}`)}
                >
                  <View style={[styles.classIconWrapper, { backgroundColor: cls.color }]}>
                    <Users size={16} color="#fff" />
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{cls.name}</Text>
                    <Text style={styles.classMeta}>{cls.studentCount} học sinh</Text>
                  </View>
                  <View style={styles.classAmountCol}>
                    <Text style={styles.classAmountLabel}>Đã thu</Text>
                    <Text style={styles.classAmountValue}>{formatCurrency(cls.collected)}</Text>
                  </View>
                  <View style={styles.classAmountCol}>
                    <Text style={styles.classAmountLabel}>Còn phải thu</Text>
                    <Text style={styles.classAmountValue}>{formatCurrency(cls.outstanding)}</Text>
                  </View>
                  <MiniRing percent={rate} color={cls.color} />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Tình hình thu theo hình thức thanh toán</Text>
            {/* Chưa có màn hình xem chi tiết theo hình thức thanh toán riêng */}
            <TouchableOpacity style={styles.sectionLinkRow} onPress={notImplemented}>
              <Text style={styles.sectionLinkText}>Xem chi tiết</Text>
              <ChevronRight size={14} color="#0066cc" />
            </TouchableOpacity>
          </View>

          {PAYMENT_METHOD_ROWS.map((method) => {
            const MethodIcon = method.icon;
            const percent = (method.amount / methodTotal) * 100;
            return (
              <View key={method.id} style={styles.methodRow}>
                <View style={styles.methodHeaderRow}>
                  <View style={[styles.methodIconWrapper, { backgroundColor: `${method.color}1A` }]}>
                    <MethodIcon size={14} color={method.color} />
                  </View>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodAmount}>{formatCurrency(method.amount)}</Text>
                  <Text style={styles.methodPercent}>{percent.toFixed(1)}%</Text>
                </View>
                <View style={styles.methodBarTrack}>
                  <View
                    style={[
                      styles.methodBarFill,
                      { width: `${percent}%`, backgroundColor: method.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={classModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClassModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setClassModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn lớp học</Text>
            <ScrollView>
              {CLASS_FILTER_OPTIONS.map((option) => {
                const active = option.id === classFilter;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setClassFilter(option.id);
                      setClassModalVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.modalOptionText, active && styles.modalOptionTextActive]}
                    >
                      {option.name}
                    </Text>
                    {active && <Check size={18} color="#0066cc" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

export default TuitionReportScreen;
