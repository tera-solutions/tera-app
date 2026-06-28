import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ─── Header ───────────────────────────────────────────────────────────────
  headerBg: {
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // ─── Stats Row ────────────────────────────────────────────────────────────
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statValueBlue: {
    color: '#007AFF',
  },
  statValueGreen: {
    color: '#27AE60',
  },
  statValuePurple: {
    color: '#9B5DE5',
  },

  // ─── Category Tabs ────────────────────────────────────────────────────────
  categoryScroll: {
    marginTop: 20,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ─── Search ───────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    marginLeft: 8,
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },

  // ─── Section ──────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },

  // ─── Folder Cards ─────────────────────────────────────────────────────────
  foldersScroll: {
    paddingHorizontal: 16,
  },
  folderCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  folderIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  folderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  folderCount: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },

  // ─── Material List ────────────────────────────────────────────────────────
  listContainer: {
    paddingHorizontal: 16,
  },
  materialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  materialIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialContent: {
    flex: 1,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  materialMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  materialDate: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
  materialRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // ─── Upload Banner ────────────────────────────────────────────────────────
  bannerContainer: {
    backgroundColor: '#EBF5FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  bannerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  bannerDesc: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
    lineHeight: 16,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D0E7FF',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
});
