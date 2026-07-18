import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Download,
  Eye,
  History,
  ImageOff,
  Mail,
  MessageCircle,
  Search,
  Share2,
  ShieldCheck,
  Star,
  User,
  Users,
} from 'lucide-react-native';

import { getListData } from '@tera/commons/hooks';
import { useStudentDetail, useStudentList } from '@tera/modules/education/student';

import { MAX_REMARK_LENGTH, SLIP_THEMES, SlipTemplate } from './constants';
import { styles } from './style';

const AVATAR_COLORS = ['#2563EB', '#16A34A', '#F97316', '#8B5CF6', '#DB2777', '#0891B2'];

const colorFor = (id: string) => {
  const sum = String(id)
    .split('')
    .reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const initialsOf = (name?: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? '';
  return last.toUpperCase();
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const colorsPrimary = '#0066cc';

const TuitionSlipScreen = observer(() => {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);

  const [theme, setTheme] = useState<SlipTemplate>(SLIP_THEMES[0].id);
  const [monthIndex, setMonthIndex] = useState(0);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const [search, setSearch] = useState('');
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [tuitionPerMonth, setTuitionPerMonth] = useState('');
  const [attendanceDays, setAttendanceDays] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improve, setImprove] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [slipImageFailed, setSlipImageFailed] = useState(false);

  const activeTheme = SLIP_THEMES.find((t) => t.id === theme) ?? SLIP_THEMES[0];

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
      }),
    [now],
  );
  const activeMonth = monthOptions[monthIndex];
  const monthLabel = `Tháng ${activeMonth.month + 1}/${activeMonth.year}`;

  // Ảnh phiếu học phí do hệ thống (server anhnguhana.com) tự tạo theo tháng,
  // KHÔNG phải do app này tạo/lưu. Quy ước tên file theo mẫu bạn cung cấp:
  // hocphi{MM}{YY}.png (vd hocphi0325.png = tháng 03/2025). Repo này chưa có
  // API nào trả về link ảnh, nên URL được dựng trực tiếp theo quy ước trên —
  // nếu server đổi quy ước đặt tên (vd thêm mã lớp/học sinh), cần cập nhật lại.
  const slipImageUrl = useMemo(() => {
    const mm = String(activeMonth.month + 1).padStart(2, '0');
    const yy = String(activeMonth.year % 100).padStart(2, '0');
    return `https://api.anhnguhana.com/assets/hocphi/hocphi${mm}${yy}.png`;
  }, [activeMonth]);

  useEffect(() => {
    setSlipImageFailed(false);
  }, [slipImageUrl]);

  const { data: studentListRes, isLoading: isLoadingStudents } = useStudentList(
    { params: { search: search || undefined, per_page: 30 } as any },
    { enabled: studentModalVisible },
  );
  const { items: studentOptions } = getListData<any>(studentListRes);

  const { data: studentDetailRes } = useStudentDetail(
    { id: selectedStudentId ?? '' },
    { enabled: !!selectedStudentId },
  );
  const studentRaw = (studentDetailRes as any)?.data ?? studentDetailRes;

  const student = selectedStudentId
    ? {
        id: selectedStudentId,
        name: studentRaw?.name ?? '',
        className: studentRaw?.class_name ?? studentRaw?.level?.name ?? '',
      }
    : null;

  const canAct = !!student;

  const handleShare = async () => {
    if (!canAct) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn học sinh trước' });
      return;
    }
    // Dùng Share API gốc của thiết bị (mở sheet chia sẻ/in thật của hệ điều
    // hành) — chưa tích hợp thư viện in trực tiếp (react-native-print) hay
    // xuất file PDF/ảnh.
    try {
      await Share.share({
        message:
          `PHIẾU HỌC PHÍ - ${monthLabel}\n` +
          `Học sinh: ${student?.name}\n` +
          `Lớp: ${student?.className || '—'}\n` +
          `Học phí/tháng: ${tuitionPerMonth || '—'}\n` +
          `Ngày đi học trong tháng: ${attendanceDays || '—'}\n` +
          `Điểm mạnh: ${strengths || '—'}\n` +
          `Cần phát huy: ${improve || '—'}`,
      });
    } catch {
      // Người dùng hủy chia sẻ hoặc thiết bị không hỗ trợ — không cần xử lý thêm.
    }
  };

  const handleGuardedStub = () => {
    if (!canAct) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn học sinh trước' });
      return;
    }
    notImplemented();
  };

  // Zalo không cung cấp deep-link để gửi trước nội dung/ảnh vào một cuộc trò
  // chuyện cụ thể (khác WhatsApp), và app chưa đăng ký Zalo Open SDK/App ID.
  // Theo hướng dẫn: dùng thẳng link ảnh phiếu học phí do server tạo sẵn
  // (slipImageUrl) thay vì chụp màn hình client — mở khay chia sẻ gốc của hệ
  // điều hành kèm link đó, giáo viên chọn Zalo trong khay rồi chọn cuộc trò
  // chuyện để gửi. Không thể tự động chọn sẵn Zalo/người nhận nếu thiếu SDK.
  const handleShareZalo = async () => {
    if (!canAct) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn học sinh trước' });
      return;
    }
    try {
      await Share.share({
        message:
          `Phiếu học phí ${monthLabel} - ${student?.name}\n` +
          `Xem/tải ảnh phiếu học phí: ${slipImageUrl}`,
      });
    } catch {
      // Người dùng hủy chia sẻ hoặc thiết bị không hỗ trợ — không cần xử lý thêm.
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phiếu học phí</Text>
          {/* Chưa có màn hình lịch sử phiếu học phí đã tạo */}
          <TouchableOpacity style={styles.headerLinkBtn} onPress={notImplemented}>
            <History size={16} color="#fff" />
            <Text style={styles.headerLinkText}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.themeRow}>
          {SLIP_THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.themeChip,
                  { backgroundColor: active ? t.accentSoft : styles.themeChip.backgroundColor },
                  active && { borderColor: t.accent },
                ]}
                onPress={() => setTheme(t.id)}
              >
                <View style={[styles.themeChipIcon, { backgroundColor: t.accentSoft }]}>
                  <User size={16} color={t.accent} />
                </View>
                <Text
                  style={[styles.themeChipLabel, active && { color: t.accent, fontWeight: '800' }]}
                >
                  {t.label}
                </Text>
                <View
                  style={[
                    styles.themeChipRadio,
                    active && { borderColor: t.accent, backgroundColor: t.accent },
                  ]}
                >
                  {active && <Check size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            styles.slipCard,
            { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder },
          ]}
        >
          <View style={styles.slipHeader}>
            <Text style={[styles.slipBrand, { color: activeTheme.accent }]}>Hana</Text>
            <Text style={styles.slipBrandSub}>ENGLISH</Text>
            <Text style={styles.slipTagline}>Speak with Confidence, Shine in Life</Text>
          </View>

          <View style={[styles.slipTitleBanner, { backgroundColor: activeTheme.accentSoft }]}>
            <Text style={[styles.slipTitleText, { color: activeTheme.accent }]}>
              PHIẾU HỌC PHÍ
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.monthPill, { borderColor: activeTheme.cardBorder }]}
            onPress={() => setMonthModalVisible(true)}
          >
            <Text style={[styles.monthPillText, { color: activeTheme.accent }]}>
              {monthLabel}
            </Text>
            <ChevronRight size={14} color={activeTheme.accent} />
          </TouchableOpacity>

          <View style={styles.slipFieldsWrapper}>
            <TouchableOpacity
              style={styles.slipFieldRow}
              disabled={previewMode}
              onPress={() => setStudentModalVisible(true)}
            >
              <View style={[styles.slipFieldIcon, { backgroundColor: activeTheme.accentSoft }]}>
                <User size={14} color={activeTheme.accent} />
              </View>
              <Text style={styles.slipFieldLabel}>Học sinh:</Text>
              <Text
                style={[
                  styles.slipFieldValue,
                  !student && styles.slipFieldPlaceholder,
                  { borderBottomWidth: previewMode ? 0 : 1, borderColor: activeTheme.cardBorder },
                ]}
                numberOfLines={1}
              >
                {student?.name || 'Chọn học sinh'}
              </Text>
            </TouchableOpacity>

            <View style={styles.slipFieldRow}>
              <View style={[styles.slipFieldIcon, { backgroundColor: activeTheme.accentSoft }]}>
                <Users size={14} color={activeTheme.accent} />
              </View>
              <Text style={styles.slipFieldLabel}>Lớp:</Text>
              <Text style={[styles.slipFieldValue, !student && styles.slipFieldPlaceholder]}>
                {student?.className || '—'}
              </Text>
            </View>

            <View style={styles.slipFieldRow}>
              <View style={[styles.slipFieldIcon, { backgroundColor: activeTheme.accentSoft }]}>
                <DollarSign size={14} color={activeTheme.accent} />
              </View>
              <Text style={styles.slipFieldLabel}>Học phí/tháng:</Text>
              {previewMode ? (
                <Text style={[styles.slipFieldValue, !tuitionPerMonth && styles.slipFieldPlaceholder]}>
                  {tuitionPerMonth || '—'}
                </Text>
              ) : (
                <RNTextInput
                  style={[styles.slipFieldInput, { borderColor: activeTheme.cardBorder }]}
                  placeholder="VD: 1.800.000đ"
                  placeholderTextColor="#a7a7a7"
                  value={tuitionPerMonth}
                  onChangeText={setTuitionPerMonth}
                />
              )}
            </View>

            <View>
              <View style={styles.slipFieldRow}>
                <View style={[styles.slipFieldIcon, { backgroundColor: activeTheme.accentSoft }]}>
                  <Calendar size={14} color={activeTheme.accent} />
                </View>
                <Text style={styles.slipFieldLabel}>Ngày đi học trong tháng:</Text>
              </View>
              {previewMode ? (
                <Text
                  style={[
                    styles.slipAttendanceInput,
                    { borderColor: 'transparent' },
                    !attendanceDays && styles.slipFieldPlaceholder,
                  ]}
                >
                  {attendanceDays || '—'}
                </Text>
              ) : (
                <RNTextInput
                  style={[styles.slipAttendanceInput, { borderColor: activeTheme.cardBorder }]}
                  placeholder="VD: 4, 6, 8, 11, 13, 15, 18, 20, 22, 25, 27, 29"
                  placeholderTextColor="#a7a7a7"
                  multiline
                  value={attendanceDays}
                  onChangeText={setAttendanceDays}
                />
              )}
            </View>
          </View>

          <View style={[styles.remarkBox, { borderColor: activeTheme.cardBorder }]}>
            <View style={styles.remarkHeaderRow}>
              <View style={[styles.remarkHeaderIcon, { backgroundColor: activeTheme.accentSoft }]}>
                <Star size={13} color={activeTheme.accent} />
              </View>
              <Text style={[styles.remarkHeaderText, { color: activeTheme.accent }]} numberOfLines={2}>
                Nhận xét quá trình học tập trong {monthLabel.toLowerCase()} vừa qua:
              </Text>
            </View>

            <Text style={styles.remarkFieldLabel}>Điểm mạnh:</Text>
            {previewMode ? (
              <Text style={[styles.remarkFieldInput, { borderColor: 'transparent' }, !strengths && styles.slipFieldPlaceholder]}>
                {strengths || '—'}
              </Text>
            ) : (
              <RNTextInput
                style={[styles.remarkFieldInput, { borderColor: activeTheme.cardBorder }]}
                placeholder="Nhập điểm mạnh của học sinh"
                placeholderTextColor="#a7a7a7"
                multiline
                value={strengths}
                onChangeText={(t) => setStrengths(t.slice(0, MAX_REMARK_LENGTH))}
              />
            )}

            <Text style={styles.remarkFieldLabel}>Cần phát huy:</Text>
            {previewMode ? (
              <Text style={[styles.remarkFieldInput, { borderColor: 'transparent' }, !improve && styles.slipFieldPlaceholder]}>
                {improve || '—'}
              </Text>
            ) : (
              <RNTextInput
                style={[styles.remarkFieldInput, { borderColor: activeTheme.cardBorder }]}
                placeholder="Nhập điều cần phát huy thêm"
                placeholderTextColor="#a7a7a7"
                multiline
                value={improve}
                onChangeText={(t) => setImprove(t.slice(0, MAX_REMARK_LENGTH))}
              />
            )}
          </View>
        </View>

        <View style={styles.serverImageCard}>
          <View style={styles.serverImageHeaderRow}>
            <Text style={styles.serverImageTitle}>Ảnh phiếu học phí trên hệ thống</Text>
            <Text style={styles.serverImageLink} numberOfLines={1}>
              {slipImageUrl}
            </Text>
          </View>
          {slipImageFailed ? (
            <View style={styles.serverImageErrorBox}>
              <ImageOff size={18} color="#94A3B8" />
              <Text style={styles.serverImageErrorText}>
                Chưa tìm thấy ảnh cho {monthLabel.toLowerCase()} trên hệ thống
              </Text>
            </View>
          ) : (
            <Image
              key={slipImageUrl}
              source={{ uri: slipImageUrl }}
              style={styles.serverImagePreview}
              resizeMode="cover"
              onError={() => setSlipImageFailed(true)}
            />
          )}
        </View>

        <View style={styles.actionsWrapper}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => setPreviewMode((prev) => !prev)}
            >
              <Eye size={16} color={colorsPrimary} />
              <Text style={[styles.actionBtnText, { color: colorsPrimary }]}>
                {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
              </Text>
            </TouchableOpacity>
            {/* Chưa có API/thư viện xuất phiếu thành file ảnh hoặc PDF */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary, !canAct && styles.actionBtnDisabled]}
              disabled={!canAct}
              onPress={handleGuardedStub}
            >
              <Download size={16} color="#fff" />
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>Lưu phiếu</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOutline, !canAct && styles.actionBtnDisabled]}
            disabled={!canAct}
            onPress={handleShare}
          >
            <Share2 size={16} color={colorsPrimary} />
            <Text style={[styles.actionBtnText, { color: colorsPrimary }]}>Chia sẻ / In</Text>
          </TouchableOpacity>

          <View style={styles.actionsRow}>
            {/* Chưa có tích hợp gửi email thật */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnGreen, !canAct && styles.actionBtnDisabled]}
              disabled={!canAct}
              onPress={handleGuardedStub}
            >
              <Mail size={16} color="#16A34A" />
              <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Gửi email</Text>
            </TouchableOpacity>
            {/* Chưa có Zalo Open SDK/App ID — dùng link ảnh phiếu học phí do
                server tạo sẵn, mở khay chia sẻ gốc của hệ điều hành, chọn
                Zalo trong đó để gửi */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnZalo, !canAct && styles.actionBtnDisabled]}
              disabled={!canAct}
              onPress={handleShareZalo}
            >
              <MessageCircle size={16} color="#2563EB" />
              <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>Gửi qua Zalo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securityBanner}>
          <ShieldCheck size={18} color="#0066cc" />
          <Text style={styles.securityText}>
            Thông tin được bảo mật và chỉ sử dụng cho mục đích quản lý học phí.
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
              {monthOptions.map((option, index) => {
                const active = index === monthIndex;
                return (
                  <TouchableOpacity
                    key={`${option.year}-${option.month}`}
                    style={styles.modalOption}
                    onPress={() => {
                      setMonthIndex(index);
                      setMonthModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                      Tháng {option.month + 1}/{option.year}
                    </Text>
                    {active && <Check size={18} color="#0066cc" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={studentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStudentModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setStudentModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn học sinh</Text>
            <View style={styles.searchInputWrapper}>
              <Search size={16} color="#94A3B8" />
              <RNTextInput
                style={styles.searchInput}
                placeholder="Tìm theo tên học sinh"
                placeholderTextColor="#a7a7a7"
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <ScrollView>
              {isLoadingStudents ? (
                <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
              ) : studentOptions.length === 0 ? (
                <Text style={styles.emptyText}>Không tìm thấy học sinh</Text>
              ) : (
                studentOptions.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.studentPickRow}
                    onPress={() => {
                      setSelectedStudentId(String(item.id));
                      setStudentModalVisible(false);
                    }}
                  >
                    <View
                      style={[styles.initialsAvatar, { backgroundColor: colorFor(String(item.id)) }]}
                    >
                      <Text style={styles.initialsText}>{initialsOf(item.name)}</Text>
                    </View>
                    <Text style={styles.studentPickName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <ChevronRight size={18} color="#CBD5E1" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

export default TuitionSlipScreen;
