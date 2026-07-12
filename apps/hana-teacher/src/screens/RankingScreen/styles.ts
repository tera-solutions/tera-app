import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Summary stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  statSublabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
    textAlign: 'center',
  },

  // Tabs
  tabsScroll: {
    marginBottom: 16,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#EBF5FF',
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#007AFF',
  },

  // Generic card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 24,
  },

  // Month filter
  monthChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  monthChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  monthChipTextActive: {
    color: '#FFF',
  },

  // Top 3
  top3Row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  medalBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  top3Name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  top3Class: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  top3Score: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Ranking list row
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  rankRowHighlight: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  rankBadgeNum: {
    width: 22,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  rankInfo: {
    flex: 1,
    minWidth: 0,
  },
  rankScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 4,
  },
  classificationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF5FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  classificationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
  },

  // Histogram (self-drawn bar)
  histBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  histBarLabel: {
    width: 56,
    fontSize: 11,
    color: '#64748B',
  },
  histBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  histBarFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#38BDF8',
  },
  histBarCount: {
    width: 22,
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'right',
  },

  // Progress tab
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  progressScoreCol: {
    alignItems: 'center',
    width: 48,
  },
  progressScoreLabel: {
    fontSize: 9,
    color: '#94A3B8',
  },
  progressScoreValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 56,
    justifyContent: 'flex-end',
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Group tab
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 12,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    padding: 8,
  },
  groupChipActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF5FF',
  },
  groupChipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  groupStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // Evaluation placeholder tab
  placeholderWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  placeholderText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
