import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Info Section
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    marginBottom: 5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    color: '#6B7280',
    marginRight: 10,
  },
  smallInput: {
    textAlign: 'right',
    fontSize: 15,
    color: '#6B7280',
    borderWidth: 0,
    height: 35,
    backgroundColor: 'translate',
  },
  numberInput: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 600,
    height: 45,
    flex: 1,
    backgroundColor: 'translate',
  },
  sizeHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Shipping Options
  optionsContainer: {
    backgroundColor: '#FFFFFF',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  carrierDetails: {
    marginLeft: 10,
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carrierName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 5,
  },
  carrierIconS: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginRight: 5,
  },
  tagCheapest: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontSize: 11,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tagFastest: {
    backgroundColor: '#EBF4FF',
    color: '#3B82F6',
    fontSize: 11,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tagRecommended: {
    backgroundColor: '#D1FAE5',
    color: '#10B981',
    fontSize: 11,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  originalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
