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
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
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

  // Search
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

  // Student list row
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  studentRowActive: {
    backgroundColor: '#EBF5FF',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  studentMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  studentScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Detail panel
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  panelTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  panelTabItem: {
    paddingVertical: 8,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  panelTabItemActive: {
    borderBottomColor: '#007AFF',
  },
  panelTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  panelTabTextActive: {
    color: '#007AFF',
  },
  statTilesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statTileIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTileValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  statTileLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  skillInfo: {
    flex: 1,
    minWidth: 0,
  },
  skillLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  skillTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  skillValue: {
    width: 28,
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
  },
  latestCommentCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  latestCommentText: {
    fontSize: 13,
    color: '#334155',
  },

  // Comments tab
  commentCard: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  commentBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  commentBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  commentBadgeText: {
    fontSize: 10,
    color: '#64748B',
  },
  commentText: {
    fontSize: 13,
    color: '#334155',
  },
  commentDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
  },

  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  addBtn: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
});
