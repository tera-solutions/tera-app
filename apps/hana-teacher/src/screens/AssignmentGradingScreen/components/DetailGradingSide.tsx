import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { StudentGradingData } from './StudentCardItem';

interface DetailGradingSideProps {
  currentStudent: StudentGradingData;
}

const QUICK_COMMENTS = [
  {
    text: 'Tốt lắm!',
    icon: 'thumb-up',
    color: '#27AE60',
    bg: '#E2FBEB',
    border: '#D0F5DD',
  },
  {
    text: 'Cố gắng hơn nhé!',
    icon: 'star-outline',
    color: '#007AFF',
    bg: '#EBF5FF',
    border: '#D0E7FF',
  },
  {
    text: 'Bài làm ổn!',
    icon: 'emoticon-happy-outline',
    color: '#E67E22',
    bg: '#FFF4EB',
    border: '#FFE3CE',
  },
  {
    text: 'Xuất sắc!',
    icon: 'heart',
    color: '#9B5DE5',
    bg: '#F5EFFF',
    border: '#EAD9FF',
  },
];

export const DetailGradingSide = ({
  currentStudent,
}: DetailGradingSideProps) => (
  <ScrollView style={styles.rightColumn} showsVerticalScrollIndicator={false}>
    <View style={styles.detailHeader}>
      <Text style={styles.detailHeaderTitle}>
        Bài làm của {currentStudent.name}
      </Text>
      <View style={styles.paginationRow}>
        <TouchableOpacity style={styles.pageIconButton}>
          <Icon source="chevron-left" size={18} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pageIconButton}>
          <Icon source="chevron-right" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>

    {/* File Đính Kèm */}
    <View style={styles.fileAttachmentCard}>
      <Icon source="file-pdf-box" size={32} color="#E74C3C" />
      <View style={styles.fileMeta}>
        <Text style={styles.fileName} numberOfLines={1}>
          Bai_2_NguyenMinhAnh.pdf
        </Text>
        <Text style={styles.fileSize}>PDF • 1.2 MB</Text>
      </View>
      <TouchableOpacity>
        <Icon source="download" size={20} color="#007AFF" />
      </TouchableOpacity>
    </View>

    {/* Canvas / Image Preview bài tập gốc */}
    <View>
      <Image
        source={{ uri: 'https://placeholder.co/400x500.png' }}
        style={styles.previewPaperImage}
      />
      {/* Cụm công cụ zoom */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomButton}>
          <Icon source="magnify-plus-outline" size={18} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton}>
          <Icon source="magnify-minus-outline" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Form Điểm số */}
    <Text style={styles.formLabel}>
      Điểm số <Text style={styles.requiredStar}>*</Text>
    </Text>
    <View style={styles.scoreInputWrapper}>
      <Text style={styles.scoreInputFakeText}>
        {currentStudent.score || 'Chưa chấm'}
      </Text>
      <Text style={styles.scoreMaxLabel}>/10</Text>
    </View>

    {/* Nhận xét của giáo viên */}
    <Text style={styles.formLabel}>Nhận xét của giáo viên</Text>
    <View style={styles.commentBox}>
      <Text style={styles.commentFakeInput}>
        Bài làm tốt, nghe hiểu đúng hầu hết các câu. Cần chú ý hơn ở câu số 4.
        Cố gắng phát huy nhé!
      </Text>
    </View>
    <Text style={styles.commentLengthText}>85/300</Text>

    {/* Nhận xét nhanh */}
    <Text style={styles.formLabel}>Nhận xét nhanh</Text>
    <View style={styles.quickCommentsContainer}>
      {QUICK_COMMENTS.map((tag, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.quickCommentTag,
            { backgroundColor: tag.bg, borderColor: tag.border },
          ]}
        >
          <Icon source={tag.icon} size={14} color={tag.color} />
          <Text
            style={[
              styles.quickCommentText,
              { color: tag.color, marginLeft: 4 },
            ]}
          >
            {tag.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);
