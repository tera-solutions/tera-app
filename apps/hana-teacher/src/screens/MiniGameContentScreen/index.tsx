import { useState } from 'react';
import {
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
  ChevronLeft,
  FileText,
  GalleryHorizontalEnd,
  Headphones,
  Home,
  Image as ImageIcon,
  ListChecks,
  MessageCircle,
  Plus,
  Smile,
  Sparkles,
  X,
} from 'lucide-react-native';

import { topicById, VOCAB_ITEMS } from '@screens/VocabularyScreen/constants';

import { CONTENT_QUESTIONS_SEED, ContentQuestionItem, HINT_MAX } from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const INTRO_TITLE_MAX = 60;
const INTRO_MESSAGE_MAX = 160;
const OUTRO_MESSAGE_MAX = 160;

interface PickerConfig {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const MiniGameContentScreen = () => {
  const router = useRouter();

  const [introTitle, setIntroTitle] = useState('Cùng giải cứu các con vật nào!');
  const [introMessage, setIntroMessage] = useState(
    'Chọn đúng từ vựng để mở khoá từng chặng và giải cứu các con vật đáng yêu.',
  );
  const [outroMessage, setOutroMessage] = useState(
    'Chúc mừng bạn đã hoàn thành thử thách! Hãy chia sẻ kết quả với cô giáo nhé.',
  );
  const [questions, setQuestions] = useState<ContentQuestionItem[]>(CONTENT_QUESTIONS_SEED);
  const [picker, setPicker] = useState<PickerConfig | null>(null);

  const updateQuestion = (wordId: string, patch: Partial<ContentQuestionItem>) => {
    setQuestions((prev) => prev.map((q) => (q.wordId === wordId ? { ...q, ...patch } : q)));
  };

  const removeDistractor = (wordId: string, distractorId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.wordId === wordId
          ? { ...q, distractorIds: q.distractorIds.filter((id) => id !== distractorId) }
          : q,
      ),
    );
  };

  const openDistractorPicker = (question: ContentQuestionItem) => {
    const candidates = VOCAB_ITEMS.filter(
      (w) => w.id !== question.wordId && !question.distractorIds.includes(w.id),
    );
    setPicker({
      title: 'Chọn đáp án gây nhiễu',
      options: candidates.map((w) => `${w.word} - ${w.meaning}`),
      onSelect: (label) => {
        const found = candidates.find((w) => `${w.word} - ${w.meaning}` === label);
        if (found) {
          updateQuestion(question.wordId, {
            distractorIds: [...question.distractorIds, found.id],
          });
        }
      },
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
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tạo Mini Game từ vựng</Text>
            <View style={styles.headerRightRow}>
              {/* Chưa có màn hình xem trước game riêng */}
              <TouchableOpacity style={styles.headerPreviewBtn} onPress={notImplemented}>
                <GalleryHorizontalEnd size={16} color="#fff" />
                <Text style={styles.headerPreviewBtnText}>Xem trước</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => router.push('/setting/more-app')}
              >
                <Home size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.stepperCard}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Check size={12} color="#fff" />
            </View>
            <Text style={styles.stepLabel} numberOfLines={2}>
              Cấu hình
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ArrowRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
              Nội dung
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ArrowRight size={12} color="#CBD5E1" />
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
            <ArrowRight size={12} color="#CBD5E1" />
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
            <MessageCircle size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Lời chào & giới thiệu</Text>
          </View>

          <Text style={styles.fieldLabel}>Tiêu đề mở đầu</Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldInput}
              value={introTitle}
              onChangeText={(v) => setIntroTitle(v.slice(0, INTRO_TITLE_MAX))}
              placeholder="Nhập tiêu đề hiển thị khi bắt đầu game"
              placeholderTextColor="#a7a7a7"
            />
          </View>
          <Text style={styles.fieldCounter}>
            {introTitle.length}/{INTRO_TITLE_MAX}
          </Text>

          <Text style={styles.fieldLabel}>Lời chào</Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldTextarea}
              value={introMessage}
              onChangeText={(v) => setIntroMessage(v.slice(0, INTRO_MESSAGE_MAX))}
              placeholder="Nhập lời chào/hướng dẫn ngắn cho học sinh"
              placeholderTextColor="#a7a7a7"
              multiline
            />
          </View>
          <Text style={styles.fieldCounter}>
            {introMessage.length}/{INTRO_MESSAGE_MAX}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <ListChecks size={18} color="#0066cc" />
              <Text style={styles.sectionTitle}>Danh sách câu hỏi</Text>
            </View>
            <Text style={styles.sectionCountText}>{questions.length} câu hỏi</Text>
          </View>

          {questions.map((question, index) => {
            const word = VOCAB_ITEMS.find((w) => w.id === question.wordId);
            if (!word) return null;
            const wordTopic = topicById(word.topicId);
            const WordIcon = wordTopic.icon;

            return (
              <View key={question.wordId} style={styles.questionCard}>
                <View style={styles.questionTopRow}>
                  <View style={styles.questionIndexBadge}>
                    <Text style={styles.questionIndexBadgeText}>{index + 1}</Text>
                  </View>
                  <View
                    style={[
                      styles.questionIconWrapper,
                      { backgroundColor: `${wordTopic.color}12` },
                    ]}
                  >
                    <WordIcon size={20} color={wordTopic.color} />
                  </View>
                  <View style={styles.questionWordInfo}>
                    <Text style={styles.questionWordName} numberOfLines={1}>
                      {word.word}
                    </Text>
                    <Text style={styles.questionWordMeaning} numberOfLines={1}>
                      {word.phonetic} · {word.meaning}
                    </Text>
                  </View>
                </View>

                <View style={styles.questionAnswerTag}>
                  <Check size={11} color="#15803D" />
                  <Text style={styles.questionAnswerTagText}>Đáp án đúng: {word.word}</Text>
                </View>

                <Text style={styles.questionSubLabel}>Đáp án gây nhiễu</Text>
                <View style={styles.distractorRow}>
                  {question.distractorIds.map((distractorId) => {
                    const distractor = VOCAB_ITEMS.find((w) => w.id === distractorId);
                    if (!distractor) return null;
                    return (
                      <View key={distractorId} style={styles.distractorChip}>
                        <Text style={styles.distractorChipText}>{distractor.word}</Text>
                        <TouchableOpacity
                          onPress={() => removeDistractor(question.wordId, distractorId)}
                        >
                          <X size={11} color="#B91C1C" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  <TouchableOpacity
                    style={styles.distractorAddChip}
                    onPress={() => openDistractorPicker(question)}
                  >
                    <Plus size={11} color="#0066cc" />
                    <Text style={styles.distractorAddChipText}>Thêm</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.questionSubLabel}>Gợi ý (tùy chọn)</Text>
                <View style={styles.hintInputWrapper}>
                  <TextInput
                    style={styles.hintInput}
                    value={question.hint ?? ''}
                    onChangeText={(v) =>
                      updateQuestion(question.wordId, { hint: v.slice(0, HINT_MAX) })
                    }
                    placeholder="Nhập gợi ý giúp học sinh dễ đoán hơn"
                    placeholderTextColor="#a7a7a7"
                  />
                </View>

                <View style={styles.mediaRow}>
                  <View style={styles.mediaToggleCol}>
                    <ImageIcon size={14} color="#0066cc" />
                    <Text style={styles.mediaToggleLabel}>Dùng hình ảnh</Text>
                    <Switch
                      value={question.useImage}
                      onValueChange={(v) => updateQuestion(question.wordId, { useImage: v })}
                    />
                  </View>
                  <View style={styles.mediaToggleCol}>
                    <Headphones
                      size={14}
                      color={word.hasAudio ? '#0066cc' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.mediaToggleLabel,
                        !word.hasAudio && styles.mediaToggleLabelDisabled,
                      ]}
                    >
                      Dùng âm thanh
                    </Text>
                    <Switch
                      value={question.useAudio}
                      disabled={!word.hasAudio}
                      onValueChange={(v) => updateQuestion(question.wordId, { useAudio: v })}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <FileText size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Lời kết thúc</Text>
          </View>

          <Text style={styles.fieldLabel}>Thông điệp khi hoàn thành</Text>
          <View style={styles.fieldInputWrapper}>
            <TextInput
              style={styles.fieldTextarea}
              value={outroMessage}
              onChangeText={(v) => setOutroMessage(v.slice(0, OUTRO_MESSAGE_MAX))}
              placeholder="Nhập thông điệp chúc mừng khi học sinh hoàn thành game"
              placeholderTextColor="#a7a7a7"
              multiline
            />
          </View>
          <Text style={styles.fieldCounter}>
            {outroMessage.length}/{OUTRO_MESSAGE_MAX}
          </Text>
        </View>

        <View style={styles.tipBox}>
          <Smile size={16} color="#0066cc" />
          <Text style={styles.tipText}>
            <Text style={styles.tipTextBold}>Mẹo:</Text> Nên thêm gợi ý cho những từ khó để học
            sinh không bị bỏ cuộc giữa chừng.
          </Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={() => router.back()}>
            <Text style={styles.bottomOutlineBtnText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/mini-game-settings')}
          >
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

export default MiniGameContentScreen;
