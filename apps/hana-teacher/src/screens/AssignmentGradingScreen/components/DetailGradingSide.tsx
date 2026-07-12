import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { QUICK_COMMENTS } from '../constants';
import { formatDateTime } from '../_utils';
import type { GradeFormValues, SubmissionDetailData, SubmissionRow } from '../types';

interface DetailGradingSideProps {
  hasSelection: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  student: SubmissionRow | null;
  submission: SubmissionDetailData | undefined;
  maxScore: number;
  control: Control<GradeFormValues>;
  errors: FieldErrors<GradeFormValues>;
  commentValue: string;
  onQuickComment: (text: string) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const DetailGradingSide = ({
  hasSelection,
  isLoading,
  isError,
  onRetry,
  student,
  submission,
  maxScore,
  control,
  errors,
  commentValue,
  onQuickComment,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: DetailGradingSideProps) => {
  if (!hasSelection) {
    return (
      <View style={[styles.rightColumn, styles.emptyStateWrap]}>
        <Icon source="account-search-outline" size={32} color="#CBD5E1" />
        <Text style={styles.emptyStateText}>Chọn một học viên để chấm bài</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.rightColumn, styles.emptyStateWrap]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.rightColumn, styles.emptyStateWrap]}>
        <Icon source="alert-circle-outline" size={32} color="#E74C3C" />
        <Text style={styles.emptyStateText}>Không thể tải bài nộp</Text>
        <TouchableOpacity onPress={onRetry}>
          <Text style={{ color: '#007AFF', fontSize: 13, fontWeight: '600' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!submission || submission.status === 'assigned') {
    return (
      <View style={[styles.rightColumn, styles.emptyStateWrap]}>
        <Icon source="file-remove-outline" size={32} color="#CBD5E1" />
        <Text style={styles.emptyStateText}>Học viên chưa nộp bài</Text>
      </View>
    );
  }

  const imageFiles = submission.files.filter((f) => f.type === 'image');
  const otherFiles = submission.files.filter((f) => f.type !== 'image');

  return (
    <ScrollView style={styles.rightColumn} showsVerticalScrollIndicator={false}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailHeaderTitle} numberOfLines={1}>
          Bài làm của {student?.studentName ?? ''}
        </Text>
        <View style={styles.paginationRow}>
          <TouchableOpacity
            style={[styles.pageIconButton, !hasPrev && { opacity: 0.4 }]}
            onPress={onPrev}
            disabled={!hasPrev}
          >
            <Icon source="chevron-left" size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pageIconButton, !hasNext && { opacity: 0.4 }]}
            onPress={onNext}
            disabled={!hasNext}
          >
            <Icon source="chevron-right" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {!!submission.submittedAt && (
        <Text style={styles.submissionMetaText}>Nộp lúc {formatDateTime(submission.submittedAt)}</Text>
      )}

      {!!submission.answer && (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{submission.answer}</Text>
        </View>
      )}

      {imageFiles.map((file, i) => (
        <Image
          key={`img-${i}`}
          source={{ uri: file.url }}
          style={{ width: '100%', height: 220, borderRadius: 10, marginBottom: 10, backgroundColor: '#F1F5F9' }}
          resizeMode="contain"
        />
      ))}

      {otherFiles.map((file, i) => (
        <View key={`file-${i}`} style={styles.fileAttachmentCard}>
          <Icon source="file-document-outline" size={28} color="#007AFF" />
          <View style={styles.fileMeta}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name ?? 'Tệp đính kèm'}
            </Text>
            <Text style={styles.fileSize}>{file.type.toUpperCase()}</Text>
          </View>
        </View>
      ))}

      {!submission.answer && submission.files.length === 0 && (
        <View style={styles.emptyStateWrap}>
          <Text style={styles.emptyStateText}>Học viên chưa nộp nội dung</Text>
        </View>
      )}

      {/* Điểm số */}
      <Text style={styles.formLabel}>
        Điểm số <Text style={styles.requiredStar}>*</Text>
      </Text>
      <Controller
        control={control}
        name="score"
        rules={{
          required: 'Vui lòng nhập điểm',
          min: { value: 0, message: `Điểm phải từ 0 đến ${maxScore}` },
          max: { value: maxScore, message: `Điểm phải từ 0 đến ${maxScore}` },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              keyboardType="decimal-pad"
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChange(text ? Number(text.replace(',', '.')) : 0)}
              style={styles.scoreInputField}
            />
            <Text style={{ fontSize: 14, color: '#64748B' }}>/ {maxScore}</Text>
          </View>
        )}
      />
      {!!errors.score && <Text style={styles.errorText}>{errors.score.message}</Text>}

      {/* Nhận xét */}
      <Text style={styles.formLabel}>Nhận xét của giáo viên</Text>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Nhận xét của giáo viên..."
            multiline
            numberOfLines={4}
            maxLength={300}
            style={styles.commentInputField}
          />
        )}
      />
      <Text style={styles.commentLengthText}>{commentValue.length}/300</Text>

      {/* Nhận xét nhanh */}
      <Text style={styles.formLabel}>Nhận xét nhanh</Text>
      <View style={styles.quickCommentsContainer}>
        {QUICK_COMMENTS.map((tag, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.quickCommentTag, { backgroundColor: tag.bg, borderColor: tag.border }]}
            onPress={() => onQuickComment(tag.text)}
          >
            <Icon source={tag.icon} size={14} color={tag.color} />
            <Text style={[styles.quickCommentText, { color: tag.color, marginLeft: 4 }]}>{tag.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
