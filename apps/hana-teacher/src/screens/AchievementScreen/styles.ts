import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const SUMMARY_CARD_WIDTH = (width - 72) / 4;
const ACHIEVEMENT_CARD_WIDTH = (width - 52) / 2.2;
const CERTIFICATE_WIDTH = width * 0.42;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },

  contentContainer: {
    paddingBottom: 120,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 28,
    backgroundColor: '#0066cc',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginHorizontal: 16,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4D4F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // =========================
  // OVERVIEW
  // =========================

  overviewCard: {
    marginHorizontal: 16,
    marginTop: -16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a8cff',
    marginBottom: 16,
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },

  summaryCard: {
    width: SUMMARY_CARD_WIDTH,
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    borderRadius: 10,
    paddingVertical: 8
  },

  summaryIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
  },

  overviewNotice: {
    marginTop: 16,
    backgroundColor: '#F1F7FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  overviewNoticeText: {
    flex: 1,
    marginLeft: 10,
    color: '#475569',
    fontSize: 13,
  },

  overviewNoticeLink: {
    color: '#0066cc',
    fontWeight: '600',
  },

  // =========================
  // TAB
  // =========================

  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#FFF',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },

  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },

  tabTextActive: {
    color: '#0066cc',
    fontWeight: '700',
  },

  // =========================
  // SEARCH
  // =========================

  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },

  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
  },

  filterButton: {
    width: 100,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterText: {
    marginLeft: 6,
    color: '#0066cc',
    fontWeight: '600',
  },

  // =========================
  // SECTION
  // =========================

  sectionContainer: {
    marginTop: 24,
  },

  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  sectionAction: {
    color: '#0066cc',
    fontWeight: '600',
  },

  // =========================
  // ACHIEVEMENT CATEGORY
  // =========================

  achievementList: {
    paddingHorizontal: 16,
  },

  achievementCard: {
    width: ACHIEVEMENT_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },

  achievementBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },

  achievementStudents: {
    marginTop: 6,
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '600',
  },

  // =========================
  // STUDENT RANKING
  // =========================

  rankingContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
  },

  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  rankingDivider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginLeft: 72,
  },

  rankingNumber: {
    width: 36,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  rankingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },

  rankingContent: {
    flex: 1,
  },

  rankingName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  rankingClass: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '600',
    marginTop: 2,
  },

  rankingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  rankingTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },

  rankingTagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  rankingScoreContainer: {
    alignItems: 'center',
    minWidth: 60,
  },

  rankingScore: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
  },

  rankingScoreLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // =========================
  // CERTIFICATE
  // =========================

  certificateList: {
    paddingHorizontal: 16,
  },

  certificateCard: {
    width: CERTIFICATE_WIDTH,
    marginRight: 12,
  },

  certificateImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#FFF',
  },

  certificateTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },

  certificateStudent: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },

  // =========================
  // COMMON
  // =========================

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },

  bottomSpacing: {
    height: 40,
  },
});
