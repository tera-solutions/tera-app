import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';
// Giả định sử dụng Picker hoặc Dropdown cho Reminder
const REMINDER_OPTIONS = [
  { label: 'Không nhắc nhở trước hẹn', value: 0 },
  { label: 'Nhắc trước 30 phút', value: 30 },
  { label: 'Nhắc trước 1 tiếng', value: 60 },
];

interface SelectDeliveryTimeDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (date: Date, reminderMinutes: number) => void;
}

const { height, width } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.6;

const SelectDeliveryTimeDialog: React.FC<SelectDeliveryTimeDialogProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  // Giả định chọn ngày giờ hiện tại
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('__:__');
  const [reminder, setReminder] = useState(REMINDER_OPTIONS[0]);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [displayContent, setDisplayContent] = useState(isVisible);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const slideUpValue = height - MODAL_HEIGHT;

  useEffect(() => {
    if (isVisible) {
      setDisplayContent(true);
      slideAnim.setValue(height);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!displayContent) return;
    if (isVisible) {
      // Khi Modal hiển thị: Trượt xuống từ trên cùng (y: 0)
      Animated.timing(slideAnim, {
        toValue: slideUpValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Khi Modal đóng: Trượt lên lại vị trí ban đầu (-MODAL_HEIGHT)
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDisplayContent(false);
      });
    }
  }, [displayContent, isVisible, slideAnim, slideUpValue]);

  // Giả lập hàm mở DatePicker và TimePicker (thường dùng các thư viện bên thứ 3)
  const handleOpenDatePicker = () => {
    // Logic mở Native/Custom Date Picker
    console.tron('Mở Date Picker');
    // Sau khi chọn, cập nhật setSelectedDate
  };

  const handleOpenTimePicker = () => {
    // Logic mở Native/Custom Time Picker
    console.tron('Mở Time Picker');
    // Sau khi chọn, cập nhật setSelectedTime
    setSelectedTime('14:30'); // Ví dụ
  };

  const handleConfirm = () => {
    // Logic xác nhận (cần chuyển selectedTime về dạng Date)
    onConfirm(selectedDate, reminder.value);
    onClose();
  };

  const renderReminderPicker = () => (
    <View style={styles.reminderPicker}>
      {REMINDER_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.pickerOption}
          onPress={() => {
            setReminder(option);
            setShowReminderPicker(false);
          }}
        >
          <Text style={styles.pickerOptionText}>{option.label}</Text>
          {reminder.value === option.value && (
            <Icon source="check-circle" size={20} color="#10B981" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  if (!displayContent) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={displayContent}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: slideAnim }],
            height: MODAL_HEIGHT,
          },
        ]}
      >
        <View style={styles.modalView}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titleText}>Chọn ngày giờ hẹn giao</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close-circle-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          {/* CHỌN NGÀY */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={handleOpenDatePicker}
          >
            <Text style={styles.inputLabel}>Ngày giao</Text>
            <View style={styles.inputValueWrapper}>
              <Text style={styles.inputValue}>
                {selectedDate.toLocaleDateString('vi-VN')}
              </Text>
              <Icon source="calendar-month-outline" size={24} color="#6B7280" />
            </View>
          </TouchableOpacity>
          {/* CHỌN GIỜ */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={handleOpenTimePicker}
          >
            <Text style={styles.inputLabel}>Giờ hẹn giao</Text>
            <View style={styles.inputValueWrapper}>
              <Text
                style={[
                  styles.inputValue,
                  selectedTime === '__:__' && styles.placeholderValue,
                ]}
              >
                {selectedTime}
              </Text>
              <Icon
                source="clock-time-three-outline"
                size={24}
                color="#6B7280"
              />
            </View>
          </TouchableOpacity>
          {/* NHẮC NHỞ */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowReminderPicker(!showReminderPicker)}
          >
            <Text style={styles.inputLabel}>Nhắc nhở trước hẹn</Text>
            <View style={styles.inputValueWrapper}>
              <Text style={styles.inputValue}>{reminder.label}</Text>
              <Icon source="menu-down" size={24} color="#6B7280" />
            </View>
          </TouchableOpacity>
          {showReminderPicker && renderReminderPicker()}
          {/* FOOTER BUTTONS */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleConfirm}>
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SelectDeliveryTimeDialog;
