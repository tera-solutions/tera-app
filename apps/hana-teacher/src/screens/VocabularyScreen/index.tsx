import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  BookOpen,
  ChevronLeft,
  Filter,
  Folder,
  Grid3x3,
  List,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Star,
  Video as VideoIcon,
  Volume2,
} from 'lucide-react-native';

import {
  FILTER_TABS,
  PRONOUNCED_COUNT,
  SORT_LABELS,
  SORT_ORDER,
  SortOption,
  TOPICS,
  TOTAL_VOCAB_COUNT,
  topicById,
  VIDEO_COUNT,
  VOCAB_ITEMS,
  VocabFilterTab,
  VocabItem,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const renderExample = (example: string, word: string) => {
  const index = example.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return <Text style={styles.vocabExample}>Example: {example}</Text>;
  const before = example.slice(0, index);
  const match = example.slice(index, index + word.length);
  const after = example.slice(index + word.length);
  return (
    <Text style={styles.vocabExample}>
      Example: {before}
      <Text style={styles.vocabExampleHighlight}>{match}</Text>
      {after}
    </Text>
  );
};

const VocabularyScreen = () => {
  const router = useRouter();

  const [items, setItems] = useState<VocabItem[]>(VOCAB_ITEMS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<VocabFilterTab>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const keyword = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (activeTab === 'unlearned' && item.learned) return false;
      if (activeTab === 'learned' && !item.learned) return false;
      if (activeTab === 'favorite' && !item.favorite) return false;
      if (!keyword) return true;
      return (
        item.word.toLowerCase().includes(keyword) ||
        item.meaning.toLowerCase().includes(keyword) ||
        item.example.toLowerCase().includes(keyword)
      );
    });
    if (sortOption === 'az') return [...filtered].sort((a, b) => a.word.localeCompare(b.word));
    if (sortOption === 'za') return [...filtered].sort((a, b) => b.word.localeCompare(a.word));
    return filtered;
  }, [items, activeTab, keyword, sortOption]);

  const goToDetail = (id: string) => router.push(`/edu/vocabulary-detail?vocabId=${id}`);

  const toggleSort = () => {
    const nextIndex = (SORT_ORDER.indexOf(sortOption) + 1) % SORT_ORDER.length;
    setSortOption(SORT_ORDER[nextIndex]);
  };

  const toggleFavorite = (item: VocabItem) => {
    setItems((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, favorite: !v.favorite } : v)),
    );
  };

  const toggleLearned = (item: VocabItem) => {
    setItems((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, learned: !v.learned } : v)),
    );
    Toast.show({
      type: 'success',
      text1: item.learned ? `Đã chuyển "${item.word}" sang Chưa học` : `Đã học "${item.word}"`,
    });
  };

  const openActions = (item: VocabItem) => {
    Alert.alert(item.word, undefined, [
      { text: item.learned ? 'Đánh dấu Chưa học' : 'Đánh dấu Đã học', onPress: () => toggleLearned(item) },
      { text: 'Xoá từ vựng', style: 'destructive', onPress: notImplemented },
      { text: 'Đóng', style: 'cancel' },
    ]);
  };

  const playAudio = (item: VocabItem) => {
    if (!item.hasAudio) {
      Toast.show({ type: 'info', text1: 'Từ này chưa có phát âm' });
      return;
    }
    notImplemented();
  };

  const openVideo = (item: VocabItem) => {
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
            <Text style={styles.headerTitle}>Danh sách từ vựng</Text>
            {/* Chưa có màn hình thêm từ vựng mới riêng */}
            <TouchableOpacity style={styles.headerAddBtn} onPress={notImplemented}>
              <Plus size={16} color="#fff" />
              <Text style={styles.headerAddBtnText}>Thêm từ vựng</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm từ vựng, chủ đề, ví dụ..."
                placeholderTextColor="#a7a7a7"
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {/* Chưa có màn hình bộ lọc nâng cao riêng */}
            <TouchableOpacity style={styles.filterBtn} onPress={notImplemented}>
              <Filter size={15} color="#0066cc" />
              <Text style={styles.filterBtnText}>Bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#2563EB' }]}>
              <BookOpen size={18} color="#fff" />
            </View>
            <Text style={styles.statValue}>{TOTAL_VOCAB_COUNT}</Text>
            <Text style={styles.statLabel}>Tổng từ vựng</Text>
          </View>
          <View style={[styles.statItem, styles.statItemDivider]}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#16A34A' }]}>
              <Folder size={18} color="#fff" />
            </View>
            <Text style={styles.statValue}>{TOPICS.length}</Text>
            <Text style={styles.statLabel}>Chủ đề</Text>
          </View>
          <View style={[styles.statItem, styles.statItemDivider]}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#F59E0B' }]}>
              <Volume2 size={18} color="#fff" />
            </View>
            <Text style={styles.statValue}>{PRONOUNCED_COUNT}</Text>
            <Text style={styles.statLabel}>Đã có phát âm</Text>
          </View>
          <View style={[styles.statItem, styles.statItemDivider]}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#7C3AED' }]}>
              <VideoIcon size={18} color="#fff" />
            </View>
            <Text style={styles.statValue}>{VIDEO_COUNT}</Text>
            <Text style={styles.statLabel}>Đã có video</Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {FILTER_TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabItemText, active && styles.tabItemTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sortViewRow}>
          <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
            <Text style={styles.sortLabel}>Sắp xếp: </Text>
            <Text style={styles.sortValue}>{SORT_LABELS[sortOption]}</Text>
          </TouchableOpacity>
          <View style={styles.viewToggleRow}>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <List size={16} color={viewMode === 'list' ? '#0066cc' : '#94A3B8'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'grid' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3x3 size={16} color={viewMode === 'grid' ? '#0066cc' : '#94A3B8'} />
            </TouchableOpacity>
          </View>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không tìm thấy từ vựng phù hợp</Text>
          </View>
        ) : viewMode === 'list' ? (
          <View style={styles.listWrapper}>
            {filteredItems.map((item) => {
              const topic = topicById(item.topicId);
              const TopicIcon = topic.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.vocabCard}
                  activeOpacity={0.85}
                  onPress={() => goToDetail(item.id)}
                >
                  <View style={[styles.vocabImageWrapper, { backgroundColor: `${topic.color}12` }]}>
                    <TopicIcon size={34} color={topic.color} />
                  </View>
                  <View style={styles.vocabInfo}>
                    <View style={styles.vocabTopRow}>
                      <Text style={styles.vocabWord}>{item.word}</Text>
                      <TouchableOpacity
                        style={styles.vocabSpeakerBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          playAudio(item);
                        }}
                      >
                        <Volume2 size={16} color="#0066cc" />
                      </TouchableOpacity>
                      <View style={styles.vocabBadgesCol}>
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelBadgeText}>{item.level}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                      >
                        <Star
                          size={18}
                          color={item.favorite ? '#F59E0B' : '#CBD5E1'}
                          fill={item.favorite ? '#F59E0B' : 'transparent'}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.vocabPhonetic}>{item.phonetic}</Text>
                    <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                    {renderExample(item.example, item.word)}

                    <View style={[styles.topicTag, { backgroundColor: `${topic.color}15` }]}>
                      <Text style={[styles.topicTagText, { color: topic.color }]}>
                        {topic.label}
                      </Text>
                    </View>

                    <View style={styles.vocabActionsRow}>
                      <TouchableOpacity
                        style={styles.vocabActionBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          openVideo(item);
                        }}
                      >
                        <VideoIcon size={14} color="#0066cc" />
                        <Text style={[styles.vocabActionBtnText, { color: '#0066cc' }]}>
                          Video
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.vocabActionBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          notImplemented();
                        }}
                      >
                        <Pencil size={14} color="#16A34A" />
                        <Text style={[styles.vocabActionBtnText, { color: '#16A34A' }]}>Sửa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.vocabMoreBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          openActions(item);
                        }}
                      >
                        <MoreVertical size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.gridWrapper}>
            {filteredItems.map((item) => {
              const topic = topicById(item.topicId);
              const TopicIcon = topic.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridCard}
                  activeOpacity={0.85}
                  onPress={() => goToDetail(item.id)}
                >
                  <View style={[styles.gridImageWrapper, { backgroundColor: `${topic.color}12` }]}>
                    <TopicIcon size={30} color={topic.color} />
                    <View style={styles.gridLevelBadge}>
                      <Text style={styles.gridLevelBadgeText}>{item.level}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.gridStarBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                    >
                      <Star
                        size={16}
                        color={item.favorite ? '#F59E0B' : '#fff'}
                        fill={item.favorite ? '#F59E0B' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.gridInfo}>
                    <Text style={styles.gridWord} numberOfLines={1}>
                      {item.word}
                    </Text>
                    <Text style={styles.gridMeaning} numberOfLines={1}>
                      {item.meaning}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {filteredItems.length > 0 && (
          <Text style={styles.paginationText}>
            Hiển thị 1 – {filteredItems.length} trong tổng số {TOTAL_VOCAB_COUNT} từ vựng
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddBtn} onPress={notImplemented}>
        <Plus size={16} color="#fff" />
        <Text style={styles.floatingAddBtnText}>Thêm từ vựng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VocabularyScreen;
