import { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
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
  Gamepad2,
  ChartColumnIncreasing,
  ListOrdered,
  Plus,
  Smile,
  Sparkles,
  Star,
  X,
} from 'lucide-react-native';

import { TOPICS, topicById, VOCAB_ITEMS, VocabItem } from '@screens/VocabularyScreen/constants';

import {
  Difficulty,
  DIFFICULTY_LABELS,
  DIFFICULTY_OPTIONS,
  GAME_TYPES,
  POINTS_PER_QUESTION_OPTIONS,
  QUESTION_COUNT_OPTIONS,
  TIME_PER_QUESTION_OPTIONS,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const TITLE_MAX = 50;
const DESCRIPTION_MAX = 200;

interface PickerConfig {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const MiniGameCreateScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState('Animal Escape');
  const [description, setDescription] = useState(
    'Giúp học sinh chọn đúng từ vựng để giải cứu các con vật và vượt qua thử thách!',
  );
  const [topicId, setTopicId] = useState('animal');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>(['v1', 'v2', 'v3', 'v25']);
  const [selectedGameTypeId, setSelectedGameTypeId] = useState('choose-answer');
  const [timePerQuestion, setTimePerQuestion] = useState(TIME_PER_QUESTION_OPTIONS[2]);
  const [questionCount, setQuestionCount] = useState(QUESTION_COUNT_OPTIONS[1]);
  const [pointsPerQuestion, setPointsPerQuestion] = useState(POINTS_PER_QUESTION_OPTIONS[1]);
  const [picker, setPicker] = useState<PickerConfig | null>(null);
  const [vocabPickerVisible, setVocabPickerVisible] = useState(false);

  const topic = topicById(topicId);

  const selectedWords = useMemo(
    () => selectedWordIds.map((id) => VOCAB_ITEMS.find((v) => v.id === id)).filter(Boolean) as VocabItem[],
    [selectedWordIds],
  );

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

  const openDifficultyPicker = () => {
    setPicker({
      title: 'Độ khó',
      options: DIFFICULTY_OPTIONS.map((d) => DIFFICULTY_LABELS[d]),
      onSelect: (label) => {
        const found = DIFFICULTY_OPTIONS.find((d) => DIFFICULTY_LABELS[d] === label);
        if (found) setDifficulty(found);
      },
    });
  };

  const openTimePicker = () =>
    setPicker({ title: 'Thời gian mỗi câu', options: TIME_PER_QUESTION_OPTIONS, onSelect: setTimePerQuestion });

  const openQuestionCountPicker = () =>
    setPicker({ title: 'Số câu hỏi', options: QUESTION_COUNT_OPTIONS, onSelect: setQuestionCount });

  const openPointsPicker = () =>
    setPicker({ title: 'Điểm mỗi câu', options: POINTS_PER_QUESTION_OPTIONS, onSelect: setPointsPerQuestion });

  const toggleWord = (id: string) => {
    setSelectedWordIds((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  };

  const removeWord = (id: string) => {
    setSelectedWordIds((prev) => prev.filter((w) => w !== id));
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
            <Text style={styles.headerTitle}>Tạo Mini Game từ vựng</Text>
            {/* Chưa có màn hình xem trước game riêng */}
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
              Cấu hình
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
              Nội dung
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
              Cài đặt
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
            <Gamepad2 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Thông tin game</Text>
          </View>

          <Text style={styles.fieldLabel}>
            Tên game <Text style={styles.requiredMark}>*</Text>
          </Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldInput}
              value={title}
              onChangeText={(v) => setTitle(v.slice(0, TITLE_MAX))}
              placeholder="Nhập tên game"
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
              placeholder="Nhập mô tả cho game"
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
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {topic.label}
                </Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Độ khó</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openDifficultyPicker}>
                <ChartColumnIncreasing size={16} color="#0066cc" />
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {DIFFICULTY_LABELS[difficulty]}
                </Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Star size={18} color="#0066cc" />
              <Text style={styles.sectionTitle}>Chọn từ vựng</Text>
            </View>
            <Text style={styles.sectionCountText}>Đã chọn: {selectedWords.length} từ</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wordListRow}
          >
            {selectedWords.map((word) => {
              const wordTopic = topicById(word.topicId);
              const WordIcon = wordTopic.icon;
              return (
                <View key={word.id} style={styles.wordCard}>
                  <View
                    style={[styles.wordCardImageWrapper, { backgroundColor: `${wordTopic.color}12` }]}
                  >
                    <WordIcon size={30} color={wordTopic.color} />
                    <TouchableOpacity
                      style={styles.wordCardRemoveBtn}
                      onPress={() => removeWord(word.id)}
                    >
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.wordCardInfo}>
                    <Text style={styles.wordCardName} numberOfLines={1}>
                      {word.word}
                    </Text>
                    <Text style={styles.wordCardPhonetic} numberOfLines={1}>
                      {word.phonetic}
                    </Text>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.addWordTile}
              onPress={() => setVocabPickerVisible(true)}
            >
              <View style={styles.addWordTileIcon}>
                <Plus size={18} color="#fff" />
              </View>
              <Text style={styles.addWordTileText}>Thêm từ</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.chooseVocabBtn}
            onPress={() => setVocabPickerVisible(true)}
          >
            <ChevronDown size={16} color="#0066cc" />
            <Text style={styles.chooseVocabBtnText}>Chọn từ vựng</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Gamepad2 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Chọn loại mini game</Text>
          </View>
          <View style={styles.gameTypeGrid}>
            {GAME_TYPES.map((type) => {
              const TypeIcon = type.icon;
              const selected = selectedGameTypeId === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.gameTypeCard, selected && styles.gameTypeCardSelected]}
                  onPress={() => setSelectedGameTypeId(type.id)}
                >
                  {selected && (
                    <View style={styles.gameTypeCheckBadge}>
                      <Check size={11} color="#fff" />
                    </View>
                  )}
                  <View style={styles.gameTypeIconWrapper}>
                    <TypeIcon size={18} color="#0066cc" />
                  </View>
                  <Text style={styles.gameTypeLabel} numberOfLines={2}>
                    {type.label}
                  </Text>
                  <Text style={styles.gameTypeSublabel} numberOfLines={2}>
                    {type.sublabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Thiết lập nhanh</Text>
          </View>
          <View style={styles.quickSetupRow}>
            <View style={styles.quickSetupCol}>
              <TouchableOpacity style={styles.quickSetupBox} onPress={openTimePicker}>
                <View style={styles.quickSetupTopRow}>
                  <View style={styles.quickSetupIconWrapper}>
                    <Clock3 size={12} color="#0066cc" />
                  </View>
                  <Text style={styles.quickSetupLabel} numberOfLines={2}>
                    Thời gian mỗi câu
                  </Text>
                </View>
                <View style={styles.quickSetupValueRow}>
                  <Text style={styles.quickSetupValueText} numberOfLines={1}>
                    {timePerQuestion}
                  </Text>
                  <ChevronDown size={12} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.quickSetupCol}>
              <TouchableOpacity style={styles.quickSetupBox} onPress={openQuestionCountPicker}>
                <View style={styles.quickSetupTopRow}>
                  <View style={styles.quickSetupIconWrapper}>
                    <ListOrdered size={12} color="#0066cc" />
                  </View>
                  <Text style={styles.quickSetupLabel} numberOfLines={2}>
                    Số câu hỏi
                  </Text>
                </View>
                <View style={styles.quickSetupValueRow}>
                  <Text style={styles.quickSetupValueText} numberOfLines={1}>
                    {questionCount}
                  </Text>
                  <ChevronDown size={12} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.quickSetupCol}>
              <TouchableOpacity style={styles.quickSetupBox} onPress={openPointsPicker}>
                <View style={styles.quickSetupTopRow}>
                  <View style={styles.quickSetupIconWrapper}>
                    <Star size={12} color="#0066cc" />
                  </View>
                  <Text style={styles.quickSetupLabel} numberOfLines={2}>
                    Điểm mỗi câu
                  </Text>
                </View>
                <View style={styles.quickSetupValueRow}>
                  <Text style={styles.quickSetupValueText} numberOfLines={1}>
                    {pointsPerQuestion}
                  </Text>
                  <ChevronDown size={12} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Smile size={16} color="#0066cc" />
          <Text style={styles.tipText}>
            <Text style={styles.tipTextBold}>Mẹo:</Text> Bạn có thể xem trước game ở bước tiếp
            theo trước khi hoàn thành.
          </Text>
        </View>

        <View style={styles.bottomBar}>
          {/* Chưa có API lưu bản nháp mini game thật */}
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={notImplemented}>
            <Text style={styles.bottomOutlineBtnText}>Lưu nháp</Text>
          </TouchableOpacity>
          {/* Chưa có bước 3 "Cài đặt" / 4 "Hoàn thành" */}
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/mini-game-content')}
          >
            <Text style={styles.bottomPrimaryBtnText}>Tiếp tục</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={vocabPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVocabPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVocabPickerVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Chọn từ vựng</Text>
            <ScrollView>
              {VOCAB_ITEMS.map((word) => {
                const wordTopic = topicById(word.topicId);
                const WordIcon = wordTopic.icon;
                const selected = selectedWordIds.includes(word.id);
                return (
                  <TouchableOpacity
                    key={word.id}
                    style={styles.modalVocabRow}
                    onPress={() => toggleWord(word.id)}
                  >
                    <View style={[styles.modalCheckbox, selected && styles.modalCheckboxSelected]}>
                      {selected && <Check size={13} color="#fff" />}
                    </View>
                    <View
                      style={[
                        styles.modalVocabIconWrapper,
                        { backgroundColor: `${wordTopic.color}12` },
                      ]}
                    >
                      <WordIcon size={16} color={wordTopic.color} />
                    </View>
                    <View style={styles.modalVocabInfo}>
                      <Text style={styles.modalVocabWord}>{word.word}</Text>
                      <Text style={styles.modalVocabMeaning}>{word.meaning}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setVocabPickerVisible(false)}
            >
              <Text style={styles.modalDoneBtnText}>
                Xong ({selectedWordIds.length} từ đã chọn)
              </Text>
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

export default MiniGameCreateScreen;
