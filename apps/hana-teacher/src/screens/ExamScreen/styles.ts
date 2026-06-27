import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ─── SCREEN ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  createBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeftPlaceholder: {
    width: 36,
  },

  // ─── STATS ROW ───────────────────────────────────────────────────────────────
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },

  // ─── GRADING BANNER ──────────────────────────────────────────────────────────
  gradingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  gradingBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  gradingBannerHighlight: {
    fontWeight: '700',
    color: '#0066CC',
  },
  gradingBannerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gradingBannerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066CC',
  },

  // ─── FILTER TABS ─────────────────────────────────────────────────────────────
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  filterScroll: {
    flex: 1,
    paddingLeft: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: '#0066CC',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  filterTabTextActive: {
    color: '#0066CC',
    fontWeight: '700',
  },
  filterSearchBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 4,
  },

  // ─── EXAM ITEM ───────────────────────────────────────────────────────────────
  examItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  examItemTop: {
    flexDirection: 'row',
    gap: 12,
  },
  examIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  examBody: {
    flex: 1,
  },
  examTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  examTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    lineHeight: 20,
  },
  examStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gradingCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradingCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  examMenuBtn: {
    padding: 4,
  },
  examClassName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 6,
  },
  examMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  examMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  examItemBottom: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  detailBtn: {
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── RESULTS REPORT ──────────────────────────────────────────────────────────
  reportSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
  },
  reportLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reportChartWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  reportChartLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  reportChartPct: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  reportChartCaption: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  gradeList: {
    flex: 1,
    gap: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeLabel: {
    fontSize: 12,
    color: '#475569',
    width: 72,
  },
  gradeBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gradeBarFill: {
    height: 6,
    borderRadius: 3,
  },
  gradeCount: {
    fontSize: 12,
    color: '#64748B',
    width: 46,
    textAlign: 'right',
  },
});
