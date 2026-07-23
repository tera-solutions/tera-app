import { Dimensions, StyleSheet } from 'react-native';

import colors, {
  RADIUS,
  SHADOW,
  SPACING,
} from '@tera/commons/constants/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  screenBackground: {
    position: 'absolute',
    zIndex: -1,
    width,
    height,
  },
  header: {
    alignItems: 'center',
  },
  logoImage: {
    width: 170,
    height: 59,
  },
  illustration: {
    width: '100%',
    height: 250,
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: 280,
    height: 240,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
    zIndex: 10,
  },
  card: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    ...SHADOW.card,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  subtitle: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
  },
  form: {
    marginTop: SPACING.xxl,
    gap: SPACING.lg,
  },
  error: {
    marginTop: -8,
    fontSize: 12,
    color: colors.error,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  submitButton: {
    marginTop: SPACING.xs,
    height: 52,
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    height: 46,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
  },
  securityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEFFF',
  },
  securityTextWrapper: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  securityDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerLink: {
    fontWeight: '700',
    color: colors.primary,
  },
});
