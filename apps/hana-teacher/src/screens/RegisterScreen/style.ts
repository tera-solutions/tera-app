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
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    zIndex: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 52,
  },
  illustration: {
    width: '100%',
    height: 180,
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: 200,
    height: 170,
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
  },
  subtitle: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.sm,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  form: {
    gap: SPACING.lg,
  },
  error: {
    marginTop: -8,
    fontSize: 12,
    color: colors.error,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.lg,
    marginLeft: -SPACING.xs,
  },
  termsText: {
    flex: 1,
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  termsLink: {
    fontWeight: '600',
    color: colors.primary,
  },
  submitButton: {
    marginTop: SPACING.lg,
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
  footerText: {
    marginTop: SPACING.xxl,
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerLink: {
    fontWeight: '700',
    color: colors.primary,
  },
});
