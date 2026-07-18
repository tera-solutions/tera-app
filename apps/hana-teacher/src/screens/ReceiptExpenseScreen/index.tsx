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
  FileText,
  Flag,
  History,
  Image as ImageIcon,
  LayoutGrid,
  Paperclip,
  Send,
  ShieldCheck,
} from 'lucide-react-native';

import { DateTime } from '@components/ui/DateTime';

import {
  EXPENSE_CATEGORIES,
  EXPENSE_REASON_SUGGESTIONS,
  MAX_NOTE_LENGTH,
  PAYMENT_METHODS,
} from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}`;

// Chưa có API cấp số phiếu chi tự động — sinh số cục bộ dạng PCyymmdd-001,
// chỉ mang tính minh họa, cần thay bằng số thật do BE cấp khi có API.
const genVoucherNo = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `PC${yy}${mm}${dd}-001`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const ReceiptExpenseScreen = observer(() => {
  const router = useRouter();

  const voucherNo = useMemo(() => genVoucherNo(), []);

  const [expenseDate, setExpenseDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [recipient, setRecipient] = useState('');
  const [recipientDraft, setRecipientDraft] = useState('');
  const [reason, setReason] = useState('');
  const [reasonDraft, setReasonDraft] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [note, setNote] = useState('');

  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNumber = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const paymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethodId);
  const category = EXPENSE_CATEGORIES.find((c) => c.id === categoryId);

  const canSubmit =
    recipient.trim().length > 0 &&
    reason.trim().length > 0 &&
    amountNumber > 0 &&
    !isSubmitting;

  const openRecipientModal = () => {
    setRecipientDraft(recipient);
    setRecipientModalVisible(true);
  };

  const openReasonModal = () => {
    setReasonDraft(reason);
    setReasonModalVisible(true);
  };

  // Chưa có API tạo phiếu chi thật (tương tự ReceiptCreateScreen — chưa có
  // route "phieu_chi"/expense-voucher nào được xác nhận với BE) — lưu chỉ mô
  // phỏng ở client, KHÔNG gọi API thật.
  const handleSave = (sendForApproval: boolean) => {
    if (!canSubmit) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: sendForApproval
          ? 'Đã lưu & gửi duyệt phiếu chi (mô phỏng)'
          : 'Đã lưu phiếu chi (mô phỏng)',
        text2: `${recipient} • ${formatCurrency(amountNumber)}đ`,
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
          <Text style={styles.headerTitle}>Tạo phiếu chi</Text>
          {/* Chưa có API lịch sử phiếu chi */}
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
            <View style={styles.sectionTitleIcon}>
              <FileText size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Thông tin phiếu chi</Text>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Ngày chi <Text style={styles.formRequired}>*</Text>
            </Text>
            <View style={styles.dateTimeWrapper}>
              <DateTime
                value={expenseDate}
                onChange={(v) => setExpenseDate(v ?? expenseDate)}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Số phiếu chi</Text>
            {/* Số cục bộ, chưa có API cấp số phiếu thật */}
            <TouchableOpacity
              style={styles.formValueBtn}
              onPress={() =>
                Toast.show({ type: 'info', text1: 'Số phiếu được tạo tự động' })
              }
            >
              <Text style={styles.formValueText}>{voucherNo}</Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Người nhận / Đơn vị nhận <Text style={styles.formRequired}>*</Text>
            </Text>
            <TouchableOpacity style={styles.formValueBtn} onPress={openRecipientModal}>
              <Text
                style={[
                  styles.formValueText,
                  !recipient && styles.formValuePlaceholder,
                ]}
                numberOfLines={1}
              >
                {recipient || 'Chọn người nhận hoặc đơn vị'}
              </Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Lý do chi <Text style={styles.formRequired}>*</Text>
            </Text>
            <TouchableOpacity style={styles.formValueBtn} onPress={openReasonModal}>
              <Text
                style={[
                  styles.formValueText,
                  !reason && styles.formValuePlaceholder,
                ]}
                numberOfLines={1}
              >
                {reason || 'Chọn hoặc nhập lý do chi'}
              </Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>
              Số tiền chi <Text style={styles.formRequired}>*</Text>
            </Text>
            <RNTextInput
              style={styles.formTextInput}
              keyboardType="number-pad"
              placeholder="Nhập số tiền"
              placeholderTextColor="#a7a7a7"
              value={amount}
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

          <View style={[styles.formRow, styles.formRowLast]}>
            <Text style={styles.formLabel}>Diễn giải</Text>
            <RNTextInput
              style={styles.formTextInput}
              placeholder="Nhập nội dung chi tiết (nếu có)"
              placeholderTextColor="#a7a7a7"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <LayoutGrid size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Danh mục chi</Text>
          </View>

          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((cat) => {
              const CategoryIcon = cat.icon;
              const active = cat.id === categoryId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                    <CategoryIcon size={20} color="#fff" />
                  </View>
                  <Text style={styles.categoryLabel} numberOfLines={2}>
                    {cat.label}
                  </Text>
                  {active && (
                    <View style={styles.categoryCheckBadge}>
                      <Check size={11} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <Paperclip size={16} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>Đính kèm chứng từ (nếu có)</Text>
          </View>

          {/* Chưa có API tải file đính kèm */}
          <TouchableOpacity style={styles.attachBtn} onPress={notImplemented}>
            <View style={styles.attachIconWrapper}>
              <ImageIcon size={18} color="#0066cc" />
            </View>
            <View style={styles.attachInfo}>
              <Text style={styles.attachTitle}>Thêm hình ảnh hóa đơn, chứng từ</Text>
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

        <View style={styles.securityBanner}>
          <ShieldCheck size={16} color="#0066cc" />
          <Text style={styles.securityBannerText}>
            Vui lòng kiểm tra kỹ thông tin trước khi lưu phiếu chi.
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
              <Text style={styles.primaryBtnText}>Lưu phiếu chi</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineBtn, !canSubmit && styles.outlineBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => handleSave(true)}
        >
          <Send size={18} color="#0066cc" />
          <Text style={styles.outlineBtnText}>Lưu & Gửi duyệt</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={recipientModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRecipientModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRecipientModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Người nhận / Đơn vị nhận</Text>
            {/* Chưa có danh bạ nhân sự/đối tác thật để gợi ý — cho nhập tự do */}
            <RNTextInput
              style={styles.modalCustomInput}
              placeholder="Nhập tên người nhận hoặc đơn vị"
              placeholderTextColor="#a7a7a7"
              value={recipientDraft}
              onChangeText={setRecipientDraft}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 16 }]}
              onPress={() => {
                setRecipient(recipientDraft.trim());
                setRecipientModalVisible(false);
              }}
            >
              <Text style={styles.primaryBtnText}>Xong</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={reasonModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReasonModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setReasonModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Lý do chi</Text>
            <ScrollView>
              {EXPENSE_REASON_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.modalOption}
                  onPress={() => {
                    setReason(suggestion);
                    setReasonModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      reason === suggestion && styles.modalOptionTextActive,
                    ]}
                  >
                    {suggestion}
                  </Text>
                  {reason === suggestion && <Check size={18} color="#0066cc" />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalCustomLabel}>Hoặc tự nhập lý do khác</Text>
            <RNTextInput
              style={styles.modalCustomInput}
              placeholder="Nhập lý do chi"
              placeholderTextColor="#a7a7a7"
              value={reasonDraft}
              onChangeText={setReasonDraft}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 16 }]}
              onPress={() => {
                setReason(reasonDraft.trim());
                setReasonModalVisible(false);
              }}
            >
              <Text style={styles.primaryBtnText}>Xong</Text>
            </TouchableOpacity>
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
    </View>
  );
});

export default ReceiptExpenseScreen;
