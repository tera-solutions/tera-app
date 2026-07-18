import { useEffect, useState } from 'react';
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Download,
  Hash,
  Home,
  RefreshCw,
  Share2,
  Sparkles,
  Timer,
} from 'lucide-react-native';

import { VIDEO_SUMMARY } from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

type Stage = 'summary' | 'processing' | 'done';

const VocabularyVideoCompleteScreen = () => {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('summary');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'processing') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.round(Math.random() * 12) + 6, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('done'), 400);
        }
        return next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = () => {
    setProgress(0);
    setStage('processing');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Video từ vựng "${VIDEO_SUMMARY.title}" đã sẵn sàng trên Hana Edu!`,
      });
    } catch {
      // Người dùng hủy chia sẻ hoặc thiết bị không hỗ trợ — không cần xử lý thêm.
    }
  };

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
              style={[styles.headerIconBtn, stage === 'processing' && styles.headerIconBtnHidden]}
              onPress={() => router.back()}
              disabled={stage === 'processing'}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hoàn thành</Text>
            {/* Quay nhanh về MoreApp, thoát khỏi luồng tạo video */}
            <TouchableOpacity
              style={[styles.headerIconBtn, stage === 'processing' && styles.headerIconBtnHidden]}
              onPress={() => router.push('/setting/more-app')}
              disabled={stage === 'processing'}
            >
              <Home size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stepperCard}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Check size={12} color="#fff" />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelDone]} numberOfLines={2}>
              Nội dung
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Check size={12} color="#fff" />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelDone]} numberOfLines={2}>
              Thiết kế
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Check size={12} color="#fff" />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelDone]} numberOfLines={2}>
              Nhạc & giọng đọc
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>4</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
              Hoàn thành
            </Text>
          </View>
        </View>

        {stage === 'summary' && (
          <View style={styles.sectionCard}>
            <View style={styles.thumbnailWrapper}>
              <Clapperboard size={40} color="#0066cc" />
            </View>
            <Text style={styles.videoTitle}>{VIDEO_SUMMARY.title}</Text>

            <View style={styles.metaRow}>
              <Sparkles size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Chủ đề</Text>
              <Text style={styles.metaValue}>{VIDEO_SUMMARY.topic}</Text>
            </View>
            <View style={styles.metaRow}>
              <Hash size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Số từ vựng</Text>
              <Text style={styles.metaValue}>{VIDEO_SUMMARY.wordCount} từ</Text>
            </View>
            <View style={styles.metaRow}>
              <Timer size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Thời lượng dự kiến</Text>
              <Text style={styles.metaValue}>{VIDEO_SUMMARY.durationLabel}</Text>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Clapperboard size={18} color="#fff" />
              <Text style={styles.startBtnText}>Bắt đầu tạo video</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'processing' && (
          <View style={styles.processingWrapper}>
            <View style={styles.processingSpinnerRing}>
              <Text style={styles.processingPercentText}>{progress}%</Text>
            </View>
            <Text style={styles.processingTitle}>Đang xử lý video...</Text>
            <View style={styles.processingTrack}>
              <View style={[styles.processingFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.processingHint}>
              Vui lòng không thoát khỏi màn hình trong khi xử lý
            </Text>
          </View>
        )}

        {stage === 'done' && (
          <>
            <View style={styles.doneIconWrapper}>
              <CheckCircle2 size={40} color="#16A34A" />
            </View>
            <Text style={styles.doneTitle}>Video đã sẵn sàng!</Text>
            <Text style={styles.doneSubtitle}>
              "{VIDEO_SUMMARY.title}" đã được tạo xong, sẵn sàng để tải xuống hoặc chia sẻ.
            </Text>

            <View style={styles.sectionCard}>
              <View style={styles.thumbnailWrapper}>
                <Clapperboard size={40} color="#0066cc" />
              </View>
              <View style={styles.actionsRow}>
                {/* Chưa có API render/lưu file video thật phía sau */}
                <TouchableOpacity style={styles.primaryActionBtn} onPress={notImplemented}>
                  <Download size={16} color="#fff" />
                  <Text style={styles.primaryActionBtnText}>Tải xuống</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineActionBtn} onPress={handleShare}>
                  <Share2 size={16} color="#0066cc" />
                  <Text style={styles.outlineActionBtnText}>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerLinksRow}>
              {/* Chưa có màn "Danh sách video của tôi" để lưu video vừa tạo */}
              <TouchableOpacity
                style={styles.footerLinkBtn}
                onPress={() => router.replace('/edu/vocabulary-video-create')}
              >
                <RefreshCw size={14} color="#0066cc" />
                <Text style={styles.footerLinkText}>Tạo video khác</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLinkBtn} onPress={() => router.push('/')}>
                <Home size={14} color="#0066cc" />
                <Text style={styles.footerLinkText}>Về trang chủ</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default VocabularyVideoCompleteScreen;
