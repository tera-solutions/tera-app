import { FONT_FAMILY } from '@tera/common/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Scroll Content
  scrollContent: {
    paddingBottom: 80, // Dành chỗ cho FAB
    paddingHorizontal: 10,
  },

  // Notification Banner
  notifyBanner: {
    backgroundColor: '#EBF4FF', // Light blue background
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  notifyText: {
    fontSize: 14,
    color: '#1F2937',
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  // Transfer Button
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },

  // Fund List Section
  fundListSection: {
    marginTop: 10,
  },
  fundItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  fundBalance: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.Medium,
    color: '#0051ffff',
    marginTop: 2,
  },
  fundActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Floating Action Button (FAB)
  fabButton: {
    position: 'absolute',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
