import { StyleSheet } from 'react-native';

import colors, {
  RADIUS,
  SHADOW,
  SPACING,
} from '@tera/commons/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FC',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl + SPACING.lg,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  headerActionBtn: {
    alignItems: 'center',
    gap: 2,
  },
  headerActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  employeeCard: {
    marginTop: -SPACING.xxxl - SPACING.md,
    marginHorizontal: SPACING.xl,
    flexDirection: 'row',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.white,
    ...SHADOW.card,
  },
  employeeLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roleBadge: {
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: '#EEF7FF',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  periodDivider: {
    width: 1,
    marginHorizontal: SPACING.md,
    backgroundColor: colors.border,
  },
  periodBlock: {
    alignItems: 'flex-start',
  },
  periodLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  periodValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  periodValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  periodRange: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },
  statsRow: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.xl,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.card,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  dayCard: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  dayDateBlock: {
    width: 56,
    alignItems: 'center',
  },
  dayWeekday: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dayNumberWeekend: {
    color: '#DC2626',
  },
  dayMonth: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dayDoneIcon: {
    position: 'absolute',
    right: -4,
    bottom: 14,
  },
  dayInfoBlock: {
    flex: 1,
  },
  dayInfoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dayInfoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  dayMetaCol: {
    alignItems: 'center',
    gap: 2,
  },
  dayMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayMetaLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sessionList: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sessionRowLast: {
    borderBottomWidth: 0,
  },
  shiftBlock: {
    width: 76,
  },
  shiftBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  shiftBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  shiftTime: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textSecondary,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sessionClassName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  sessionLevelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  sessionLevelText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  sessionLesson: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  sessionDurationCol: {
    alignItems: 'flex-end',
  },
  sessionDurationValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sessionDurationLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  infoBanner: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: '#EEF7FF',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingWrapper: {
    paddingVertical: SPACING.xxl,
  },
  emptyWrapper: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalOptionTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
});
