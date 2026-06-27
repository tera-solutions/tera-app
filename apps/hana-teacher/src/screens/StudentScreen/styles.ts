import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ─── SCREEN ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    paddingBottom: 120,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.15,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  // ─── CLASS INFO CARD ─────────────────────────────────────────────────────────
  classCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  classCardImage: {
    width: 76,
    height: 66,
  },
  classCardBody: {
    flex: 1,
  },
  classCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
  },
  classCardMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  classCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  classCardLocationText: {
    fontSize: 12,
    color: '#60A5FA',
  },
  classCardSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  classCardSwitchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── STATS ROW ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  statSublabel: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 1,
  },

  // ─── STUDENT TABS ────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EFF8',
  },
  tabItem: {
    paddingBottom: 10,
    marginRight: 20,
  },
  tabItemActive: {
    borderBottomWidth: 2,
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
  tabSortBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabSortText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── SEARCH BAR ──────────────────────────────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },

  // ─── STUDENT ITEM ────────────────────────────────────────────────────────────
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentIndex: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
    width: 22,
    textAlign: 'center',
  },
  studentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF5FF',
  },
  studentBody: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  studentMetaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  studentRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  studentRatingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  studentTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  studentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  studentAttendance: {
    fontSize: 11,
    color: '#64748B',
  },

  // ─── QUICK ATTENDANCE BANNER ─────────────────────────────────────────────────
  attendanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  attendanceBannerBody: {
    flex: 1,
  },
  attendanceBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
  },
  attendanceBannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  attendanceBannerIllustration: {
    width: 110,
    height: 72,
  },
  attendanceBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0066CC',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  attendanceBannerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
