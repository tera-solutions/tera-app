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
    paddingHorizontal: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── CLASS INFO CARD ─────────────────────────────────────────────────────────
  classCard: {
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
  classCardTop: {
    flexDirection: 'row',
    gap: 14,
  },
  classImageWrapper: {
    position: 'relative',
  },
  classImage: {
    width: 90,
    height: 85,
    borderRadius: 14,
    backgroundColor: '#EEF5FF',
  },
  classEditBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  classBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  classBadge: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  classStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  classStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  classStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  classMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classMetaText: {
    fontSize: 13,
    color: '#64748B',
  },

  // ─── STATS ROW ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // ─── QUICK ACTIONS ───────────────────────────────────────────────────────────
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
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
    paddingVertical: 14,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── ATTENDANCE CARD ─────────────────────────────────────────────────────────
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  attendanceChartWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceChartLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  attendanceChartValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  attendanceChartPct: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
  },
  attendanceLegend: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  attendanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 4,
  },

  // ─── TWO COLUMN ROW ──────────────────────────────────────────────────────────
  twoColRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  // ─── NEXT LESSON CARD ────────────────────────────────────────────────────────
  nextLessonDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  nextLessonDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  nextLessonBox: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  nextLessonInfo: {
    flex: 1,
  },
  nextLessonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  nextLessonSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  nextLessonImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  nextLessonLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // ─── PROGRESS CARD ───────────────────────────────────────────────────────────
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#0066CC',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCaption: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // ─── ANNOUNCEMENTS CARD ──────────────────────────────────────────────────────
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  announcementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
    marginTop: 6,
    flexShrink: 0,
  },
  announcementText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
});
