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
  balanceCard: {
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  balanceValue: {
    marginTop: SPACING.xs,
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  balanceLoading: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  safeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  balanceDecorIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
  },
  filterTabsRow: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterTab: {
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 68,
  },
  filterTabActive: {
    borderColor: colors.border,
    backgroundColor: '#F8FBFF',
  },
  filterTabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filterTabLabelActive: {
    color: colors.textPrimary,
  },
  toolbarRow: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRangeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateRangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  dateSectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  transactionsCard: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.card,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionRowLast: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  transactionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionTime: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },
  transactionAmountWrapper: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  transactionBalance: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
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
  footerNote: {
    marginTop: SPACING.lg,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
