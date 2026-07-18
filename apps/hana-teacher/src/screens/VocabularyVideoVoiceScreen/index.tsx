import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontalEnd,
  Home,
  Music,
  Play,
  Sparkles,
  Volume2,
} from 'lucide-react-native';

import {
  MUSIC_TRACKS,
  SPEED_OPTIONS,
  VOICE_OPTIONS,
  VOLUME_LEVELS,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const VocabularyVideoVoiceScreen = () => {
  const router = useRouter();

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICE_OPTIONS[0].id);
  const [speed, setSpeed] = useState(SPEED_OPTIONS[1]);

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedTrackId, setSelectedTrackId] = useState(MUSIC_TRACKS[1].id);
  const [volume, setVolume] = useState(VOLUME_LEVELS[1]);

  const [sfxEnabled, setSfxEnabled] = useState(true);

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
            <Text style={styles.headerTitle}>Nhạc & giọng đọc</Text>
            <View style={styles.headerRightRow}>
              {/* Quay nhanh về MoreApp, thoát khỏi luồng tạo video */}
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => router.push('/setting/more-app')}
              >
                <Home size={18} color="#fff" />
              </TouchableOpacity>
              {/* Chưa có màn hình xem trước video riêng */}
              <TouchableOpacity style={styles.headerPreviewBtn} onPress={notImplemented}>
                <GalleryHorizontalEnd size={16} color="#fff" />
                <Text style={styles.headerPreviewBtnText}>Xem trước</Text>
              </TouchableOpacity>
            </View>
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
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
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
          <View style={styles.switchRow}>
            <View style={styles.sectionTitleLeft}>
              <Volume2 size={18} color="#0066cc" />
              <View style={styles.switchRowInfo}>
                <Text style={styles.switchRowLabel}>Giọng đọc từ vựng</Text>
                <Text style={styles.switchRowSubLabel}>Đọc to từng từ khi hiển thị</Text>
              </View>
            </View>
            <Switch value={voiceEnabled} onValueChange={setVoiceEnabled} />
          </View>

          {voiceEnabled && (
            <>
              <Text style={styles.fieldLabel}>Chọn giọng đọc</Text>
              {VOICE_OPTIONS.map((voice) => {
                const selected = selectedVoiceId === voice.id;
                return (
                  <TouchableOpacity
                    key={voice.id}
                    style={[styles.optionRow, selected && styles.optionRowSelected]}
                    onPress={() => setSelectedVoiceId(voice.id)}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionLabel} numberOfLines={1}>
                      {voice.label}
                    </Text>
                    <TouchableOpacity
                      style={styles.playBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        notImplemented();
                      }}
                    >
                      <Play size={14} color="#0066cc" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}

              <Text style={styles.fieldLabel}>Tốc độ đọc</Text>
              <View style={styles.chipsRow}>
                {SPEED_OPTIONS.map((option) => {
                  const selected = speed === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setSpeed(option)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <View style={styles.sectionTitleLeft}>
              <Music size={18} color="#0066cc" />
              <View style={styles.switchRowInfo}>
                <Text style={styles.switchRowLabel}>Nhạc nền</Text>
                <Text style={styles.switchRowSubLabel}>Phát nhạc xuyên suốt video</Text>
              </View>
            </View>
            <Switch value={musicEnabled} onValueChange={setMusicEnabled} />
          </View>

          {musicEnabled && (
            <>
              <Text style={styles.fieldLabel}>Chọn nhạc nền</Text>
              {MUSIC_TRACKS.map((track) => {
                const selected = selectedTrackId === track.id;
                return (
                  <TouchableOpacity
                    key={track.id}
                    style={[styles.optionRow, selected && styles.optionRowSelected]}
                    onPress={() => setSelectedTrackId(track.id)}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionLabel} numberOfLines={1}>
                      {track.label}
                    </Text>
                    {track.id !== 'none' && (
                      <TouchableOpacity
                        style={styles.playBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          notImplemented();
                        }}
                      >
                        <Play size={14} color="#0066cc" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}

              <Text style={styles.fieldLabel}>Âm lượng nhạc nền</Text>
              <View style={styles.chipsRow}>
                {VOLUME_LEVELS.map((option) => {
                  const selected = volume === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setVolume(option)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <View style={styles.sectionTitleLeft}>
              <Sparkles size={18} color="#0066cc" />
              <View style={styles.switchRowInfo}>
                <Text style={styles.switchRowLabel}>Hiệu ứng âm thanh</Text>
                <Text style={styles.switchRowSubLabel}>Phát hiệu ứng khi chuyển sang từ mới</Text>
              </View>
            </View>
            <Switch value={sfxEnabled} onValueChange={setSfxEnabled} />
          </View>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#0066cc" />
            <Text style={styles.bottomOutlineBtnText}>Quay lại</Text>
          </TouchableOpacity>
          {/* Lựa chọn ở bước này chưa truyền sang bước 4 (chưa có state/Context
          dùng chung giữa các bước). */}
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/vocabulary-video-complete')}
          >
            <Text style={styles.bottomPrimaryBtnText}>Tiếp tục</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VocabularyVideoVoiceScreen;
