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
    paddingBottom: 20,
  },

  // Banner (QC Hong Leong Bank)
  bannerContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  // Sections
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Bank Item
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  connectedBankItem: {
    marginHorizontal: 10,
    borderRadius: 8,
    borderBottomColor: '#494949ff',
    borderWidth: 1,
    borderColor: '#494949ff', // Màu đỏ nổi bật cho Hong Leong Bank
    marginTop: 5,
    marginBottom: 5,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogoPlaceholder: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bankDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  notifyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6', // Màu xanh cho 'Liên kết'
  },

  // Add Method Button
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  addMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 10,
  },
});
