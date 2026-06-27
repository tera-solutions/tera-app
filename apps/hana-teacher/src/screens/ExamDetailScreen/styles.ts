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
    gap: 8,
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.15,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ─── EXAM INFO CARD ──────────────────────────────────────────────────────────
  infoCard: {
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
  infoCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  examIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoCardBody: {
    flex: 1,
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 2,
  },
  examClassName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gradingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#0066CC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 4,
  },
  gradingBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },
  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  metaLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
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
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0066CC',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#0066CC',
    fontWeight: '700',
  },

  // ─── EXAM STATS ROW ──────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 14,
    gap: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  // ─── PROGRESS SECTION ────────────────────────────────────────────────────────
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
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
  },
  progressCaption: {
    fontSize: 12,
    color: '#64748B',
  },
  progressUpdated: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // ─── DESCRIPTION SECTION ─────────────────────────────────────────────────────
  descCard: {
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
  descTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  // ─── QUESTION BANK ───────────────────────────────────────────────────────────
  qbCard: {
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
  qbTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  qbRow: {
    flexDirection: 'row',
  },
  qbItem: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-start',
  },
  qbItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 12,
  },
  qbLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  qbValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0066CC',
  },
  qbUnit: {
    fontSize: 12,
    color: '#64748B',
  },

  // ─── RECENT SUBMISSIONS ──────────────────────────────────────────────────────
  submissionsCard: {
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
  submissionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  submissionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  submissionsLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },
  submissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF5FF',
  },
  submissionInfo: {
    flex: 1,
  },
  submissionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  submissionTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  submissionScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E',
  },
  scoreMax: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // ─── ACTION BAR ──────────────────────────────────────────────────────────────
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
});
