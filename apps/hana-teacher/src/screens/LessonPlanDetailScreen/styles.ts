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
  headerRightPlaceholder: {
    width: 36,
  },

  // ─── PLAN HEADER CARD ────────────────────────────────────────────────────────
  planCard: {
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
  planCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  planIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  planBody: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flexShrink: 1,
  },
  planStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  planMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  planDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 17,
  },

  // ─── CLASSROOM CHIPS ─────────────────────────────────────────────────────────
  classroomSection: {
    marginTop: 12,
  },
  classroomChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  classroomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  classroomChipActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  classroomChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  classroomChipTextActive: {
    color: '#FFFFFF',
  },

  // ─── SECTION CARD (shared) ───────────────────────────────────────────────────
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  // ─── TEMPLATE / LESSON ROW (shared layout) ──────────────────────────────────
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rowNoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rowNoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  rowSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  rowRightText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  rowMenuBtn: {
    padding: 4,
  },

  // ─── STATUS TABS ─────────────────────────────────────────────────────────────
  tabsWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabsScroll: {
    gap: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginRight: 6,
  },
  tabActive: {
    backgroundColor: '#0066CC',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // ─── SEARCH ──────────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    padding: 0,
  },

  // ─── STATUS BADGE (lesson row) ───────────────────────────────────────────────
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ─── PROGRESS CARD ───────────────────────────────────────────────────────────
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressChartWrapper: {
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressChartLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressChartPct: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressLegend: {
    flex: 1,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },

  // ─── EMPTY / ERROR STATE ─────────────────────────────────────────────────────
  emptyWrapper: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066CC',
  },

  // ─── CANCEL LESSON MODAL ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 19,
  },
  modalTextarea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
  },
  modalBtnDanger: {
    backgroundColor: '#EF4444',
  },
});
