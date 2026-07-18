import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  History,
  Paperclip,
  Search,
  ShieldCheck,
  User,
  UserRound,
  Users,
} from 'lucide-react-native';

import { getListData } from '@tera/commons/hooks';
import { useStudentDetail, useStudentList } from '@tera/modules/education/student';
import { useClassRoomList } from '@tera/modules/education/class-room';
import { DateTime } from '@components/ui/DateTime';

import {
  FEE_TYPES,
  MAX_NOTE_LENGTH,
  PAYMENT_METHODS,
  RECEIPT_TEMPLATES,
  ReceiptTemplate,
} from './constants';
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

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const TuitionReceiptCreateScreen = observer(() => {
  const router = useRouter();

  const [template, setTemplate] = useState<ReceiptTemplate>(RECEIPT_TEMPLATES[0].id);

  const [classFilter, setClassFilter] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedParentName, setSelectedParentName] = useState<string | null>(null);
  const [parentCustomName, setParentCustomName] = useState('');
  const [isCustomParent, setIsCustomParent] = useState(false);

  const [receiptDate, setReceiptDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [feeTypeId, setFeeTypeId] = useState(FEE_TYPES[0].id);
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
  const [description, setDescription] = useState('');

  const [classModalVisible, setClassModalVisible] = useState(false);
  const [feeModalVisible, setFeeModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [parentModalVisible, setParentModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: classListRes } = useClassRoomList({ params: { per_page: 50 } });
  const { items: classOptions } = getListData<any>(classListRes);

  const { data: studentListRes, isLoading: isLoadingStudents } = useStudentList(
    { params: { search: search || undefined, per_page: 30 } as any },
    { enabled: !selectedStudentId },
  );
  const { items: studentOptionsRaw } = getListData<any>(studentListRes);
  const studentOptions = classFilter
    ? studentOptionsRaw.filter(
        (item: any) =>
          (item.class_name ?? item.level?.name) === classFilter.name,
      )
    : studentOptionsRaw;

  const { data: studentDetailRes, isLoading: isLoadingDetail } = useStudentDetail(
    { id: selectedStudentId ?? '' },
    { enabled: !!selectedStudentId },
  );
  const studentRaw = (studentDetailRes as any)?.data ?? studentDetailRes;

  const student = selectedStudentId
    ? {
        id: selectedStudentId,
        name: studentRaw?.name ?? '',
        className: studentRaw?.class_name ?? studentRaw?.level?.name ?? '',
        parents: (studentRaw?.parents ?? []) as {
          name: string;
          relation?: string;
        }[],
      }
    : null;

  const parentDisplay = isCustomParent
    ? parentCustomName || 'Chưa nhập tên'
    : selectedParentName ?? 'Chọn phụ huynh';

  const feeType = FEE_TYPES.find((f) => f.id === feeTypeId);
  const paymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethodId);
  const amountNumber = parseInt(amount.replace(/\D/g, ''), 10) || 0;

  const canSubmit =
    !!student &&
    amountNumber > 0 &&
    (isCustomParent ? parentCustomName.trim().length > 0 : !!selectedParentName) &&
    !isSubmitting;

  const handlePickStudent = (item: any) => {
    setSelectedStudentId(String(item.id));
    setSelectedParentName(null);
    setIsCustomParent(false);
  };

  const handleChangeStudent = () => {
    setSelectedStudentId(null);
    setSelectedParentName(null);
    setIsCustomParent(false);
  };

  // Chưa có API tạo phiếu thu học phí thật (InvoiceAPI/DebtAPI trong
  // services/api chỉ là scaffold CRUD chưa xác nhận field với BE, chưa có
  // route riêng cho phiếu thu học phí) — lưu chỉ mô phỏng ở client, KHÔNG gọi
  // API thật, giống cách ReceiptCreateScreen đã làm.
  const handleSave = (sendToParent: boolean) => {
    if (!canSubmit) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: sendToParent
          ? 'Đã lưu & gửi thông báo cho phụ huynh (mô phỏng)'
          : 'Đã lưu phiếu thu học phí (mô phỏng)',
        text2: `${student?.name} • ${formatCurrency(amountNumber)}đ`,
      });
      router.back();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo phiếu thu học phí</Text>
          {/* Chưa có API lịch sử phiếu thu */}
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
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Chọn mẫu phiếu thu</Text>
          </View>
          <View style={styles.templateRow}>
            {RECEIPT_TEMPLATES.map((tpl) => {
              const active = tpl.id === template;
              return (
                <TouchableOpacity
                  key={tpl.id}
                  style={[styles.templateCard, active && styles.templateCardActive]}
                  onPress={() => setTemplate(tpl.id)}
                >
                  <View style={[styles.templateIconWrapper, { backgroundColor: tpl.bg }]}>
                    <UserRound size={30} color={tpl.color} />
                  </View>
                  <Text style={[styles.templateLabel, active && styles.templateLabelActive]}>
                    {tpl.label}
                  </Text>
                  <View
                    style={[
                      styles.templateCheckWrapper,
                      active && styles.templateCheckWrapperActive,
                    ]}
                  >
                    {active && <Check size={13} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <User size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Thông tin học sinh</Text>
          </View>

          {!student ? (
            <>
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

              <TouchableOpacity
                style={[styles.formRow, { marginTop: 4 }]}
                onPress={() => setClassModalVisible(true)}
              >
                <Text style={styles.formLabel}>Lọc theo lớp học</Text>
                <View style={styles.formValueBtn}>
                  <Text
                    style={[styles.formValueText, !classFilter && styles.formValuePlaceholder]}
                    numberOfLines={1}
                  >
                    {classFilter?.name ?? 'Tất cả lớp'}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {isLoadingStudents ? (
                <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
              ) : studentOptions.length === 0 ? (
                <Text style={styles.emptyText}>Không tìm thấy học sinh</Text>
              ) : (
                studentOptions.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.studentPickRow}
                    onPress={() => handlePickStudent(item)}
                  >
                    <View
                      style={[
                        styles.initialsAvatar,
                        { backgroundColor: colorFor(String(item.id)) },
                      ]}
                    >
                      <Text style={styles.initialsText}>{initialsOf(item.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentPickName}>{item.name}</Text>
                      {!!(item.class_name ?? item.level?.name) && (
                        <Text style={styles.studentPickDesc}>
                          Lớp: {item.class_name ?? item.level?.name}
                        </Text>
                      )}
                    </View>
                    <ChevronRight size={18} color="#CBD5E1" />
                  </TouchableOpacity>
                ))
              )}
            </>
          ) : (
            <>
              {isLoadingDetail ? (
                <ActivityIndicator color="#0066cc" />
              ) : (
                <TouchableOpacity
                  style={styles.studentCard}
                  onPress={() =>
                    router.push(`/student/student-detail?studentId=${student.id}`)
                  }
                >
                  <View
                    style={[
                      styles.initialsAvatarLg,
                      { backgroundColor: colorFor(student.id) },
                    ]}
                  >
                    <Text style={styles.initialsTextLg}>{initialsOf(student.name)}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    {!!student.className && (
                      <Text style={styles.studentMeta}>Lớp: {student.className}</Text>
                    )}
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.changeStudentBtn} onPress={handleChangeStudent}>
                <Text style={styles.changeStudentBtnText}>Đổi học sinh khác</Text>
              </TouchableOpacity>

              <View style={[styles.formRow, { marginTop: 12 }]}>
                <Text style={styles.formLabel}>Lớp học</Text>
                <Text style={styles.formValueText}>{student.className || 'Chưa rõ'}</Text>
              </View>

              <TouchableOpacity
                style={[styles.formRow, styles.formRowLast]}
                onPress={() => setParentModalVisible(true)}
              >
                <Text style={styles.formLabel}>Phụ huynh</Text>
                <View style={styles.formValueBtn}>
                  <Text
                    style={[
                      styles.formValueText,
                      parentDisplay === 'Chọn phụ huynh' && styles.formValuePlaceholder,
                    ]}
                    numberOfLines={1}
                  >
                    {parentDisplay}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <DollarSign size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Thông tin phiếu thu</Text>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Ngày thu <Text style={styles.formRequired}>*</Text>
            </Text>
            <View style={styles.dateTimeWrapper}>
              <DateTime value={receiptDate} onChange={(v) => setReceiptDate(v ?? receiptDate)} />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Khoản thu <Text style={styles.formRequired}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.formValueBtn}
              onPress={() => setFeeModalVisible(true)}
            >
              <Text style={styles.formValueText} numberOfLines={1}>
                {feeType?.label}
              </Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Số tiền <Text style={styles.formRequired}>*</Text>
            </Text>
            <RNTextInput
              style={styles.formAmountInput}
              keyboardType="number-pad"
              placeholder="Nhập số tiền"
              placeholderTextColor="#a7a7a7"
              value={amount ? formatCurrency(amountNumber) : ''}
              onChangeText={(text) => setAmount(text.replace(/\D/g, ''))}
            />
            <Text style={styles.formAmountSuffix}>đ</Text>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Hình thức thanh toán <Text style={styles.formRequired}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.formValueBtn}
              onPress={() => setPaymentModalVisible(true)}
            >
              <Text style={styles.formValueText} numberOfLines={1}>
                {paymentMethod?.label}
              </Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={[styles.formRow, styles.formRowLast, { alignItems: 'flex-start' }]}>
            <Text style={styles.formLabel}>Diễn giải</Text>
            <RNTextInput
              style={styles.formTextArea}
              placeholder="Nhập nội dung (nếu có)"
              placeholderTextColor="#a7a7a7"
              multiline
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, MAX_NOTE_LENGTH))}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <Paperclip size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Đính kèm (nếu có)</Text>
          </View>

          {/* Chưa có API tải file đính kèm */}
          <TouchableOpacity style={styles.attachBtn} onPress={notImplemented}>
            <View style={styles.attachIconWrapper}>
              <Paperclip size={18} color="#0066cc" />
            </View>
            <View style={styles.attachInfo}>
              <Text style={styles.attachTitle}>Thêm hình ảnh hóa đơn, biên lai</Text>
              <Text style={styles.attachDesc}>PNG, JPG, PDF tối đa 5MB</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.securityBanner}>
          <ShieldCheck size={18} color="#0066cc" />
          <Text style={styles.securityText}>
            Thông tin phiếu thu được bảo mật và chỉ sử dụng cho mục đích quản lý học phí.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => handleSave(false)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FileText size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Lưu phiếu thu</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineBtn, !canSubmit && styles.outlineBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => handleSave(true)}
        >
          <Users size={18} color="#0066cc" />
          <Text style={styles.outlineBtnText}>Lưu & Gửi cho phụ huynh</Text>
        </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Lọc theo lớp học</Text>
            <ScrollView>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setClassFilter(null);
                  setClassModalVisible(false);
                }}
              >
                <Text
                  style={[styles.modalOptionText, !classFilter && styles.modalOptionTextActive]}
                >
                  Tất cả lớp
                </Text>
                {!classFilter && <Check size={18} color="#0066cc" />}
              </TouchableOpacity>
              {classOptions.map((cls: any) => {
                const active = classFilter?.id === String(cls.id);
                return (
                  <TouchableOpacity
                    key={cls.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setClassFilter({ id: String(cls.id), name: cls.name });
                      setClassModalVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.modalOptionText, active && styles.modalOptionTextActive]}
                    >
                      {cls.name}
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
        visible={feeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFeeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFeeModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn khoản thu</Text>
            <ScrollView>
              {FEE_TYPES.map((option) => {
                const active = option.id === feeTypeId;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setFeeTypeId(option.id);
                      setFeeModalVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.modalOptionText, active && styles.modalOptionTextActive]}
                    >
                      {option.label}
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
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPaymentModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn hình thức thanh toán</Text>
            <ScrollView>
              {PAYMENT_METHODS.map((option) => {
                const MethodIcon = option.icon;
                const active = option.id === paymentMethodId;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setPaymentMethodId(option.id);
                      setPaymentModalVisible(false);
                    }}
                  >
                    <View style={styles.modalOptionRow}>
                      <MethodIcon size={16} color="#0066cc" />
                      <Text
                        style={[styles.modalOptionText, active && styles.modalOptionTextActive]}
                      >
                        {option.label}
                      </Text>
                    </View>
                    {active && <Check size={18} color="#0066cc" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={parentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setParentModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setParentModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn phụ huynh</Text>
            <ScrollView>
              {(student?.parents.length ?? 0) === 0 ? (
                <Text style={styles.emptyText}>
                  Học sinh chưa có thông tin phụ huynh trên hệ thống
                </Text>
              ) : (
                student?.parents.map((parent, index) => {
                  const active = !isCustomParent && selectedParentName === parent.name;
                  return (
                    <TouchableOpacity
                      key={`${parent.name}-${index}`}
                      style={styles.modalOption}
                      onPress={() => {
                        setSelectedParentName(parent.name);
                        setIsCustomParent(false);
                        setParentModalVisible(false);
                      }}
                    >
                      <View style={styles.modalOptionRow}>
                        <Users size={16} color="#0066cc" />
                        <Text
                          style={[
                            styles.modalOptionText,
                            active && styles.modalOptionTextActive,
                          ]}
                        >
                          {parent.name}
                          {parent.relation ? ` (${parent.relation})` : ''}
                        </Text>
                      </View>
                      {active && <Check size={18} color="#0066cc" />}
                    </TouchableOpacity>
                  );
                })
              )}

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setIsCustomParent(true)}
              >
                <View style={styles.modalOptionRow}>
                  <Users size={16} color="#0066cc" />
                  <Text
                    style={[styles.modalOptionText, isCustomParent && styles.modalOptionTextActive]}
                  >
                    Khác (tự nhập tên)
                  </Text>
                </View>
                {isCustomParent && <Check size={18} color="#0066cc" />}
              </TouchableOpacity>
            </ScrollView>

            {isCustomParent && (
              <>
                <RNTextInput
                  style={styles.modalCustomInput}
                  placeholder="Nhập tên người nộp tiền"
                  placeholderTextColor="#a7a7a7"
                  value={parentCustomName}
                  onChangeText={setParentCustomName}
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 12 }]}
                  onPress={() => setParentModalVisible(false)}
                >
                  <Text style={styles.primaryBtnText}>Xong</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

export default TuitionReceiptCreateScreen;
