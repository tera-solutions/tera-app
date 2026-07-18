import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GalleryHorizontalEnd,
  GripVertical,
  Image as ImageIcon,
  Lightbulb,
  ListOrdered,
  Plus,
  Repeat,
  Settings2,
  SlidersHorizontal,
  Smile,
  Trash2,
  Type,
  Video as VideoIcon,
  Volume2,
  X,
} from 'lucide-react-native';

import { LEVEL_LABELS, TOPICS, topicById, VocabLevel } from '@screens/VocabularyScreen/constants';

import {
  AGE_RANGE_OPTIONS,
  DISPLAY_ORDER_OPTIONS,
  DURATION_OPTIONS,
  MAX_VOCAB_IN_VIDEO,
  REPEAT_OPTIONS,
  TRANSITION_OPTIONS,
  VIDEO_VOCAB_SEED,
  VideoVocabItem,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 200;

const LEVEL_OPTIONS = Object.keys(LEVEL_LABELS) as VocabLevel[];

interface PickerConfig {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const VocabularyVideoCreateScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState('Animals – Động vật');
  const [description, setDescription] = useState(
    'Video giúp học sinh ghi nhớ từ vựng về các con vật thông qua hình ảnh, phát âm và câu ví dụ sinh động.',
  );
  const [ageRange, setAgeRange] = useState('4 - 6 tuổi');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(['animal']);
  const [level, setLevel] = useState<VocabLevel>('A1');
  const [items, setItems] = useState<VideoVocabItem[]>(VIDEO_VOCAB_SEED);
  const [transition, setTransition] = useState(TRANSITION_OPTIONS[0]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [showText, setShowText] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(DISPLAY_ORDER_OPTIONS[0]);
  const [repeatOption, setRepeatOption] = useState(REPEAT_OPTIONS[0]);
  const [picker, setPicker] = useState<PickerConfig | null>(null);
  const [topicPickerVisible, setTopicPickerVisible] = useState(false);

  const toggleTopic = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const openAgeRangePicker = () =>
    setPicker({ title: 'Độ tuổi phù hợp', options: AGE_RANGE_OPTIONS, onSelect: setAgeRange });

  const openLevelPicker = () =>
    setPicker({
      title: 'Cấp độ',
      options: LEVEL_OPTIONS.map((l) => LEVEL_LABELS[l]),
      onSelect: (label) => {
        const found = LEVEL_OPTIONS.find((l) => LEVEL_LABELS[l] === label);
        if (found) setLevel(found);
      },
    });

  const openTransitionPicker = () =>
    setPicker({ title: 'Hiệu ứng chuyển cảnh', options: TRANSITION_OPTIONS, onSelect: setTransition });

  const openDurationPicker = () =>
    setPicker({ title: 'Thời gian mỗi từ', options: DURATION_OPTIONS, onSelect: setDuration });

  const openDisplayOrderPicker = () =>
    setPicker({
      title: 'Thứ tự hiển thị',
      options: DISPLAY_ORDER_OPTIONS,
      onSelect: setDisplayOrder,
    });

  const openRepeatPicker = () =>
    setPicker({ title: 'Lặp lại video', options: REPEAT_OPTIONS, onSelect: setRepeatOption });

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const openGripMenu = (item: VideoVocabItem, index: number) => {
    const buttons: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' }[] = [];
    if (index > 0) buttons.push({ text: 'Di chuyển lên', onPress: () => moveItem(index, -1) });
    if (index < items.length - 1) {
      buttons.push({ text: 'Di chuyển xuống', onPress: () => moveItem(index, 1) });
    }
    buttons.push({ text: 'Đóng', style: 'cancel' });
    Alert.alert(item.word, undefined, buttons);
  };

  const removeItem = (item: VideoVocabItem) => {
    Alert.alert('Xoá từ vựng?', `Bạn có chắc muốn xoá "${item.word}" khỏi video?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          setItems((prev) => prev.filter((v) => v.id !== item.id));
          Toast.show({ type: 'success', text1: `Đã xoá "${item.word}"` });
        },
      },
    ]);
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
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tạo video từ vựng</Text>
            {/* Chưa có màn hình xem trước video riêng */}
            <TouchableOpacity style={styles.headerPreviewBtn} onPress={notImplemented}>
              <GalleryHorizontalEnd size={16} color="#fff" />
              <Text style={styles.headerPreviewBtnText}>Xem trước</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stepperCard}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>1</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
              Nội dung
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel} numberOfLines={2}>
              Thiết kế
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel} numberOfLines={2}>
              Nhạc & giọng đọc
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>4</Text>
            </View>
            <Text style={styles.stepLabel} numberOfLines={2}>
              Hoàn thành
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <VideoIcon size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Thông tin video</Text>
          </View>

          <Text style={styles.fieldLabel}>
            Tiêu đề video <Text style={styles.requiredMark}>*</Text>
          </Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldInput}
              value={title}
              onChangeText={(v) => setTitle(v.slice(0, TITLE_MAX))}
              placeholder="Nhập tiêu đề video"
              placeholderTextColor="#a7a7a7"
            />
          </View>
          <Text style={styles.fieldCounter}>
            {title.length}/{TITLE_MAX}
          </Text>

          <View style={styles.rowSplit}>
            <View style={styles.rowSplitColWide}>
              <Text style={styles.fieldLabel}>Mô tả video (tùy chọn)</Text>
              <View style={styles.fieldInputWrapper}>
                <TextInput
                  style={styles.fieldTextarea}
                  value={description}
                  onChangeText={(v) => setDescription(v.slice(0, DESCRIPTION_MAX))}
                  placeholder="Nhập mô tả cho video"
                  placeholderTextColor="#a7a7a7"
                  multiline
                />
              </View>
              <Text style={styles.fieldCounter}>
                {description.length}/{DESCRIPTION_MAX}
              </Text>
            </View>
            <View style={styles.rowSplitCol}>
              <Text style={styles.fieldLabel}>Độ tuổi phù hợp</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openAgeRangePicker}>
                <Smile size={15} color="#0066cc" />
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {ageRange}
                </Text>
                <ChevronDown size={15} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowSplit}>
            <View style={styles.rowSplitColWide}>
              <Text style={styles.fieldLabel}>Chủ đề</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setTopicPickerVisible(true)}
              >
                {selectedTopicIds.length === 0 ? (
                  <Text style={styles.chipPlaceholder} numberOfLines={1}>
                    Chọn chủ đề
                  </Text>
                ) : (
                  <View style={styles.chipsWrap}>
                    {selectedTopicIds.map((id) => {
                      const t = topicById(id);
                      return (
                        <View key={id} style={styles.chip}>
                          <Text style={styles.chipText} numberOfLines={1}>
                            {t.label}
                          </Text>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleTopic(id);
                            }}
                          >
                            <X size={12} color="#0066cc" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
                <ChevronDown size={15} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.rowSplitCol}>
              <Text style={styles.fieldLabel}>Cấp độ</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openLevelPicker}>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText} numberOfLines={1}>
                    {LEVEL_LABELS[level]}
                  </Text>
                </View>
                <ChevronDown size={15} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <ImageIcon size={18} color="#0066cc" />
              <Text style={styles.sectionTitle}>
                Danh sách từ vựng ({items.length}/{MAX_VOCAB_IN_VIDEO})
              </Text>
            </View>
            {/* Chưa có màn hình chọn từ vựng có sẵn để thêm vào video */}
            <TouchableOpacity style={styles.addBtn} onPress={notImplemented}>
              <Plus size={16} color="#0066cc" />
              <Text style={styles.addBtnText}>Thêm từ vựng</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vocabListWrapper}>
            {items.map((item, index) => {
              const topic = topicById(selectedTopicIds[0] ?? 'animal');
              const TopicIcon = topic.icon;
              return (
                <View key={item.id} style={styles.vocabRow}>
                  <TouchableOpacity
                    style={styles.vocabGripBtn}
                    onPress={() => openGripMenu(item, index)}
                  >
                    <GripVertical size={16} color="#94A3B8" />
                  </TouchableOpacity>
                  <View style={styles.vocabIndexBadge}>
                    <Text style={styles.vocabIndexText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.vocabImageWrapper, { backgroundColor: `${topic.color}12` }]}>
                    <TopicIcon size={22} color={topic.color} />
                  </View>
                  <View style={styles.vocabInfo}>
                    <View style={styles.vocabWordRow}>
                      <Text style={styles.vocabWord}>{item.word}</Text>
                      <TouchableOpacity onPress={notImplemented}>
                        <Volume2 size={13} color="#0066cc" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.vocabPhonetic}>{item.phonetic}</Text>
                    <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                  </View>
                  <View style={styles.vocabActionsCol}>
                    <TouchableOpacity style={styles.vocabActionBtn} onPress={notImplemented}>
                      <ImageIcon size={16} color="#0066cc" />
                      <Text style={[styles.vocabActionBtnText, { color: '#0066cc' }]}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.vocabActionBtn}
                      onPress={() => removeItem(item)}
                    >
                      <Trash2 size={16} color="#DC2626" />
                      <Text style={[styles.vocabActionBtnText, { color: '#DC2626' }]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Settings2 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Tùy chọn video</Text>
          </View>
          <View style={styles.optionsGrid}>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionBox} onPress={openTransitionPicker}>
                <View style={styles.optionBoxTopRow}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: '#EEF7FF' }]}>
                    <GalleryHorizontalEnd size={13} color="#0066cc" />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={2}>
                    Hiệu ứng chuyển cảnh
                  </Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText} numberOfLines={1}>
                    {transition}
                  </Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionBox} onPress={openDurationPicker}>
                <View style={styles.optionBoxTopRow}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: '#EEF7FF' }]}>
                    <Clock3 size={13} color="#0066cc" />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={2}>
                    Thời gian mỗi từ
                  </Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText} numberOfLines={1}>
                    {duration}
                  </Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.optionCol}>
              <View style={styles.optionBox}>
                <View style={styles.optionBoxTopRow}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: '#DCFCE7' }]}>
                    <Type size={13} color="#16A34A" />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={2}>
                    Hiển thị chữ
                  </Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText} numberOfLines={1}>
                    {showText ? 'Đang bật' : 'Đang tắt'}
                  </Text>
                  <Switch value={showText} onValueChange={setShowText} />
                </View>
              </View>
            </View>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionBox} onPress={openDisplayOrderPicker}>
                <View style={styles.optionBoxTopRow}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: '#F3E8FF' }]}>
                    <ListOrdered size={13} color="#8B5CF6" />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={2}>
                    Thứ tự hiển thị
                  </Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText} numberOfLines={1}>
                    {displayOrder}
                  </Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionBox} onPress={openRepeatPicker}>
                <View style={styles.optionBoxTopRow}>
                  <View style={[styles.optionIconWrapper, { backgroundColor: '#EEF7FF' }]}>
                    <Repeat size={13} color="#0066cc" />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={2}>
                    Lặp lại video
                  </Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText} numberOfLines={1}>
                    {repeatOption}
                  </Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Lightbulb size={16} color="#0066cc" />
          <Text style={styles.tipText}>
            <Text style={styles.tipTextBold}>Mẹo:</Text> Thêm từ vựng chất lượng và hình ảnh rõ
            nét để video sinh động hơn!
          </Text>
        </View>

        <View style={styles.bottomBar}>
          {/* Chưa có API lưu bản nháp video thật */}
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={notImplemented}>
            <SlidersHorizontal size={16} color="#0066cc" />
            <Text style={styles.bottomOutlineBtnText}>Lưu nháp</Text>
          </TouchableOpacity>
          {/* Chưa có bước 3 "Nhạc & giọng đọc" / 4 "Hoàn thành" — dữ liệu đã
          nhập ở bước này chưa được truyền sang bước 2 (chưa có state/Context
          dùng chung giữa các bước trong luồng tạo video). */}
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/vocabulary-video-design')}
          >
            <Text style={styles.bottomPrimaryBtnText}>Tiếp tục</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={topicPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTopicPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTopicPickerVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn chủ đề</Text>
            <ScrollView>
              {TOPICS.map((t) => {
                const selected = selectedTopicIds.includes(t.id);
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.modalOption}
                    onPress={() => toggleTopic(t.id)}
                  >
                    <Text style={styles.modalOptionText}>{t.label}</Text>
                    {selected && <Check size={16} color="#0066cc" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setTopicPickerVisible(false)}
            >
              <Text style={styles.modalDoneBtnText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={!!picker}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPicker(null)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{picker?.title}</Text>
            <ScrollView>
              {picker?.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    picker.onSelect(option);
                    setPicker(null);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default VocabularyVideoCreateScreen;
