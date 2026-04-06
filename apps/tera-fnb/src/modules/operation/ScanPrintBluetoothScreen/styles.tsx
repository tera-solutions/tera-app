import { FONT_FAMILY } from '@common/constants/typography';
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
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  scrollContent: { paddingHorizontal: 0, paddingVertical: 10, minHeight: height * 0.7 },

  // Section Group
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },

  // Setting Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 16,
    color: '#1F2937',
  },
  itemSubTitle: {
    fontSize: 13,
    color: '#636970ff',
  },
  // Floating Action Button (FAB)
  fabButton: {
    position: 'absolute',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 60,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    flexDirection: 'row',
  },

  fabText: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.Medium,
  },
});
