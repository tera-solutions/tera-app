import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  List,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Search,
  Sun,
} from 'lucide-react-native';

import { CATEGORY_COLORS, CATEGORY_ICONS, PRODUCTS } from '@screens/HocLieuScreen/constants';

import { buildResources, buildToc, parsePageCount, VIEWER_TABS, VIEWER_TITLES, ViewerTab } from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const formatTime = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
};

interface Note {
  id: string;
  page: number;
  text: string;
  time: string;
}

const MOCK_LINE_WIDTHS = ['92%', '78%', '85%', '60%', '70%'] as const;

const HocLieuViewerScreen = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId), [productId]);
  const totalPages = useMemo(() => (product ? parsePageCount(product) : 1), [product]);
  const toc = useMemo(() => buildToc(totalPages), [totalPages]);
  const resources = useMemo(() => (product ? buildResources(product) : []), [product]);

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ViewerTab>('content');
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteDraft, setNoteDraft] = useState('');

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundWrapper}>
          <Text style={styles.notFoundText}>Không tìm thấy học liệu này</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#0066cc', fontWeight: '700' }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[product.category];
  const categoryColor = CATEGORY_COLORS[product.category];
  const progressPercent = Math.round((currentPage / totalPages) * 100);
  const isBookmarked = bookmarkedPages.has(currentPage);

  const goToPage = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  const toggleBookmark = () => {
    setBookmarkedPages((prev) => {
      const next = new Set(prev);
      if (next.has(currentPage)) {
        next.delete(currentPage);
      } else {
        next.add(currentPage);
      }
      return next;
    });
  };

  const handleSaveNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    setNotes((prev) => [
      { id: `n${Date.now()}`, page: currentPage, text, time: formatTime(new Date()) },
      ...prev,
    ]);
    setNoteDraft('');
    Toast.show({ type: 'success', text1: 'Đã lưu ghi chú' });
  };

  const metaParts = [
    product.publisher ? `NXB: ${product.publisher}` : null,
    product.manageAgeLabel,
    `${totalPages} trang`,
  ].filter(Boolean);

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
            <Text style={styles.headerTitle}>{VIEWER_TITLES[product.category]}</Text>
            <View style={styles.headerRightRow}>
              <TouchableOpacity style={styles.headerActionBtn} onPress={toggleBookmark}>
                <Bookmark
                  size={18}
                  color="#fff"
                  fill={isBookmarked ? '#fff' : 'transparent'}
                />
                <Text style={styles.headerActionBtnText}>Đánh dấu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionBtn} onPress={notImplemented}>
                <MoreHorizontal size={18} color="#fff" />
                <Text style={styles.headerActionBtnText}>Khác</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoImageWrapper, { backgroundColor: `${categoryColor}12` }]}>
            <CategoryIcon size={34} color={categoryColor} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.infoMetaText}>{metaParts.join(' • ')}</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                Trang {currentPage}/{totalPages}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {VIEWER_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <TabIcon size={16} color={active ? '#0066cc' : '#94A3B8'} />
                <Text style={[styles.tabItemText, active && styles.tabItemTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'content' && (
          <>
            <View style={styles.viewerToolbarRow}>
              <TouchableOpacity style={styles.viewerToolbarBtn} onPress={notImplemented}>
                <Expand size={16} color="#64748B" />
              </TouchableOpacity>
              <View style={styles.pageNavRow}>
                <TouchableOpacity
                  style={[styles.pageNavBtn, currentPage <= 1 && styles.pageNavBtnDisabled]}
                  onPress={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={15} color="#0066cc" />
                </TouchableOpacity>
                <Text style={styles.pageNavText}>
                  {currentPage} / {totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.pageNavBtn,
                    currentPage >= totalPages && styles.pageNavBtnDisabled,
                  ]}
                  onPress={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight size={15} color="#0066cc" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.viewerToolbarBtn} onPress={notImplemented}>
                <Search size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.pageViewerWrapper}>
              <View style={[styles.pageViewerCard, darkMode && styles.pageViewerCardDark]}>
                <CategoryIcon size={40} color={darkMode ? '#64748B' : categoryColor} />
                {MOCK_LINE_WIDTHS.map((width, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pageMockLine,
                      darkMode && styles.pageMockLineDark,
                      { width },
                    ]}
                  />
                ))}
                <View style={styles.pageNumberBadge}>
                  <Text style={styles.pageNumberBadgeText}>{currentPage}</Text>
                </View>
              </View>
              {currentPage > 1 && (
                <TouchableOpacity
                  style={[styles.pageArrowBtn, styles.pageArrowBtnLeft]}
                  onPress={() => goToPage(currentPage - 1)}
                >
                  <ChevronLeft size={18} color="#0066cc" />
                </TouchableOpacity>
              )}
              {currentPage < totalPages && (
                <TouchableOpacity
                  style={[styles.pageArrowBtn, styles.pageArrowBtnRight]}
                  onPress={() => goToPage(currentPage + 1)}
                >
                  <ChevronRight size={18} color="#0066cc" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbStrip}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const active = page === currentPage;
                return (
                  <TouchableOpacity
                    key={page}
                    style={styles.thumbItem}
                    onPress={() => goToPage(page)}
                  >
                    <View style={[styles.thumbBox, active && styles.thumbBoxActive]}>
                      <CategoryIcon size={16} color={active ? categoryColor : '#CBD5E1'} />
                    </View>
                    <Text style={[styles.thumbNumber, active && styles.thumbNumberActive]}>
                      {page}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {activeTab === 'toc' && (
          <View style={styles.panelWrapper}>
            {toc.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.tocRow}
                onPress={() => {
                  goToPage(entry.startPage);
                  setActiveTab('content');
                }}
              >
                <Text style={styles.tocRowTitle}>{entry.title}</Text>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'notes' && (
          <View style={styles.panelWrapper}>
            <View style={styles.noteAddCard}>
              <Text style={styles.noteAddLabel}>Ghi chú cho trang {currentPage}</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Nhập ghi chú..."
                placeholderTextColor="#a7a7a7"
                value={noteDraft}
                onChangeText={setNoteDraft}
                multiline
              />
              <TouchableOpacity style={styles.noteSaveBtn} onPress={handleSaveNote}>
                <Text style={styles.noteSaveBtnText}>Lưu ghi chú</Text>
              </TouchableOpacity>
            </View>

            {notes.length === 0 ? (
              <View style={styles.emptyWrapper}>
                <NotebookPen size={28} color="#CBD5E1" />
                <Text style={styles.emptyText}>Chưa có ghi chú nào</Text>
              </View>
            ) : (
              notes.map((note) => (
                <View key={note.id} style={styles.noteCard}>
                  <View style={styles.noteCardHeaderRow}>
                    <Text style={styles.notePageTag}>Trang {note.page}</Text>
                    <Text style={styles.noteTime}>{note.time}</Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'resources' && (
          <View style={styles.panelWrapper}>
            {resources.map((resource) => {
              const ResourceIcon = resource.icon;
              return (
                <View key={resource.id} style={styles.resourceRow}>
                  <View style={styles.resourceIconWrapper}>
                    <ResourceIcon size={18} color="#0066cc" />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceMeta}>{resource.meta}</Text>
                  </View>
                  <TouchableOpacity style={styles.resourceDownloadBtn} onPress={notImplemented}>
                    <Download size={16} color="#0066cc" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomToolbar}>
        <TouchableOpacity style={styles.bottomToolbarBtn} onPress={() => setActiveTab('toc')}>
          <List size={20} color="#64748B" />
          <Text style={styles.bottomToolbarText}>Mục lục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomToolbarBtn} onPress={() => setActiveTab('notes')}>
          <NotebookPen size={20} color="#64748B" />
          <Text style={styles.bottomToolbarText}>Thêm ghi chú</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomToolbarBtn}
          onPress={() => setActiveTab('notes')}
        >
          <View style={styles.bottomToolbarCenterBtn}>
            <NotebookPen size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomToolbarBtn} onPress={notImplemented}>
          <Download size={20} color="#64748B" />
          <Text style={styles.bottomToolbarText}>Tải xuống</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomToolbarBtn}
          onPress={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? (
            <Sun size={20} color="#64748B" />
          ) : (
            <Moon size={20} color="#64748B" />
          )}
          <Text style={styles.bottomToolbarText}>Chế độ tối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HocLieuViewerScreen;
