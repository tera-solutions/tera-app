import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 600; // Kiểm tra thiết bị tối ưu hóa layout Master-Detail

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContentLayout: {
    flex: 1,
    flexDirection: isTablet ? 'row' : 'column',
    paddingHorizontal: 16,
    marginTop: 16,
  },

  // Left Column (Master Student List)
  leftColumn: {
    width: isTablet ? '35%' : '100%',
    paddingRight: isTablet ? 12 : 0,
    marginBottom: isTablet ? 0 : 16,
  },
  searchFilterContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 38,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInputText: {
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 6,
    flex: 1,
    padding: 0,
  },
  statusDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  statusModalContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 14,
    padding: 8,
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusOptionActive: {
    backgroundColor: '#EBF5FF',
  },
  statusOptionText: {
    fontSize: 13,
    color: '#334155',
  },
  statusOptionTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  studentScrollContainer: {
    maxHeight: isTablet ? '100%' : 300,
  },

  // Student Card Item
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  activeStudentCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },
  studentIndex: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    width: 22,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#CBD5E1',
  },
  avatarInitial: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  studentMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusSubmitBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2FBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusSubmitText: {
    fontSize: 10,
    color: '#27AE60',
    fontWeight: '600',
  },
  statusPendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusPendingText: {
    fontSize: 10,
    color: '#E67E22',
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 4,
  },
  showMoreStudentsBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  showMoreStudentsText: {
    fontSize: 12,
    color: '#64748B',
  },

  // Right Column (Detail Grading Form)
  rightColumn: {
    width: isTablet ? '65%' : '100%',
    paddingLeft: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageIconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  fileAttachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
  },
  fileMeta: {
    flex: 1,
    marginLeft: 10,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  fileSize: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  // Bài nộp của học viên
  submissionMetaText: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
  },
  answerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  answerText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },

  // Form Input Scores & Comments
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 6,
  },
  requiredStar: {
    color: '#E74C3C',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
  scoreInputField: {
    backgroundColor: '#F8FAFC',
    width: 140,
  },
  commentInputField: {
    backgroundColor: '#F8FAFC',
    height: 90,
  },
  commentLengthText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },

  // Quick Comment Tags
  quickCommentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  quickCommentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  quickCommentText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Global Components Header & Metrics & Tabs
  headerBg: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 35,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTopBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTopBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  cardClass: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 2,
  },
  cardDates: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  cardRight: { alignItems: 'flex-end' },
  progressCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  progressText: { fontSize: 10, fontWeight: '700', color: '#1E293B' },

  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 40) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricValue: { fontSize: 20, fontWeight: '700', marginTop: 6 },
  metricLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: { paddingBottom: 10, marginRight: 32 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  activeTabText: { color: '#007AFF', fontWeight: '700' },

  // Footer Actions
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  outlineBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  primaryBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },

  // Empty / loading / not-found states
  emptyStateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  notFoundText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  // Stats tab — self-drawn bar chart (no chart lib on mobile)
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statsCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  statsSummaryBox: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statsSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsSummaryLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statsBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsBarLabel: {
    width: 64,
    fontSize: 11,
    color: '#64748B',
  },
  statsBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  statsBarFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#38BDF8',
  },
  statsBarCount: {
    width: 24,
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'right',
  },
});
