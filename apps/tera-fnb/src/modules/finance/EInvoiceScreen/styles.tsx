import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: { paddingHorizontal: 20, paddingVertical: 10 },

  // Title
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981', // Màu xanh lá cây nổi bật như a57.jpg
    marginBottom: 20,
  },

  // Partner Item
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Nền nhẹ
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },

  // Support
  supportContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 5,
  },
  supportLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981', // Màu xanh lá cây
  },
});
