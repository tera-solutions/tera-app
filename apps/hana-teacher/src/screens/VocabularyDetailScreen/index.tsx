import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  Clock3,
  Copy,
  Folder,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  MoreVertical,
  Pencil,
  Star,
  Tag,
  Trash2,
  Type,
  Video as VideoIcon,
  Volume2,
} from 'lucide-react-native';

import {
  LEVEL_LABELS,
  topicById,
  VOCAB_ITEMS,
  VocabItem,
} from '@screens/VocabularyScreen/constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mi}`;
};

const renderHighlighted = (
  text: string,
  word: string,
  highlightStyle: TextStyle,
  baseStyle: TextStyle,
) => {
  const index = text.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return <Text style={baseStyle}>{text}</Text>;
  const before = text.slice(0, index);
  const match = text.slice(index, index + word.length);
  const after = text.slice(index + word.length);
  return (
    <Text style={baseStyle}>
      {before}
      <Text style={highlightStyle}>{match}</Text>
      {after}
    </Text>
  );
};

const VocabularyDetailScreen = () => {
  const router = useRouter();
  const { vocabId } = useLocalSearchParams<{ vocabId?: string }>();

  const product = useMemo(() => VOCAB_ITEMS.find((v) => v.id === vocabId), [vocabId]);

  const [favorite, setFavorite] = useState(product?.favorite ?? false);
  const [favoriteExamples, setFavoriteExamples] = useState<Set<number>>(new Set());

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundWrapper}>
          <Text style={styles.notFoundText}>Không tìm thấy từ vựng này</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#0066cc', fontWeight: '700' }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const item: VocabItem = product;
  const topic = topicById(item.topicId);
  const TopicIcon = topic.icon;

  const toggleFavoriteExample = (index: number) => {
    setFavoriteExamples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const openMoreMenu = () => {
    Alert.alert(item.word, undefined, [
      { text: 'Chỉnh sửa', onPress: notImplemented },
      { text: 'Xoá từ vựng', style: 'destructive', onPress: confirmDelete },
      { text: 'Đóng', style: 'cancel' },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert('Xoá từ vựng?', `Bạn có chắc muốn xoá "${item.word}"?`, [
      { text: 'Không', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: notImplemented },
    ]);
  };

  const playAudio = () => {
    if (!item.hasAudio) {
      Toast.show({ type: 'info', text1: 'Từ này chưa có phát âm' });
      return;
    }
    notImplemented();
  };

  const openVideo = () => {
    if (!item.hasVideo) {
      Toast.show({ type: 'info', text1: 'Từ này chưa có video' });
      return;
    }
    notImplemented();
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
            <Text style={styles.headerTitle}>Chi tiết từ vựng</Text>
            <TouchableOpacity style={styles.headerIconBtn} onPress={openMoreMenu}>
              <MoreVertical size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoImageWrapper, { backgroundColor: `${topic.color}12` }]}>
            <TopicIcon size={48} color={topic.color} />
            <TouchableOpacity style={styles.infoImageSpeakerBtn} onPress={playAudio}>
              <Volume2 size={15} color="#0066cc" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCol}>
            <View style={styles.wordRow}>
              <Text style={styles.wordText}>{item.word}</Text>
              <TouchableOpacity onPress={playAudio}>
                <Volume2 size={18} color="#0066cc" />
              </TouchableOpacity>
              <View style={styles.wordBadgesCol}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{item.level}</Text>
                </View>
                <TouchableOpacity onPress={() => setFavorite((prev) => !prev)}>
                  <Star
                    size={20}
                    color={favorite ? '#F59E0B' : '#CBD5E1'}
                    fill={favorite ? '#F59E0B' : 'transparent'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.phoneticText}>{item.phonetic}</Text>
            <Text style={styles.meaningText}>{item.meaning}</Text>

            <View style={[styles.topicTag, { backgroundColor: `${topic.color}15` }]}>
              <TopicIcon size={12} color={topic.color} />
              <Text style={[styles.topicTagText, { color: topic.color }]}>{topic.label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.exampleIconWrapper}>
            <Lightbulb size={18} color="#F59E0B" />
          </View>
          <View style={styles.exampleCol}>
            <Text style={styles.exampleLabel}>Ví dụ:</Text>
            {renderHighlighted(item.example, item.word, styles.exampleHighlight, styles.exampleText)}
            {!!item.exampleTranslation && (
              <Text style={styles.exampleTranslation}>{item.exampleTranslation}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.exampleSpeakerBtn} onPress={playAudio}>
            <Volume2 size={16} color="#0066cc" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={openVideo}>
            <VideoIcon size={20} color="#0066cc" />
            <Text style={[styles.actionBtnText, { color: '#0066cc' }]}>Xem video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={playAudio}>
            <Volume2 size={20} color="#16A34A" />
            <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Phát âm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={notImplemented}>
            <ImageIcon size={20} color="#8B5CF6" />
            <Text style={[styles.actionBtnText, { color: '#8B5CF6' }]}>Hình ảnh</Text>
          </TouchableOpacity>
          {/* Chưa có trò chơi luyện từ vựng thật */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDisabled]}
            onPress={notImplemented}
          >
            <Gamepad2 size={20} color="#94A3B8" />
            <Text style={[styles.actionBtnText, { color: '#94A3B8' }]}>Trò chơi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoRowIconWrapper}>
              <Folder size={16} color="#0066cc" />
            </View>
            <Text style={styles.infoRowLabel}>Chủ đề</Text>
            <View style={styles.infoRowValueRow}>
              <Text style={styles.infoRowValue}>{topic.label}</Text>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowIconWrapper}>
              <Layers size={16} color="#0066cc" />
            </View>
            <Text style={styles.infoRowLabel}>Cấp độ</Text>
            <View style={styles.infoRowValueRow}>
              <Text style={styles.infoRowValue}>{LEVEL_LABELS[item.level]}</Text>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
          </View>

          {!!item.wordType && (
            <View style={styles.infoRow}>
              <View style={styles.infoRowIconWrapper}>
                <Tag size={16} color="#0066cc" />
              </View>
              <Text style={styles.infoRowLabel}>Loại từ</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>
                  {item.wordType}
                </Text>
                <ChevronRight size={14} color="#94A3B8" />
              </View>
            </View>
          )}

          {!!item.plural && (
            <View style={styles.infoRow}>
              <View style={styles.infoRowIconWrapper}>
                <Type size={16} color="#0066cc" />
              </View>
              <Text style={styles.infoRowLabel}>Số nhiều</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>{item.plural}</Text>
                <ChevronRight size={14} color="#94A3B8" />
              </View>
            </View>
          )}

          {!!item.phoneticUk && (
            <View style={styles.infoRow}>
              <Text style={{ fontSize: 16 }}>🇬🇧</Text>
              <Text style={styles.infoRowLabel}>Phiên âm (UK)</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>
                  {item.phoneticUk}
                </Text>
                <TouchableOpacity onPress={playAudio}>
                  <Volume2 size={15} color="#0066cc" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!!item.phoneticUs && (
            <View style={styles.infoRow}>
              <Text style={{ fontSize: 16 }}>🇺🇸</Text>
              <Text style={styles.infoRowLabel}>Phiên âm (US)</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>
                  {item.phoneticUs}
                </Text>
                <TouchableOpacity onPress={playAudio}>
                  <Volume2 size={15} color="#0066cc" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!!item.createdAt && (
            <View style={styles.infoRow}>
              <View style={styles.infoRowIconWrapper}>
                <Calendar size={16} color="#0066cc" />
              </View>
              <Text style={styles.infoRowLabel}>Ngày tạo</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>
                  {formatDate(item.createdAt)}
                </Text>
                <ChevronRight size={14} color="#94A3B8" />
              </View>
            </View>
          )}

          {!!item.updatedAt && (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={styles.infoRowIconWrapper}>
                <Clock3 size={16} color="#0066cc" />
              </View>
              <Text style={styles.infoRowLabel}>Cập nhật lần cuối</Text>
              <View style={styles.infoRowValueRow}>
                <Text style={[styles.infoRowValue, styles.infoRowValueMuted]}>
                  {formatDate(item.updatedAt)}
                </Text>
                <ChevronRight size={14} color="#94A3B8" />
              </View>
            </View>
          )}
        </View>

        {!!item.extraExamples?.length && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ví dụ khác</Text>
            {item.extraExamples.map((extra, index) => (
              <View key={index} style={styles.extraExampleRow}>
                <TouchableOpacity style={styles.extraExampleSpeakerBtn} onPress={playAudio}>
                  <Volume2 size={14} color="#0066cc" />
                </TouchableOpacity>
                <View style={styles.extraExampleCol}>
                  {renderHighlighted(
                    extra.text,
                    item.word,
                    styles.exampleHighlight,
                    styles.extraExampleText,
                  )}
                  <Text style={styles.extraExampleTranslation}>{extra.translation}</Text>
                </View>
                <View style={styles.extraExampleActionsCol}>
                  <TouchableOpacity onPress={() => toggleFavoriteExample(index)}>
                    <Star
                      size={16}
                      color={favoriteExamples.has(index) ? '#F59E0B' : '#CBD5E1'}
                      fill={favoriteExamples.has(index) ? '#F59E0B' : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={notImplemented}>
                    <MoreVertical size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOutlineBtn} onPress={notImplemented}>
          <Pencil size={15} color="#0066cc" />
          <Text style={styles.bottomOutlineBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOutlineBtn} onPress={notImplemented}>
          <Copy size={15} color="#0066cc" />
          <Text style={styles.bottomOutlineBtnText}>Sao chép</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={confirmDelete}>
          <Trash2 size={15} color="#fff" />
          <Text style={styles.bottomPrimaryBtnText}>Xoá từ vựng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VocabularyDetailScreen;
