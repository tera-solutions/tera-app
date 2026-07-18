import { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  Search,
  Users,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import {
  CLASS_META,
  QUICK_ACTIONS,
  SEED_GROWTH_PERCENT,
  SEED_STUDENTS,
  STATUS_LABELS,
  STATUS_META,
  STATUS_TABS,
  TuitionStatus,
} from './constants';
import { styles } from './style';

const AVATARS = [
  require('@tera/assets/app/element_85.png'),
  require('@tera/assets/app/element_86.png'),
  require('@tera/assets/app/element_87.png'),
  require('@tera/assets/app/element_88.png'),
  require('@tera/assets/app/element_89.png'),
  require('@tera/assets/app/element_90.png'),
];

const avatarFor = (id: string) => {
  const sum = String(id)
    .split('')
    .reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return AVATARS[sum % AVATARS.length];
};

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const SIZE = 96;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type MainTab = 'class' | 'student';

const TuitionManagementScreen = observer(() => {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>('class');
  const [statusFilter, setStatusFilter] = useState<'all' | TuitionStatus>('all');
  const [search, setSearch] = useState('');

  const now = useMemo(() => new Date(), []);
  const monthLabel = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

  const overview = useMemo(() => {
    const totalReceivable = SEED_STUDENTS.reduce((sum, s) => sum + s.amount, 0);
    const collected = SEED_STUDENTS.filter((s) => s.status === 'paid').reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    const overdue = SEED_STUDENTS.filter((s) => s.status === 'overdue').reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    const pending = totalReceivable - collected - overdue;
    const outstanding = pending + overdue;
    return {
      totalReceivable,
      collected,
      pending,
      overdue,
      outstanding,
      studentCount: SEED_STUDENTS.length,
    };
  }, []);

  const classGroups = useMemo(() => {
    return CLASS_META.map((cls) => {
      const members = SEED_STUDENTS.filter((s) => s.classId === cls.id);
      const collected = members
        .filter((s) => s.status === 'paid')
        .reduce((sum, s) => sum + s.amount, 0);
      const totalFee = members.reduce((sum, s) => sum + s.amount, 0);
      const outstanding = totalFee - collected;
      const status: TuitionStatus = members.some((s) => s.status === 'overdue')
        ? 'overdue'
        : members.some((s) => s.status === 'pending')
          ? 'pending'
          : 'paid';
      return {
        ...cls,
        studentCount: members.length,
        totalFee,
        collected,
        outstanding,
        status,
      };
    });
  }, []);

  const keyword = search.trim().toLowerCase();

  const filteredClasses = useMemo(
    () =>
      classGroups.filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (!keyword) return true;
        return c.name.toLowerCase().includes(keyword);
      }),
    [classGroups, statusFilter, keyword],
  );

  const filteredStudents = useMemo(
    () =>
      SEED_STUDENTS.filter((s) => {
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        if (!keyword) return true;
        return (
          s.name.toLowerCase().includes(keyword) ||
          s.className.toLowerCase().includes(keyword)
        );
      }),
    [statusFilter, keyword],
  );

  const donutPct = {
    paid: overview.totalReceivable > 0 ? overview.collected / overview.totalReceivable : 0,
    pending: overview.totalReceivable > 0 ? overview.pending / overview.totalReceivable : 0,
    overdue: overview.totalReceivable > 0 ? overview.overdue / overview.totalReceivable : 0,
  };

  const handleQuickAction = (id: string) => {
    if (id === 'receipt') {
      router.push('/setting/receipt-tuition-create');
      return;
    }
    if (id === 'invoice') {
      router.push('/setting/tuition-slip');
      return;
    }
    notImplemented();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quản lý học phí</Text>
            {/* Chưa có API thông báo thật — số 12 chỉ minh hoạ giao diện */}
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/setting/notification')}
            >
              <Bell size={20} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>12</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroInfo}>
              <Text style={styles.heroLabel}>Tổng thu trong {monthLabel.toLowerCase()}</Text>
              <Text style={styles.heroValue}>{formatCurrency(overview.collected)}</Text>
              <View style={styles.heroGrowthRow}>
                <Text style={styles.heroGrowthText}>
                  ↑ {SEED_GROWTH_PERCENT}% so với tháng trước
                </Text>
              </View>
            </View>
            <View style={styles.heroIconWrapper}>
              <WalletIcon size={24} color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#2563EB' }]}>
              <ClipboardList size={15} color="#fff" />
            </View>
            <Text style={styles.statValue}>{formatCurrency(overview.totalReceivable)}</Text>
            <Text style={styles.statLabel}>Tổng phải thu</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#16A34A' }]}>
              <WalletIcon size={15} color="#fff" />
            </View>
            <Text style={styles.statValue}>{formatCurrency(overview.collected)}</Text>
            <Text style={styles.statLabel}>Đã thu</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#F97316' }]}>
              <Calendar size={15} color="#fff" />
            </View>
            <Text style={styles.statValue}>{formatCurrency(overview.outstanding)}</Text>
            <Text style={styles.statLabel}>Còn phải thu</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#8B5CF6' }]}>
              <Users size={15} color="#fff" />
            </View>
            <Text style={styles.statValue}>{overview.studentCount}</Text>
            <Text style={styles.statLabel}>Học sinh</Text>
          </View>
        </View>

        <View style={styles.quickActionsCard}>
          {QUICK_ACTIONS.map((action) => {
            const ActionIcon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.quickAction}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={styles.quickActionIcon}>
                  <ActionIcon size={18} color="#0066cc" />
                </View>
                <Text style={styles.quickActionLabel} numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Tình hình thu học phí</Text>
            {/* Chỉ hiển thị tháng hiện tại, chưa hỗ trợ đổi tháng */}
            <TouchableOpacity onPress={notImplemented}>
              <Text style={styles.periodText}>{monthLabel}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.donutRow}>
            <View style={styles.donutChartWrapper}>
              <Svg width={SIZE} height={SIZE}>
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke="#E2E8F0"
                  strokeWidth={STROKE}
                  fill="none"
                />
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke={STATUS_META.overdue.color}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${donutPct.overdue * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-((donutPct.paid + donutPct.pending) * CIRCUMFERENCE)}
                  rotation="-90"
                  origin={`${SIZE / 2},${SIZE / 2}`}
                />
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke={STATUS_META.pending.color}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${donutPct.pending * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-(donutPct.paid * CIRCUMFERENCE)}
                  rotation="-90"
                  origin={`${SIZE / 2},${SIZE / 2}`}
                />
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke={STATUS_META.paid.color}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${donutPct.paid * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={0}
                  rotation="-90"
                  origin={`${SIZE / 2},${SIZE / 2}`}
                />
              </Svg>
              <View style={styles.donutChartLabel}>
                <Text style={styles.donutChartPct}>
                  {Math.round(donutPct.paid * 100)}%
                </Text>
                <Text style={styles.donutChartCaption}>Đã thu</Text>
              </View>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_META.paid.color }]} />
                <Text style={styles.legendLabel}>
                  Đã thu ({Math.round(donutPct.paid * 100)}%)
                </Text>
                <Text style={styles.legendValue}>{formatCurrency(overview.collected)}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_META.pending.color }]} />
                <Text style={styles.legendLabel}>
                  Chưa thu ({Math.round(donutPct.pending * 100)}%)
                </Text>
                <Text style={styles.legendValue}>{formatCurrency(overview.pending)}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_META.overdue.color }]} />
                <Text style={styles.legendLabel}>
                  Quá hạn ({Math.round(donutPct.overdue * 100)}%)
                </Text>
                <Text style={styles.legendValue}>{formatCurrency(overview.overdue)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chưa có API thiết lập nhắc thanh toán tự động */}
        <TouchableOpacity style={styles.reminderBanner} onPress={notImplemented}>
          <View style={styles.reminderIconWrapper}>
            <Calendar size={18} color="#0066cc" />
          </View>
          <View style={styles.reminderText}>
            <Text style={styles.reminderTitle}>
              Nhắc nhở phụ huynh thanh toán học phí đúng hạn
            </Text>
            <Text style={styles.reminderDesc}>
              Gửi thông báo nhắc nhở tự động đến phụ huynh trước ngày đến hạn.
            </Text>
          </View>
          <View style={styles.reminderBtn}>
            <Text style={styles.reminderBtnText}>Thiết lập ngay</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.toolbarRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm học sinh, lớp học..."
              placeholderTextColor="#a7a7a7"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* Chưa có màn hình bộ lọc nâng cao riêng */}
          <TouchableOpacity style={styles.filterBtn} onPress={notImplemented}>
            <Filter size={14} color="#0066cc" />
            <Text style={styles.filterBtnText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainTabRow}>
          <TouchableOpacity
            style={[styles.mainTabItem, mainTab === 'class' && styles.mainTabItemActive]}
            onPress={() => setMainTab('class')}
          >
            <Text
              style={[styles.mainTabText, mainTab === 'class' && styles.mainTabTextActive]}
            >
              Theo lớp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mainTabItem, mainTab === 'student' && styles.mainTabItemActive]}
            onPress={() => setMainTab('student')}
          >
            <Text
              style={[styles.mainTabText, mainTab === 'student' && styles.mainTabTextActive]}
            >
              Theo học viên
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusChipsRow}>
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.statusChip, active && styles.statusChipActive]}
                onPress={() => setStatusFilter(tab.id)}
              >
                <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.listWrapper}>
          {mainTab === 'class' ? (
            filteredClasses.length === 0 ? (
              <View style={styles.emptyWrapper}>
                <Text style={styles.emptyText}>Không tìm thấy lớp học phù hợp</Text>
              </View>
            ) : (
              filteredClasses.map((cls) => (
                <TouchableOpacity
                  key={cls.id}
                  style={styles.classCard}
                  onPress={() => router.push(`/edu/classroom-detail?classId=${cls.id}`)}
                >
                  <View style={[styles.classIconWrapper, { backgroundColor: cls.color }]}>
                    <Users size={18} color="#fff" />
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{cls.name}</Text>
                    <Text style={styles.classMeta}>Sĩ số: {cls.studentCount} học viên</Text>
                  </View>
                  <View style={styles.classAmountCol}>
                    <View style={styles.classAmountRow}>
                      <Text style={styles.classAmountLabel}>Đã thu</Text>
                      <Text style={[styles.classAmountValue, { color: STATUS_META.paid.color }]}>
                        {formatCurrency(cls.collected)}
                      </Text>
                    </View>
                    <View style={styles.classAmountRow}>
                      <Text style={styles.classAmountLabel}>Chưa thu</Text>
                      <Text
                        style={[styles.classAmountValue, { color: STATUS_META.pending.color }]}
                      >
                        {formatCurrency(cls.outstanding)}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color="#CBD5E1" />
                </TouchableOpacity>
              ))
            )
          ) : filteredStudents.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>Không tìm thấy học sinh phù hợp</Text>
            </View>
          ) : (
            filteredStudents.map((student) => {
              const meta = STATUS_META[student.status];
              return (
                <TouchableOpacity
                  key={student.id}
                  style={styles.studentCard}
                  onPress={() => router.push(`/student/student-detail?studentId=${student.id}`)}
                >
                  <Image source={avatarFor(student.id)} style={styles.studentAvatar} />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentMeta}>Lớp: {student.className}</Text>
                    <Text style={styles.studentMeta}>Mã PH: {student.parentCode}</Text>
                  </View>
                  <View style={styles.studentRightCol}>
                    <View style={[styles.studentStatusBadge, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.studentStatusText, { color: meta.color }]}>
                        {STATUS_LABELS[student.status]}
                      </Text>
                    </View>
                    <Text style={styles.studentAmount}>{formatCurrency(student.amount)}</Text>
                    <Text style={styles.studentDate}>
                      {student.status === 'paid' ? 'Ngày thu' : 'Hạn'}: {formatDate(student.date)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
});

export default TuitionManagementScreen;
