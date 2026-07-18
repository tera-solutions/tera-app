import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Gamepad2,
  GraduationCap,
  Hash,
  Home,
  RefreshCw,
  Search,
  Send,
  Share2,
  Timer,
  Users,
} from 'lucide-react-native';

import { useClassRoomList } from '@tera/modules/education/class-room';
import { useStudentList } from '@tera/modules/education/student';
import { getListData } from '@tera/commons/hooks';

import { ClassRoomResponse } from '@screens/ClassroomScreen/types';
import { StudentResponse } from '@screens/StudentScreen/types';

import { MINI_GAME_SUMMARY } from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

type Stage = 'summary' | 'processing' | 'done';

const MiniGameCompleteScreen = () => {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('summary');
  const [progress, setProgress] = useState(0);

  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [assignmentClassId, setAssignmentClassId] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const classQuery = useClassRoomList(
    { params: { per_page: 50 } },
    { enabled: stage === 'done' },
  );
  const { items: classItems } = getListData<ClassRoomResponse>(classQuery.data);

  const studentQuery = useStudentList(
    { params: { search: studentSearch || undefined, per_page: 50 } },
    { enabled: stage === 'done' },
  );
  const { items: studentItems } = getListData<StudentResponse>(studentQuery.data);

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
        message: `Mini game từ vựng "${MINI_GAME_SUMMARY.title}" đã sẵn sàng trên Hana Edu!`,
      });
    } catch {
      // Người dùng hủy chia sẻ hoặc thiết bị không hỗ trợ — không cần xử lý thêm.
    }
  };

  const toggleClass = (id: number) => {
    setSelectedClassIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const goCreateAssignment = () => {
    const cls = classItems.find((c) => c.id === assignmentClassId);
    if (!cls) return;
    router.push({
      pathname: '/edu/assignment-create',
      params: { classId: String(cls.id), className: cls.name },
    });
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
            {/* Quay nhanh về MoreApp, thoát khỏi luồng tạo mini game */}
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
              Cấu hình
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
              Cài đặt
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
              <Gamepad2 size={40} color="#0066cc" />
            </View>
            <Text style={styles.gameTitle}>{MINI_GAME_SUMMARY.title}</Text>

            <View style={styles.metaRow}>
              <Hash size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Chủ đề</Text>
              <Text style={styles.metaValue}>{MINI_GAME_SUMMARY.topic}</Text>
            </View>
            <View style={styles.metaRow}>
              <Gamepad2 size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Loại game</Text>
              <Text style={styles.metaValue}>{MINI_GAME_SUMMARY.gameType}</Text>
            </View>
            <View style={styles.metaRow}>
              <Hash size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Độ khó</Text>
              <Text style={styles.metaValue}>{MINI_GAME_SUMMARY.difficulty}</Text>
            </View>
            <View style={styles.metaRow}>
              <Timer size={15} color="#0066cc" />
              <Text style={styles.metaLabel}>Số câu hỏi</Text>
              <Text style={styles.metaValue}>{MINI_GAME_SUMMARY.questionCount} câu</Text>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Gamepad2 size={18} color="#fff" />
              <Text style={styles.startBtnText}>Bắt đầu xuất bản</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'processing' && (
          <View style={styles.processingWrapper}>
            <View style={styles.processingSpinnerRing}>
              <Text style={styles.processingPercentText}>{progress}%</Text>
            </View>
            <Text style={styles.processingTitle}>Đang xuất bản mini game...</Text>
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
            <Text style={styles.doneTitle}>Mini game đã sẵn sàng!</Text>
            <Text style={styles.doneSubtitle}>
              "{MINI_GAME_SUMMARY.title}" đã được tạo xong, sẵn sàng để tải xuống hoặc chia sẻ.
            </Text>

            <View style={styles.sectionCard}>
              <View style={styles.thumbnailWrapper}>
                <Gamepad2 size={40} color="#0066cc" />
              </View>
              <View style={styles.actionsRow}>
                {/* Chưa có API lưu file mini game thật phía sau */}
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

            <View style={styles.sectionCard}>
              <View style={styles.shareSectionTitleRow}>
                <View style={styles.shareSectionTitleLeft}>
                  <Users size={17} color="#0066cc" />
                  <Text style={styles.shareSectionTitle}>Chia sẻ cho lớp</Text>
                </View>
                <Text style={styles.shareSectionCountText}>
                  Đã chọn: {selectedClassIds.length}
                </Text>
              </View>
              <Text style={styles.shareSectionHint}>
                Chọn một hoặc nhiều lớp để gửi mini game này cho toàn bộ học sinh trong lớp.
              </Text>

              {classQuery.isLoading ? (
                <View style={styles.pickerStateWrapper}>
                  <ActivityIndicator color="#0066cc" />
                  <Text style={styles.pickerStateText}>Đang tải danh sách lớp...</Text>
                </View>
              ) : classItems.length === 0 ? (
                <View style={styles.pickerStateWrapper}>
                  <Text style={styles.pickerStateText}>Bạn chưa có lớp nào</Text>
                </View>
              ) : (
                <ScrollView style={styles.pickerListWrapper} nestedScrollEnabled>
                  {classItems.map((cls) => {
                    const selected = selectedClassIds.includes(cls.id);
                    return (
                      <TouchableOpacity
                        key={cls.id}
                        style={styles.pickerRow}
                        onPress={() => toggleClass(cls.id)}
                      >
                        <View style={[styles.pickerCheckbox, selected && styles.pickerCheckboxSelected]}>
                          {selected && <Check size={13} color="#fff" />}
                        </View>
                        <View style={styles.pickerAvatarWrapper}>
                          <Users size={16} color="#0066cc" />
                        </View>
                        <View style={styles.pickerInfo}>
                          <Text style={styles.pickerName} numberOfLines={1}>
                            {cls.name}
                          </Text>
                          <Text style={styles.pickerMeta} numberOfLines={1}>
                            {cls.course?.name ?? 'Chưa có khóa học'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <TouchableOpacity
                style={[styles.shareSendBtn, selectedClassIds.length === 0 && styles.shareSendBtnDisabled]}
                disabled={selectedClassIds.length === 0}
                onPress={notImplemented}
              >
                <Send size={15} color="#fff" />
                <Text style={styles.shareSendBtnText}>
                  Gửi cho {selectedClassIds.length} lớp đã chọn
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.shareSectionTitleRow}>
                <View style={styles.shareSectionTitleLeft}>
                  <ClipboardList size={17} color="#0066cc" />
                  <Text style={styles.shareSectionTitle}>Chia sẻ dưới dạng bài tập</Text>
                </View>
              </View>
              <Text style={styles.shareSectionHint}>
                Chọn 1 lớp để tạo mini game này thành một bài tập giao cho lớp đó.
              </Text>

              {classQuery.isLoading ? (
                <View style={styles.pickerStateWrapper}>
                  <ActivityIndicator color="#0066cc" />
                  <Text style={styles.pickerStateText}>Đang tải danh sách lớp...</Text>
                </View>
              ) : classItems.length === 0 ? (
                <View style={styles.pickerStateWrapper}>
                  <Text style={styles.pickerStateText}>Bạn chưa có lớp nào</Text>
                </View>
              ) : (
                <ScrollView style={styles.pickerListWrapper} nestedScrollEnabled>
                  {classItems.map((cls) => {
                    const selected = assignmentClassId === cls.id;
                    return (
                      <TouchableOpacity
                        key={cls.id}
                        style={styles.pickerRow}
                        onPress={() => setAssignmentClassId(cls.id)}
                      >
                        <View style={[styles.pickerCheckbox, selected && styles.pickerCheckboxSelected]}>
                          {selected && <Check size={13} color="#fff" />}
                        </View>
                        <View style={styles.pickerAvatarWrapper}>
                          <Users size={16} color="#0066cc" />
                        </View>
                        <View style={styles.pickerInfo}>
                          <Text style={styles.pickerName} numberOfLines={1}>
                            {cls.name}
                          </Text>
                          <Text style={styles.pickerMeta} numberOfLines={1}>
                            {cls.course?.name ?? 'Chưa có khóa học'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {/* Điều hướng sang màn "Tạo bài tập" thật (AssignmentCreateScreen) để lưu bài tập thật qua API có sẵn */}
              <TouchableOpacity
                style={[styles.shareSendBtn, assignmentClassId === null && styles.shareSendBtnDisabled]}
                disabled={assignmentClassId === null}
                onPress={goCreateAssignment}
              >
                <ClipboardList size={15} color="#fff" />
                <Text style={styles.shareSendBtnText}>Tạo bài tập cho lớp này</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.shareSectionTitleRow}>
                <View style={styles.shareSectionTitleLeft}>
                  <GraduationCap size={17} color="#0066cc" />
                  <Text style={styles.shareSectionTitle}>Chia sẻ cho học viên</Text>
                </View>
                <Text style={styles.shareSectionCountText}>
                  Đã chọn: {selectedStudentIds.length}
                </Text>
              </View>
              <Text style={styles.shareSectionHint}>
                Chọn học viên cụ thể để gửi riêng mini game này cho các em.
              </Text>

              <View style={styles.searchInputWrapper}>
                <Search size={15} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  value={studentSearch}
                  onChangeText={setStudentSearch}
                  placeholder="Tìm học viên theo tên..."
                  placeholderTextColor="#a7a7a7"
                />
              </View>

              {studentQuery.isLoading ? (
                <View style={styles.pickerStateWrapper}>
                  <ActivityIndicator color="#0066cc" />
                  <Text style={styles.pickerStateText}>Đang tải danh sách học viên...</Text>
                </View>
              ) : studentItems.length === 0 ? (
                <View style={styles.pickerStateWrapper}>
                  <Text style={styles.pickerStateText}>Không tìm thấy học viên nào</Text>
                </View>
              ) : (
                <ScrollView style={styles.pickerListWrapper} nestedScrollEnabled>
                  {studentItems.map((student) => {
                    const selected = selectedStudentIds.includes(student.id);
                    return (
                      <TouchableOpacity
                        key={student.id}
                        style={styles.pickerRow}
                        onPress={() => toggleStudent(student.id)}
                      >
                        <View style={[styles.pickerCheckbox, selected && styles.pickerCheckboxSelected]}>
                          {selected && <Check size={13} color="#fff" />}
                        </View>
                        <View style={styles.pickerAvatarWrapper}>
                          <GraduationCap size={16} color="#0066cc" />
                        </View>
                        <View style={styles.pickerInfo}>
                          <Text style={styles.pickerName} numberOfLines={1}>
                            {student.name}
                          </Text>
                          <Text style={styles.pickerMeta} numberOfLines={1}>
                            {student.code}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <TouchableOpacity
                style={[
                  styles.shareSendBtn,
                  selectedStudentIds.length === 0 && styles.shareSendBtnDisabled,
                ]}
                disabled={selectedStudentIds.length === 0}
                onPress={notImplemented}
              >
                <Send size={15} color="#fff" />
                <Text style={styles.shareSendBtnText}>
                  Gửi cho {selectedStudentIds.length} học viên đã chọn
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerLinksRow}>
              {/* Chưa có màn "Danh sách mini game của tôi" để lưu game vừa tạo */}
              <TouchableOpacity
                style={styles.footerLinkBtn}
                onPress={() => router.replace('/edu/mini-game-create')}
              >
                <RefreshCw size={14} color="#0066cc" />
                <Text style={styles.footerLinkText}>Tạo game khác</Text>
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

export default MiniGameCompleteScreen;
