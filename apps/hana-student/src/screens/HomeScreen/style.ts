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
    paddingBottom: SPACING.xxl,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerGreeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  headerName: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sectionCard: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionBody: {
    marginTop: SPACING.sm,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
