import { useMemo, useState } from 'react';
import { ScrollView, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  GalleryHorizontalEnd,
  ChevronLeft,
  Home,
  Layers,
  LayoutTemplate,
  Palette,
  Type as TypeIcon,
} from 'lucide-react-native';

import { topicById } from '@screens/VocabularyScreen/constants';

import {
  BACKGROUND_COLORS,
  FONT_STYLES,
  PREVIEW_SAMPLE,
  TEXT_POSITIONS,
  TextPosition,
  VIDEO_THEMES,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const isLightColor = (hex: string) => {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

const VocabularyVideoDesignScreen = () => {
  const router = useRouter();

  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(VIDEO_THEMES[0].id);
  const [selectedBgColor, setSelectedBgColor] = useState(VIDEO_THEMES[0].bg);
  const [selectedFontId, setSelectedFontId] = useState(FONT_STYLES[0].id);
  const [selectedPosition, setSelectedPosition] = useState<TextPosition>('below');

  const topic = topicById('animal');
  const TopicIcon = topic.icon;

  const fontOption = useMemo(
    () => FONT_STYLES.find((f) => f.id === selectedFontId) ?? FONT_STYLES[0],
    [selectedFontId],
  );

  const textColor = isLightColor(selectedBgColor) ? '#0F172A' : '#FFFFFF';

  const wordStyle: TextStyle = {
    fontWeight: fontOption.fontWeight,
    fontStyle: fontOption.fontStyle,
    letterSpacing: fontOption.letterSpacing,
  };

  const applyTheme = (themeId: string, bg: string) => {
    setSelectedThemeId(themeId);
    setSelectedBgColor(bg);
  };

  const applyColor = (color: string) => {
    setSelectedBgColor(color);
    setSelectedThemeId(null);
  };

  const imageBlock = (
    <View style={styles.previewImageWrapper}>
      <TopicIcon size={40} color={topic.color} />
    </View>
  );

  const textBlock = (
    <View style={styles.previewTextBlock}>
      <Text style={[styles.previewWord, wordStyle, { color: textColor }]}>
        {PREVIEW_SAMPLE.word}
      </Text>
      <Text style={[styles.previewPhonetic, { color: textColor }]}>{PREVIEW_SAMPLE.phonetic}</Text>
      <Text style={[styles.previewMeaning, { color: textColor }]}>{PREVIEW_SAMPLE.meaning}</Text>
    </View>
  );

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
            <Text style={styles.headerTitle}>Thiết kế video</Text>
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
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={[styles.stepDotText, styles.stepDotTextActive]}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]} numberOfLines={2}>
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
            <Layers size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Giao diện video</Text>
          </View>
          <Text style={styles.sectionHint}>Chọn phong cách tổng thể cho video</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themeRow}
          >
            {VIDEO_THEMES.map((theme) => {
              const selected = selectedThemeId === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[styles.themeCard, selected && styles.themeCardSelected]}
                  onPress={() => applyTheme(theme.id, theme.bg)}
                >
                  <View style={styles.themeSwatch}>
                    <View style={[styles.themeSwatchBg, { backgroundColor: theme.bg }]} />
                    <View style={[styles.themeSwatchAccent, { backgroundColor: theme.accent }]} />
                    {selected && (
                      <View style={styles.themeCheckBadge}>
                        <Check size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.themeLabel}>{theme.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Palette size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Màu nền</Text>
          </View>
          <Text style={styles.sectionHint}>Tuỳ chỉnh riêng màu nền nếu muốn</Text>

          <View style={styles.colorRow}>
            {BACKGROUND_COLORS.map((color) => {
              const selected = selectedBgColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorSwatch, selected && styles.colorSwatchSelected]}
                  onPress={() => applyColor(color)}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: color,
                      borderWidth: color === '#F8FAFC' ? 1 : 0,
                      borderColor: '#E2E8F0',
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <TypeIcon size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Kiểu chữ</Text>
          </View>
          <Text style={styles.sectionHint}>Áp dụng cho phần từ vựng hiển thị trong video</Text>

          <View style={styles.fontGrid}>
            {FONT_STYLES.map((font) => {
              const selected = selectedFontId === font.id;
              return (
                <TouchableOpacity
                  key={font.id}
                  style={[styles.fontCard, selected && styles.fontCardSelected]}
                  onPress={() => setSelectedFontId(font.id)}
                >
                  <Text
                    style={[
                      styles.fontSample,
                      {
                        fontWeight: font.fontWeight,
                        fontStyle: font.fontStyle,
                        letterSpacing: font.letterSpacing,
                      },
                    ]}
                  >
                    Aa
                  </Text>
                  <Text style={[styles.fontLabel, selected && styles.fontLabelSelected]}>
                    {font.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <LayoutTemplate size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Vị trí chữ</Text>
          </View>
          <Text style={styles.sectionHint}>Vị trí hiển thị từ vựng so với hình ảnh</Text>

          <View style={styles.positionRow}>
            {TEXT_POSITIONS.map((pos) => {
              const selected = selectedPosition === pos.id;
              return (
                <TouchableOpacity
                  key={pos.id}
                  style={[styles.positionChip, selected && styles.positionChipSelected]}
                  onPress={() => setSelectedPosition(pos.id)}
                >
                  <Text
                    style={[styles.positionChipText, selected && styles.positionChipTextSelected]}
                  >
                    {pos.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <GalleryHorizontalEnd size={18} color="#0066cc" />
            <Text style={styles.sectionTitle}>Xem trước</Text>
          </View>
          <Text style={styles.sectionHint}>Minh hoạ bằng từ mẫu "Cat" theo lựa chọn hiện tại</Text>

          <View style={[styles.previewCard, { backgroundColor: selectedBgColor }]}>
            {selectedPosition === 'overlay' ? (
              <View style={styles.previewOverlayWrapper}>
                {imageBlock}
                <View style={styles.previewOverlayTextBlock}>
                  <Text style={[styles.previewWord, wordStyle, { color: '#fff' }]}>
                    {PREVIEW_SAMPLE.word}
                  </Text>
                  <Text style={[styles.previewPhonetic, { color: '#fff' }]}>
                    {PREVIEW_SAMPLE.phonetic}
                  </Text>
                  <Text style={[styles.previewMeaning, { color: '#fff' }]}>
                    {PREVIEW_SAMPLE.meaning}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.previewColumn}>
                {selectedPosition === 'above' ? (
                  <>
                    {textBlock}
                    {imageBlock}
                  </>
                ) : (
                  <>
                    {imageBlock}
                    {textBlock}
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomOutlineBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#0066cc" />
            <Text style={styles.bottomOutlineBtnText}>Quay lại</Text>
          </TouchableOpacity>
          {/* Chưa có bước 4 "Hoàn thành" — lựa chọn ở bước này cũng chưa
          truyền sang bước 3 vì cùng lý do chưa có state/Context dùng chung. */}
          <TouchableOpacity
            style={styles.bottomPrimaryBtn}
            onPress={() => router.push('/edu/vocabulary-video-voice')}
          >
            <Text style={styles.bottomPrimaryBtnText}>Tiếp tục</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VocabularyVideoDesignScreen;
