import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { LessonService } from '@tera/modules/education';

import { NOTE_AUTOSAVE_DELAY, NOTE_MAX_LENGTH } from '../constants';
import { styles } from '../styles';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface Props {
  lessonId: number;
  initialNote: string;
}

export const QuickNoteCard = ({ lessonId, initialNote }: Props) => {
  const [note, setNote] = useState(initialNote);
  const [state, setState] = useState<SaveState>('idle');
  const savedRef = useRef(initialNote);

  const { mutate: update } = LessonService.useLessonUpdate();

  useEffect(() => {
    setNote(initialNote);
    savedRef.current = initialNote;
    setState('idle');
  }, [initialNote, lessonId]);

  useEffect(() => {
    if (!lessonId || note === savedRef.current) return;

    setState('saving');
    const timer = setTimeout(() => {
      update(
        { id: lessonId, params: { lesson_note: note } },
        {
          onSuccess: () => {
            savedRef.current = note;
            setState('saved');
          },
          onError: () => setState('error'),
        },
      );
    }, NOTE_AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, lessonId]);

  return (
    <View style={styles.sidebarCard}>
      <View style={styles.sectionTitleRow}>
        <Icon source="pencil-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Ghi chú nhanh</Text>
      </View>

      <TextInput
        style={[styles.noteInput, { marginTop: 12 }]}
        value={note}
        onChangeText={setNote}
        maxLength={NOTE_MAX_LENGTH}
        placeholder="Thêm ghi chú cho bài học này..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={4}
      />

      {state === 'saving' && <Text style={[styles.noteStatusText, { color: '#94A3B8' }]}>Đang lưu...</Text>}
      {state === 'saved' && <Text style={[styles.noteStatusText, { color: '#27AE60' }]}>Đã lưu</Text>}
      {state === 'error' && <Text style={[styles.noteStatusText, { color: '#E74C3C' }]}>Lưu thất bại, thử lại sau.</Text>}
    </View>
  );
};
