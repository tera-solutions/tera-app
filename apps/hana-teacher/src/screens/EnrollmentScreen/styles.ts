import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingBottom: 14,
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
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  stepDotActive: {
    backgroundColor: '#007AFF',
  },
  stepDotDone: {
    backgroundColor: '#E0F2E9',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepDotTextActive: {
    color: '#FFF',
  },
  stepDotTextDone: {
    color: '#16A34A',
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
  },
  stepConnectorDone: {
    backgroundColor: '#16A34A',
  },

  // Fields
  fieldGroup: {
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldRowItem: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },

  // Radio list (class picker)
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  radioCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EFF6FF',
  },
  radioCardDisabled: {
    opacity: 0.5,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotActive: {
    borderColor: '#007AFF',
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  radioSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  radioMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  badgeFull: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  badgeFullText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },

  // Preset grid
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetCard: {
    flexBasis: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
  },
  presetCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EFF6FF',
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  presetPrice: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Chip row (payment method / gender / mode toggle)
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFF',
  },

  tuitionSummary: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  tuitionAmount: {
    fontWeight: '700',
    color: '#0F172A',
  },

  // Students table (list)
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  studentRowName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  studentRowMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 16,
  },
  addStudentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 4,
  },
  addStudentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // Confirm step
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
  },
  summaryBoxLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  summaryBoxValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  resultRowName: {
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  resultErrorText: {
    fontSize: 11,
    color: '#EF4444',
    maxWidth: 160,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },

  // Inline back/next row at the bottom of a step card (not fixed)
  stepFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stepFooterBtn: {
    flex: 1,
    borderRadius: 12,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bottomBarBtn: {
    flex: 1,
    borderRadius: 12,
  },
  btnSubmit: {
    backgroundColor: '#007AFF',
  },
});
