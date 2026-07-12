import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';

import { LessonRow } from '../types';
import { styles } from '../styles';

interface Props {
  lesson: LessonRow | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelLessonModal({ lesson, loading, onCancel, onConfirm }: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (lesson) setReason('');
  }, [lesson]);

  return (
    <Portal>
      <Modal visible={!!lesson} onDismiss={onCancel} contentContainerStyle={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Hủy buổi học</Text>
          <Text style={styles.modalHint}>
            Nhập lý do hủy buổi học <Text style={{ fontWeight: '700' }}>{lesson?.lessonTitle}</Text>:
          </Text>
          <TextInput
            style={styles.modalTextarea}
            value={reason}
            onChangeText={setReason}
            placeholder="Lý do hủy..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <View style={styles.modalActions}>
            <Button mode="outlined" style={styles.modalBtn} onPress={onCancel} disabled={loading}>
              Đóng
            </Button>
            <Button
              mode="contained"
              style={[styles.modalBtn, styles.modalBtnDanger]}
              onPress={() => onConfirm(reason.trim())}
              loading={loading}
              disabled={loading || !reason.trim()}
            >
              Xác nhận hủy
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
