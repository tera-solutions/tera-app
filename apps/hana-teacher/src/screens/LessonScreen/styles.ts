import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────────
  headerBg: {
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRightRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // ─── LESSON HEADER CARD ──────────────────────────────────────────────────
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoCardTop: {
    flexDirection: 'row',
  },
  lessonImageBg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonMeta: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  unitTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    flexShrink: 1,
  },

  // ─── STATS ROW ───────────────────────────────────────────────────────────
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },

  // ─── TABS ────────────────────────────────────────────────────────────────
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },

  // ─── SECTION ─────────────────────────────────────────────────────────────
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    paddingVertical: 8,
  },

  // ─── OBJECTIVES ──────────────────────────────────────────────────────────
  objectiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 13,
    color: '#334155',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // ─── MATERIALS ───────────────────────────────────────────────────────────
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  materialIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialBody: {
    flex: 1,
  },
  materialName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  materialMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  // ─── ACTIVITIES ──────────────────────────────────────────────────────────
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  activityStepText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  activityDurationText: {
    fontWeight: '400',
    color: '#64748B',
  },
  activityDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  activityStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 2,
  },
  activityStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ─── SKILL EVAL BUTTON ───────────────────────────────────────────────────
  skillEvalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
  },
  skillEvalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },

  // ─── SIDEBAR CARDS ───────────────────────────────────────────────────────
  sidebarCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoRowLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  infoRowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressChartWrapper: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressChartLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressChartPct: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressLegend: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },

  noteInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#334155',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  noteStatusText: {
    fontSize: 11,
    marginTop: 6,
  },

  // ─── HOMEWORK TAB ────────────────────────────────────────────────────────
  homeworkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  createHomeworkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  createHomeworkBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeworkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  homeworkIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  homeworkBody: {
    flex: 1,
  },
  homeworkName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  homeworkDue: {
    fontSize: 11,
    marginTop: 2,
  },

  // ─── SKILL EVAL MODAL ────────────────────────────────────────────────────
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },
  modalFieldGroup: {
    marginBottom: 14,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  modalErrorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skillRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  scorePicker: {
    flexDirection: 'row',
    gap: 6,
  },
  scoreDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreDotActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  scoreDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  scoreDotTextActive: {
    color: '#FFFFFF',
  },
  modalTextarea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#334155',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
  },
  modalBtnSubmit: {
    backgroundColor: '#007AFF',
  },
});
