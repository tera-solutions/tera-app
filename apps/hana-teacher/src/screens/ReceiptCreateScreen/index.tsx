import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
  ClipboardList,
  DollarSign,
  FileText,
  Flag,
  History,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Search,
  Send,
  Trash2,
  User,
  Users,
} from 'lucide-react-native';

import { getListData } from '@tera/commons/hooks';
import { useStudentDetail, useStudentList } from '@tera/modules/education/student';
import { DateTime } from '@components/ui/DateTime';

import {
  FEE_TYPES,
  MAX_NOTE_LENGTH,
  PAYER_OPTIONS,
  PAYMENT_METHODS,
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

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}`;

let lineSeq = 1;
const nextLineId = () => `line-${lineSeq++}`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const ReceiptCreateScreen = observer(() => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const [receiptDate, setReceiptDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [feeTypeId, setFeeTypeId] = useState(FEE_TYPES[0].id);
  const [items, setItems] = useState<
    { id: string; label: string; amount: string }[]
  >([{ id: nextLineId(), label: FEE_TYPES[0].label, amount: '' }]);
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
  const [payerId, setPayerId] = useState(PAYER_OPTIONS[1].id);
  const [payerCustomName, setPayerCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');

  const [feeModalVisible, setFeeModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [payerModalVisible, setPayerModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: studentListRes, isLoading: isLoadingStudents } = useStudentList(
    {
      params: { search: search || undefined, per_page: 20 } as any,
    },
    { enabled: !selectedStudentId },
  );
  const { items: studentOptions } = getListData<any>(studentListRes);

  const { data: studentDetailRes, isLoading: isLoadingDetail } =
    useStudentDetail(
      { id: selectedStudentId ?? '' },
      { enabled: !!selectedStudentId },
    );
  const studentRaw = (studentDetailRes as any)?.data ?? studentDetailRes;

  const student = selectedStudentId
    ? {
        id: selectedStudentId,
        name: studentRaw?.name ?? '',
        code: studentRaw?.code ?? '',
        className: studentRaw?.class_name ?? studentRaw?.level?.name ?? '',
        parentName: studentRaw?.parents?.[0]?.name ?? '',
      }
    : null;

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (parseInt(item.amount.replace(/\D/g, ''), 10) || 0),
        0,
      ),
    [items],
  );

  const feeType = FEE_TYPES.find((f) => f.id === feeTypeId);
  const paymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethodId);
  const payer = PAYER_OPTIONS.find((p) => p.id === payerId);
  const payerDisplay =
    payerId === 'other' ? payerCustomName || 'Chưa nhập tên' : payer?.label ?? '';

  const handleAddItem = () => {
    setItems((prev) => [...prev, { id: nextLineId(), label: '', amount: '' }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  };

  const handleUpdateItem = (id: string, field: 'label' | 'amount', value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'amount' ? value.replace(/\D/g, '') : value }
          : item,
      ),
    );
  };

  const handlePickFeeType = (id: string) => {
    setFeeTypeId(id);
    setFeeModalVisible(false);
    const newLabel = FEE_TYPES.find((f) => f.id === id)?.label ?? '';
    setItems((prev) =>
      prev.length === 1 ? [{ ...prev[0], label: newLabel }] : prev,
    );
  };

  const canSubmit =
    !!student &&
    totalAmount > 0 &&
    (payerId !== 'other' || payerCustomName.trim().length > 0) &&
    !isSubmitting;

  // Chưa có API tạo phiếu thu thật (InvoiceAPI trong services/api chỉ là
  // scaffold CRUD chưa xác nhận field với BE, không có route phieu_thu/tuition
  // riêng, và cũng chưa có API công nợ học sinh) — lưu chỉ mô phỏng ở client,
  // KHÔNG gọi API thật, tránh dựng luồng nghiệp vụ trên endpoint chưa xác nhận.
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
          : 'Đã lưu phiếu thu (mô phỏng)',
        text2: `${student?.name} • ${formatCurrency(totalAmount)}đ`,
      });
      router.back();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo phiếu thu</Text>
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
        {!student ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionTitleIcon}>
                <User size={16} color="#0066cc" />
              </View>
              <Text style={styles.sectionTitle}>Chọn học sinh</Text>
            </View>

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

            {isLoadingStudents ? (
              <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
            ) : studentOptions.length === 0 ? (
              <Text style={styles.emptyText}>Không tìm thấy học sinh</Text>
            ) : (
              studentOptions.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.studentPickRow}
                  onPress={() => setSelectedStudentId(String(item.id))}
                >
                  <Image
                    source={avatarFor(String(item.id))}
                    style={styles.studentPickAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentPickName}>{item.name}</Text>
                    {!!item.class_name && (
                      <Text style={styles.studentPickDesc}>
                        Lớp: {item.class_name}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionTitleIcon}>
                  <User size={16} color="#0066cc" />
                </View>
                <Text style={styles.sectionTitle}>Thông tin học sinh</Text>
              </View>

              {isLoadingDetail ? (
                <ActivityIndicator color="#0066cc" />
              ) : (
                <TouchableOpacity
                  style={styles.studentCard}
                  onPress={() =>
                    router.push(`/student/student-detail?studentId=${student.id}`)
                  }
                >
                  <View style={styles.studentAvatarWrapper}>
                    <Image
                      source={avatarFor(student.id)}
                      style={styles.studentAvatarImage}
                    />
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    {!!student.className && (
                      <Text style={styles.studentMeta}>
                        Lớp: {student.className}
                      </Text>
                    )}
                    {!!student.parentName && (
                      <Text style={styles.studentMeta}>
                        Phụ huynh: {student.parentName}
                      </Text>
                    )}
                  </View>
                  <View style={styles.studentDebtWrapper}>
                    <Text style={styles.studentDebtLabel}>Nợ hiện tại</Text>
                    {/* Chưa có API công nợ học sinh — không bịa số liệu */}
                    <Text style={styles.studentDebtValueEmpty}>
                      Chưa có dữ liệu
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{ marginTop: 12, alignSelf: 'flex-start' }}
                onPress={() => setSelectedStudentId(null)}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0066cc' }}>
                  Đổi học sinh khác
                </Text>
              </TouchableOpacity>
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
                  <DateTime
                    value={receiptDate}
                    onChange={(v) => setReceiptDate(v ?? receiptDate)}
                  />
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
                <Text style={styles.formValueText}>
                  {formatCurrency(totalAmount)}đ
                </Text>
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

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>
                  Người nộp tiền <Text style={styles.formRequired}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.formValueBtn}
                  onPress={() => setPayerModalVisible(true)}
                >
                  <Text style={styles.formValueText} numberOfLines={1}>
                    {payerDisplay}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={[styles.formRow, styles.formRowLast]}>
                <Text style={styles.formLabel}>Diễn giải</Text>
                <RNTextInput
                  style={styles.formTextInput}
                  placeholder="Nhập diễn giải"
                  placeholderTextColor="#a7a7a7"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionTitleIcon}>
                  <ClipboardList size={16} color="#0066cc" />
                </View>
                <Text style={styles.sectionTitle}>Chi tiết khoản thu</Text>
              </View>

              <View style={styles.tableHeaderRow}>
                <Text style={styles.tableHeaderLabel}>Nội dung</Text>
                <Text style={styles.tableHeaderAmount}>Số tiền (đ)</Text>
              </View>

              {items.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <RNTextInput
                    style={styles.tableItemInput}
                    placeholder="Nội dung khoản thu"
                    placeholderTextColor="#a7a7a7"
                    value={item.label}
                    onChangeText={(text) => handleUpdateItem(item.id, 'label', text)}
                  />
                  <RNTextInput
                    style={styles.tableAmountInput}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#a7a7a7"
                    value={item.amount}
                    onChangeText={(text) => handleUpdateItem(item.id, 'amount', text)}
                  />
                  {items.length > 1 && (
                    <TouchableOpacity
                      style={styles.tableRemoveBtn}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={16} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.addLineBtn} onPress={handleAddItem}>
                <Plus size={14} color="#0066cc" />
                <Text style={styles.addLineBtnText}>Thêm dòng</Text>
              </TouchableOpacity>

              <View style={styles.tableTotalRow}>
                <Text style={styles.tableTotalLabel}>Tổng cộng</Text>
                <Text style={styles.tableTotalValue}>
                  {formatCurrency(totalAmount)}đ
                </Text>
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
                  <ImageIcon size={18} color="#0066cc" />
                </View>
                <View style={styles.attachInfo}>
                  <Text style={styles.attachTitle}>Thêm hình ảnh, biên lai</Text>
                  <Text style={styles.attachDesc}>PNG, JPG, PDF tối đa 5MB</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionTitleIcon}>
                  <Flag size={16} color="#0066cc" />
                </View>
                <Text style={styles.sectionTitle}>Ghi chú</Text>
              </View>

              <RNTextInput
                style={styles.noteInput}
                placeholder="Nhập ghi chú thêm (nếu có)"
                placeholderTextColor="#a7a7a7"
                multiline
                value={note}
                onChangeText={(text) => setNote(text.slice(0, MAX_NOTE_LENGTH))}
              />
              <Text style={styles.noteCounter}>
                {note.length}/{MAX_NOTE_LENGTH}
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
              <Send size={18} color="#0066cc" />
              <Text style={styles.outlineBtnText}>Lưu & Gửi cho phụ huynh</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

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
                    onPress={() => handlePickFeeType(option.id)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        active && styles.modalOptionTextActive,
                      ]}
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
                        style={[
                          styles.modalOptionText,
                          active && styles.modalOptionTextActive,
                        ]}
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
        visible={payerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPayerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPayerModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn người nộp tiền</Text>
            <ScrollView>
              {PAYER_OPTIONS.map((option) => {
                const active = option.id === payerId;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setPayerId(option.id);
                      if (option.id !== 'other') setPayerModalVisible(false);
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
                        {option.label}
                      </Text>
                    </View>
                    {active && <Check size={18} color="#0066cc" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {payerId === 'other' && (
              <>
                <RNTextInput
                  style={styles.modalCustomInput}
                  placeholder="Nhập tên người nộp tiền"
                  placeholderTextColor="#a7a7a7"
                  value={payerCustomName}
                  onChangeText={setPayerCustomName}
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 12 }]}
                  onPress={() => setPayerModalVisible(false)}
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

export default ReceiptCreateScreen;
