import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Download,
  Filter,
  History,
  Info,
} from 'lucide-react-native';

import { TimetableService } from '@tera/modules/education';
import { ProfileService } from '@tera/modules/system';

import { STATS_CONFIG, getShiftMeta } from './constants';
import {
  durationMinutes,
  formatDayLabel,
  formatDuration,
  formatMonthLabel,
  getMonthRange,
  groupSessionsByDate,
  toTimesheetSessions,
} from './_utils';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const formatDate = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const TimesheetScreen = observer(() => {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);

  const [anchor, setAnchor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const { dateFrom, dateTo } = useMemo(
    () => getMonthRange(anchor.year, anchor.month),
    [anchor],
  );

  const { data: profileRes } = ProfileService.useProfile();
  const profile = (profileRes as any)?.data ?? profileRes;

  const { data, isLoading } = TimetableService.useTimetableCalendar({
    date_from: dateFrom,
    date_to: dateTo,
  });

  const sessions = useMemo(() => toTimesheetSessions((data as any)?.data), [data]);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  useEffect(() => {
    setExpandedDate(groups[0]?.date ?? null);
  }, [dateFrom, dateTo, groups.length > 0 ? groups[0].date : null]);

  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + durationMinutes(s.startTime, s.endTime),
      0,
    );
    return {
      days: groups.length,
      sessions: sessions.length,
      hours: formatDuration(totalMinutes),
      done: sessions.filter((s) => s.status === 'done').length,
    };
  }, [sessions, groups]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, [now]);

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
            <Text style={styles.headerTitle}>Bảng công</Text>
            <View style={styles.headerActions}>
              {/* Chưa có API xuất file bảng công */}
              <TouchableOpacity style={styles.headerActionBtn} onPress={notImplemented}>
                <Download size={18} color="#fff" />
                <Text style={styles.headerActionText}>Xuất file</Text>
              </TouchableOpacity>
              {/* Chưa có màn hình lịch sử các kỳ trước */}
              <TouchableOpacity style={styles.headerActionBtn} onPress={notImplemented}>
                <History size={18} color="#fff" />
                <Text style={styles.headerActionText}>Lịch sử</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.employeeCard}>
          <View style={styles.employeeLeft}>
            <Image
              source={require('@tera/assets/app/element_3.png')}
              style={styles.avatar}
            />
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>
                {profile?.full_name || 'Giáo viên'}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Giáo viên</Text>
              </View>
            </View>
          </View>

          <View style={styles.periodDivider} />

          <TouchableOpacity
            style={styles.periodBlock}
            onPress={() => setMonthModalVisible(true)}
          >
            <View style={styles.periodLabelRow}>
              <Calendar size={13} color="#64748B" />
              <Text style={styles.periodLabel}>Tháng</Text>
            </View>
            <View style={styles.periodValueRow}>
              <Text style={styles.periodValue}>
                {formatMonthLabel(anchor.year, anchor.month)}
              </Text>
              <ChevronDown size={16} color="#0066cc" />
            </View>
            <Text style={styles.periodRange}>
              {formatDate(dateFrom)} - {formatDate(dateTo)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {STATS_CONFIG.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIconWrapper, { backgroundColor: stat.color }]}>
                  <StatIcon size={16} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {(stats as any)[stat.id]}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Chi tiết bảng công</Text>
          {/* Đã lọc theo tháng ở trên — chưa có bộ lọc nâng cao riêng */}
          <TouchableOpacity style={styles.filterBtn} onPress={notImplemented}>
            <Filter size={12} color="#0066cc" />
            <Text style={styles.filterBtnText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : groups.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không có buổi dạy nào trong tháng này</Text>
          </View>
        ) : (
          groups.map((group) => {
            const { weekday, day, isWeekend } = formatDayLabel(group.date);
            const dayMinutes = group.items.reduce(
              (sum, s) => sum + durationMinutes(s.startTime, s.endTime),
              0,
            );
            const classesCount = new Set(group.items.map((s) => s.classId)).size;
            const expanded = expandedDate === group.date;

            return (
              <View key={group.date} style={styles.dayCard}>
                <TouchableOpacity
                  style={styles.dayHeaderRow}
                  onPress={() => setExpandedDate(expanded ? null : group.date)}
                >
                  <View style={styles.dayDateBlock}>
                    <Text style={styles.dayWeekday}>{weekday}</Text>
                    <Text style={[styles.dayNumber, isWeekend && styles.dayNumberWeekend]}>
                      {day}
                    </Text>
                    <Text style={styles.dayMonth}>
                      {formatMonthLabel(anchor.year, anchor.month)}
                    </Text>
                    <CheckCircle2
                      size={13}
                      color="#16A34A"
                      style={styles.dayDoneIcon}
                    />
                  </View>

                  <View style={styles.dayInfoBlock}>
                    <Text style={styles.dayInfoLabel}>Tổng thời gian dạy</Text>
                    <Text style={styles.dayInfoValue}>{formatDuration(dayMinutes)}</Text>
                  </View>

                  <View style={styles.dayMetaCol}>
                    <Text style={styles.dayMetaValue}>{classesCount} lớp</Text>
                    <Text style={styles.dayMetaLabel}>Số lớp dạy</Text>
                  </View>
                  <View style={styles.dayMetaCol}>
                    <Text style={styles.dayMetaValue}>{group.items.length} ca</Text>
                    <Text style={styles.dayMetaLabel}>Số ca dạy</Text>
                  </View>

                  {expanded ? (
                    <ChevronUp size={18} color="#94A3B8" />
                  ) : (
                    <ChevronDown size={18} color="#94A3B8" />
                  )}
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.sessionList}>
                    {group.items.map((session, index) => {
                      const shift = getShiftMeta(session.startTime);
                      return (
                        <View
                          key={session.id}
                          style={[
                            styles.sessionRow,
                            index === group.items.length - 1 && styles.sessionRowLast,
                          ]}
                        >
                          <View style={styles.shiftBlock}>
                            <View
                              style={[styles.shiftBadge, { backgroundColor: shift.bg }]}
                            >
                              <Text style={[styles.shiftBadgeText, { color: shift.color }]}>
                                {shift.label}
                              </Text>
                            </View>
                            <Text style={styles.shiftTime}>
                              {session.startTime} - {session.endTime}
                            </Text>
                          </View>

                          <View style={styles.sessionInfo}>
                            <View style={styles.sessionClassRow}>
                              <Text style={styles.sessionClassName} numberOfLines={1}>
                                {session.className}
                              </Text>
                              {!!session.level && (
                                <View style={styles.sessionLevelBadge}>
                                  <Text style={styles.sessionLevelText}>
                                    {session.level}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {!!session.sessionName && (
                              <Text style={styles.sessionLesson} numberOfLines={1}>
                                Lesson: {session.sessionName}
                              </Text>
                            )}
                          </View>

                          <View style={styles.sessionDurationCol}>
                            <Text style={styles.sessionDurationValue}>
                              {formatDuration(
                                durationMinutes(session.startTime, session.endTime),
                              )}
                            </Text>
                            <Text style={styles.sessionDurationLabel}>Giờ dạy</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={styles.infoBanner}>
          <Info size={16} color="#0066cc" />
          <Text style={styles.infoBannerText}>
            Chạm vào từng ngày để xem chi tiết lớp học và nội dung giảng dạy.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={monthModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn tháng</Text>
            <ScrollView>
              {monthOptions.map((option) => {
                const active =
                  option.year === anchor.year && option.month === anchor.month;
                return (
                  <TouchableOpacity
                    key={`${option.year}-${option.month}`}
                    style={styles.modalOption}
                    onPress={() => {
                      setAnchor(option);
                      setMonthModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        active && styles.modalOptionTextActive,
                      ]}
                    >
                      {formatMonthLabel(option.year, option.month)}
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

export default TimesheetScreen;
