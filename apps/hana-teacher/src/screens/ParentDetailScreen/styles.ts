import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ─── SCREEN ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── PROFILE CARD ────────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF5FF',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  studentTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  studentTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  achievementCard: {
    backgroundColor: '#FFF9EB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 15,
  },
  achievementLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  achievementLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── QUICK ACTIONS ───────────────────────────────────────────────────────────
  quickActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
    gap: 0,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },

  // ─── DETAIL TABS ─────────────────────────────────────────────────────────────
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0066CC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#0066CC',
    fontWeight: '700',
  },

  // ─── SECTION CARD ────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── CHILD SECTION ───────────────────────────────────────────────────────────
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#EEF5FF',
  },
  childInfo: {
    flex: 1,
  },
  childNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  childName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  childClassTag: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  childClassTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  childMeta: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  childDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  childDetailBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  // ─── LEARNING OVERVIEW ───────────────────────────────────────────────────────
  learningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  learningStat: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  learningStatValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  learningStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },

  // ─── LEARNING PROGRESS ───────────────────────────────────────────────────────
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F7FB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chartContainer: {
    height: 140,
    flexDirection: 'row',
    gap: 8,
  },
  chartYAxis: {
    width: 36,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  chartYLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  chartBody: {
    flex: 1,
  },

  // ─── RECENT COMMUNICATION ────────────────────────────────────────────────────
  commItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  commIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  commBody: {
    flex: 1,
  },
  commTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  commDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  commRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  commDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  commTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
