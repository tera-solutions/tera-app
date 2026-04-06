import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  billContent: {
    paddingHorizontal: 0,
    paddingBottom: 30,
  },
  // --- Bill Info Section ---
  billInfoContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  qrCodePlaceholder: {
    width: 200,
    height: 120,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeImage: {
    width: 120,
    height: 100,
  },
  storeDetails: {
    alignItems: 'center',
  },
  storeNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  storeDetailText: {
    fontSize: 13,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  billSubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 13,
    width: 60, // Cố định chiều rộng cho 'Khách:'
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Items Section ---
  itemsContainer: {},
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  itemNameHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    width: '40%',
  },
  itemQuantityHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    width: '30%',
  },
  itemTotalHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000000',
    width: '20%',
  },
  itemNameText: {
    fontSize: 14,
    color: '#000000',
    width: '40%',
  },
  itemPriceText: {
    fontSize: 13,
    width: '20%',
    textAlign: 'right',
    color: '#000000',
  },
  itemQuantityText: {
    fontSize: 13,
    textAlign: 'center',
    width: '8%',
    color: '#000000',
  },
  itemTotalText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    width: '20%',
    color: '#000000',
  },

  // --- Totals Section ---
  totalsContainer: {},
  line: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 13,
    color: '#000000',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  grandTotalRow: {
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  paidLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },

  // --- Footer Actions ---
  footerContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    color: '#007AFF',
  },
  createBillButton: {
    backgroundColor: '#5CB85C', // Màu xanh lục
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBillText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewShotContainer: {
    backgroundColor: 'white',
    paddingBottom: 20,
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    width: 368,
  },
  rowHeader: {
    justifyContent: 'space-between',
  },
});
