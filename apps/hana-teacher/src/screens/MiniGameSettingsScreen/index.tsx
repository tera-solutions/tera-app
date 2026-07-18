import { useState } from 'react';
import { Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Dices,
  GalleryHorizontalEnd,
  Heart,
  Home,
  Music,
  RotateCcw,
  Settings2,
  Shuffle,
  SkipForward,
  Smile,
  Target,
  Trophy,
  Vibrate,
  Volume2,
} from 'lucide-react-native';

import {
  GAMEPLAY_RULES,
  GameplayRuleItem,
  LIVES_OPTIONS,
  PASSING_SCORE_OPTIONS,
  SOUND_RULES,
  SoundRuleItem,
  TIME_LIMIT_OPTIONS,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const RULE_ICONS: Record<GameplayRuleItem['key'], typeof Shuffle> = {
  shuffleQuestions: Shuffle,
  shuffleAnswers: Dices,
  allowRetry: RotateCcw,
  allowSkip: SkipForward,
};

const SOUND_ICONS: Record<SoundRuleItem['key'], typeof Music> = {
  backgroundMusic: Music,
  soundEffects: Volume2,
  vibrateOnWrong: Vibrate,
};

interface PickerConfig {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const MiniGameSettingsScreen = () => {
  const router = useRouter();

  const [rules, setRules] = useState<Record<GameplayRuleItem['key'], boolean>>({
    shuffleQuestions: true,
    shuffleAnswers: true,
    allowRetry: true,
    allowSkip: false,
  });
  const [sounds, setSounds] = useState<Record<SoundRuleItem['key'], boolean>>({
    backgroundMusic: true,
    soundEffects: true,
    vibrateOnWrong: true,
  });
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [timeLimit, setTimeLimit] = useState(TIME_LIMIT_OPTIONS[0]);
  const [lives, setLives] = useState(LIVES_OPTIONS[2]);
  const [passingScore, setPassingScore] = useState(PASSING_SCORE_OPTIONS[2]);
  const [picker, setPicker] = useState<PickerConfig | null>(null);

  const toggleRule = (key: GameplayRuleItem['key']) =>
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSound = (key: SoundRuleItem['key']) =>
    setSounds((prev) => ({ ...prev, [key]: !prev[key] }));

  const openTimeLimitPicker = () =>
    setPicker({ title: 'Giới hạn thời gian', options: TIME_LIMIT_OPTIONS, onSelect: setTimeLimit });

  const openLivesPicker = () =>
    setPicker({ title: 'Số mạng chơi', options: LIVES_OPTIONS, onSelect: setLives });

  const openPassingScorePicker = () =>
    setPicker({ title: 'Điểm đạt yêu cầu', options: PASSING_SCORE_OPTIONS, onSelect: setPassingScore });

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
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Check size={12} color="#fff" />
            </View>
            <Text style={styles.stepLabel} numberOfLines={2}>
              Nội dung
            </Text>
          </View>
          <View style={styles.stepSeparator}>
            <ArrowRight size={12} color="#CBD5E1" />
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
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
            <Settings2 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Luật chơi</Text>
          </View>
          {GAMEPLAY_RULES.map((rule, index) => {
            const RuleIcon = RULE_ICONS[rule.key];
            return (
              <View
                key={rule.key}
                style={[styles.settingRow, index === 0 && styles.settingRowFirst]}
              >
                <View style={styles.settingIconWrapper}>
                  <RuleIcon size={16} color="#0066cc" />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>{rule.label}</Text>
                  <Text style={styles.settingDescription}>{rule.description}</Text>
                </View>
                <Switch value={rules[rule.key]} onValueChange={() => toggleRule(rule.key)} />
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Clock3 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Thời gian & mạng chơi</Text>
          </View>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Giới hạn thời gian</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openTimeLimitPicker}>
                <Clock3 size={16} color="#0066cc" />
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {timeLimit}
                </Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Số mạng chơi</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openLivesPicker}>
                <Heart size={16} color="#0066cc" />
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {lives}
                </Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownCol}>
              <Text style={styles.fieldLabel}>Điểm đạt yêu cầu</Text>
              <TouchableOpacity style={styles.dropdownBtn} onPress={openPassingScorePicker}>
                <Target size={16} color="#0066cc" />
                <Text style={styles.dropdownBtnText} numberOfLines={1}>
                  {passingScore}
                </Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Volume2 size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Âm thanh & hiệu ứng</Text>
          </View>
          {SOUND_RULES.map((rule, index) => {
            const RuleIcon = SOUND_ICONS[rule.key];
            return (
              <View
                key={rule.key}
                style={[styles.settingRow, index === 0 && styles.settingRowFirst]}
              >
                <View style={styles.settingIconWrapper}>
                  <RuleIcon size={16} color="#0066cc" />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>{rule.label}</Text>
                  <Text style={styles.settingDescription}>{rule.description}</Text>
                </View>
                <Switch value={sounds[rule.key]} onValueChange={() => toggleSound(rule.key)} />
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Trophy size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Kết quả</Text>
          </View>
          <View style={[styles.settingRow, styles.settingRowFirst]}>
            <View style={styles.settingIconWrapper}>
              <Trophy size={16} color="#0066cc" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Hiện bảng xếp hạng sau khi chơi</Text>
              <Text style={styles.settingDescription}>
                Hiển thị điểm số và thứ hạng của học sinh khi kết thúc lượt chơi
              </Text>
            </View>
            <Switch value={showLeaderboard} onValueChange={setShowLeaderboard} />
          </View>
          <View style={styles.resultNote}>
            <Text style={styles.resultNoteText}>
              Bảng xếp hạng học tập tổng hợp đã có ở mục riêng, đây chỉ là bảng xếp hạng nội bộ
              của lượt chơi mini game này.
            </Text>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Smile size={16} color="#0066cc" />
          <Text style={styles.tipText}>
            <Text style={styles.tipTextBold}>Mẹo:</Text> Bật "Cho phép làm lại khi sai" giúp học
            sinh yếu vẫn hoàn thành được thử thách.
          </Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={() => router.back()}>
            <Text style={styles.bottomOutlineBtnText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/mini-game-complete')}
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

export default MiniGameSettingsScreen;
