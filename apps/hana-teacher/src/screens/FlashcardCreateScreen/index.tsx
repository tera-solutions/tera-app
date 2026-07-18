import { useMemo, useState } from 'react';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  GalleryHorizontalEnd,
  GraduationCap,
  ListOrdered,
  MonitorSmartphone,
  MoreVertical,
  Plus,
  Settings2,
  SlidersHorizontal,
  Smile,
  StickyNote,
  Volume2,
} from 'lucide-react-native';

import { TOPICS, topicById } from '@screens/VocabularyScreen/constants';

import {
  AGE_RANGE_OPTIONS,
  CARD_SORT_OPTIONS,
  DISPLAY_ORDER_OPTIONS,
  FLASHCARD_SEED,
  FlashcardItem,
  STUDY_MODE_OPTIONS,
  toBracketPhonetic,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 200;
const NOTE_MAX = 200;

interface PickerConfig {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const FlashcardCreateScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState('Animals – Động vật');
  const [description, setDescription] = useState(
    'Bộ thẻ giúp học sinh nhận biết và gọi tên các con vật bằng tiếng Anh.',
  );
  const [note, setNote] = useState('');
  const [topicId, setTopicId] = useState('animal');
  const [ageRange, setAgeRange] = useState('4 - 6 tuổi');
  const [studyMode, setStudyMode] = useState(STUDY_MODE_OPTIONS[0]);
  const [displayOrder, setDisplayOrder] = useState(DISPLAY_ORDER_OPTIONS[0]);
  const [cardSort, setCardSort] = useState(CARD_SORT_OPTIONS[0]);
  const [playAudioEnabled, setPlayAudioEnabled] = useState(true);
  const [showPhonetic, setShowPhonetic] = useState(true);
  const [cards, setCards] = useState<FlashcardItem[]>(FLASHCARD_SEED);
  const [picker, setPicker] = useState<PickerConfig | null>(null);

  const topic = topicById(topicId);

  const sortedCards = useMemo(() => {
    if (cardSort === 'A-Z') return [...cards].sort((a, b) => a.word.localeCompare(b.word));
    if (cardSort === 'Z-A') return [...cards].sort((a, b) => b.word.localeCompare(a.word));
    return cards;
  }, [cards, cardSort]);

  const openTopicPicker = () => {
    setPicker({
      title: 'Chọn chủ đề',
      options: TOPICS.map((t) => t.label),
      onSelect: (label) => {
        const found = TOPICS.find((t) => t.label === label);
        if (found) setTopicId(found.id);
      },
    });
  };

  const openAgeRangePicker = () => {
    setPicker({ title: 'Độ tuổi phù hợp', options: AGE_RANGE_OPTIONS, onSelect: setAgeRange });
  };

  const openStudyModePicker = () => {
    setPicker({ title: 'Chế độ học', options: STUDY_MODE_OPTIONS, onSelect: setStudyMode });
  };

  const openDisplayOrderPicker = () => {
    setPicker({
      title: 'Thứ tự hiển thị',
      options: DISPLAY_ORDER_OPTIONS,
      onSelect: setDisplayOrder,
    });
  };

  const toggleCardSort = () => {
    const nextIndex = (CARD_SORT_OPTIONS.indexOf(cardSort) + 1) % CARD_SORT_OPTIONS.length;
    setCardSort(CARD_SORT_OPTIONS[nextIndex]);
  };

  const removeCard = (card: FlashcardItem) => {
    setCards((prev) => prev.filter((c) => c.id !== card.id));
    Toast.show({ type: 'success', text1: `Đã xoá thẻ "${card.word}"` });
  };

  const openCardActions = (card: FlashcardItem) => {
    Alert.alert(card.word, undefined, [
      { text: 'Sửa thẻ', onPress: notImplemented },
      { text: 'Xoá thẻ', style: 'destructive', onPress: () => removeCard(card) },
      { text: 'Đóng', style: 'cancel' },
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
            <Text style={styles.headerTitle}>Tạo Flashcard</Text>
            {/* Chưa có màn hình xem trước bộ thẻ riêng */}
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
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Nội dung</Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={16} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Thiết kế</Text>
          </View>
          <View style={styles.stepSeparator}>
            <ChevronRight size={16} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Hoàn thành</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <FileText size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Thông tin chung</Text>
          </View>

          <Text style={styles.fieldLabel}>
            Tiêu đề bộ thẻ <Text style={styles.requiredMark}>*</Text>
          </Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldInput}
              value={title}
              onChangeText={(v) => setTitle(v.slice(0, TITLE_MAX))}
              placeholder="Nhập tiêu đề bộ thẻ"
              placeholderTextColor="#a7a7a7"
            />
          </View>
          <Text style={styles.fieldCounter}>
            {title.length}/{TITLE_MAX}
          </Text>

          <Text style={styles.fieldLabel}>Mô tả (tùy chọn)</Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldTextarea}
              value={description}
              onChangeText={(v) => setDescription(v.slice(0, DESCRIPTION_MAX))}
              placeholder="Nhập mô tả cho bộ thẻ"
              placeholderTextColor="#a7a7a7"
              multiline
            />
          </View>
          <Text style={styles.fieldCounter}>
            {description.length}/{DESCRIPTION_MAX}
          </Text>

          <View style={styles.dropdownRow}>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Chủ đề</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openTopicPicker}>
                <topic.icon size={16} color={topic.color} />
                <Text style={styles.dropdownBtnText}>{topic.label}</Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Độ tuổi phù hợp</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openAgeRangePicker}>
                <Smile size={16} color="#0066cc" />
                <Text style={styles.dropdownBtnText}>{ageRange}</Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Copy size={18} color="#0066cc" />
              <Text style={styles.sectionTitle}>Tạo thẻ Flashcard</Text>
            </View>
            <TouchableOpacity style={styles.sortBtn} onPress={toggleCardSort}>
              <Text style={styles.sortLabel}>Sắp xếp: </Text>
              <Text style={styles.sortValue}>{cardSort}</Text>
              <ChevronDown size={14} color="#0066cc" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardListRow}
          >
            <TouchableOpacity style={styles.addCardTile} onPress={notImplemented}>
              <Text style={styles.addCardTileTitle}>Thêm thẻ mới</Text>
              <View style={styles.addCardTileIcon}>
                <Plus size={20} color="#fff" />
              </View>
              <Text style={styles.addCardTileText}>Tạo thẻ flashcard</Text>
            </TouchableOpacity>

            {sortedCards.map((card, index) => (
              <View key={card.id} style={styles.flashCard}>
                <View style={styles.flashCardTopRow}>
                  <View style={styles.flashCardIndexBadge}>
                    <Text style={styles.flashCardIndexText}>{index + 1}</Text>
                  </View>
                  <TouchableOpacity onPress={() => openCardActions(card)}>
                    <MoreVertical size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.flashCardImageWrapper, { backgroundColor: `${topic.color}12` }]}>
                  <topic.icon size={34} color={topic.color} />
                </View>
                <View style={styles.flashCardInfo}>
                  <Text style={styles.flashCardWord}>{card.word}</Text>
                  <View style={styles.flashCardPhoneticRow}>
                    <Text style={styles.flashCardPhonetic}>
                      {toBracketPhonetic(card.phonetic)}
                    </Text>
                    <TouchableOpacity onPress={notImplemented}>
                      <Volume2 size={13} color="#0066cc" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardFooterText}>Tổng số thẻ: {cards.length} thẻ</Text>
            <TouchableOpacity style={styles.manageCardsBtn} onPress={notImplemented}>
              <SlidersHorizontal size={13} color="#0066cc" />
              <Text style={styles.manageCardsBtnText}>Quản lý thẻ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <GraduationCap size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Tùy chọn học tập</Text>
          </View>
          <View style={styles.optionsGrid}>
            <View style={styles.optionCol}>
              <View style={styles.optionRow}>
                <View style={[styles.optionIconWrapper, { backgroundColor: '#EEF7FF' }]}>
                  <Volume2 size={15} color="#0066cc" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Phát âm thanh</Text>
                  <Text style={styles.optionSubLabel}>Phát âm khi lật thẻ</Text>
                </View>
                <Switch value={playAudioEnabled} onValueChange={setPlayAudioEnabled} />
              </View>
            </View>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionRow} onPress={openStudyModePicker}>
                <View style={[styles.optionIconWrapper, { backgroundColor: '#DCFCE7' }]}>
                  <MonitorSmartphone size={15} color="#16A34A" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Chế độ học</Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText}>{studyMode}</Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.optionCol}>
              <View style={styles.optionRow}>
                <View style={[styles.optionIconWrapper, { backgroundColor: '#EEF7FF' }]}>
                  <Settings2 size={15} color="#0066cc" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Hiển thị phiên âm</Text>
                  <Text style={styles.optionSubLabel}>Hiển thị IPA / phiên âm</Text>
                </View>
                <Switch value={showPhonetic} onValueChange={setShowPhonetic} />
              </View>
            </View>
            <View style={styles.optionCol}>
              <TouchableOpacity style={styles.optionRow} onPress={openDisplayOrderPicker}>
                <View style={[styles.optionIconWrapper, { backgroundColor: '#F3E8FF' }]}>
                  <ListOrdered size={15} color="#8B5CF6" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Thứ tự hiển thị</Text>
                </View>
                <View style={styles.optionValueRow}>
                  <Text style={styles.optionValueText}>{displayOrder}</Text>
                  <ChevronDown size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <StickyNote size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Ghi chú (tùy chọn)</Text>
          </View>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldTextarea}
              value={note}
              onChangeText={(v) => setNote(v.slice(0, NOTE_MAX))}
              placeholder="Thêm ghi chú cho bộ thẻ này..."
              placeholderTextColor="#a7a7a7"
              multiline
            />
          </View>
          <Text style={styles.fieldCounter}>
            {note.length}/{NOTE_MAX}
          </Text>
        </View>

        <View style={styles.bottomBar}>
          {/* Chưa có API lưu bản nháp bộ thẻ thật */}
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={notImplemented}>
            <SlidersHorizontal size={16} color="#0066cc" />
            <Text style={styles.bottomOutlineBtnText}>Lưu nháp</Text>
          </TouchableOpacity>
          {/* Chưa có bước 2 "Thiết kế" / bước 3 "Hoàn thành" */}
          <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={notImplemented}>
            <Text style={styles.bottomPrimaryBtnText}>Tiếp tục</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

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

export default FlashcardCreateScreen;
