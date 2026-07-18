import { StyleSheet } from 'react-native';

import colors, {
  RADIUS,
  SHADOW,
  SPACING,
} from '@tera/commons/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  topBarIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryCard: {
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  summaryValue: {
    marginTop: SPACING.xs,
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  invoiceCard: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.card,
  },
  invoiceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  invoiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoicePackageName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  invoiceCode: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  invoiceDate: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  invoiceDivider: {
    marginVertical: SPACING.md,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  invoiceBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invoiceAmountWrapper: {},
  invoiceAmountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  invoiceAmount: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  invoiceMethodWrapper: {
    alignItems: 'flex-end',
  },
  invoiceMethodLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  invoiceMethodValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingWrapper: {
    paddingVertical: SPACING.xxl,
  },
  emptyWrapper: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF7FF',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
