import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  // Header
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: {
    maxWidth: '80%',
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981', // Màu xanh lá cây
  },

  scrollContent: { padding: 15, paddingTop: 0 },

  // Content Sections
  sectionContainer: { marginBottom: 20 },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 10,
  },
  subSection: { marginBottom: 15 },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 8,
  },

  // Details (Bulleted List)
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingLeft: 10,
  },
  detailBullet: {
    fontSize: 16,
    color: '#4B5563',
    marginRight: 5,
    lineHeight: 22,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  detailValue: {
    // Màu mặc định
  },

  // FAB
  fabButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 80,
    backgroundColor: '#000', // Màu xanh lá cây
    borderRadius: 25,
    elevation: 8,
    opacity: 0.6,
  },
});
