import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0066CC',
  background: '#F4F7FB',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#F1F5F9',
};

export const styles = StyleSheet.create({
  // ─── SCREEN ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginLeft: -6,
  },
  headerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerLabelText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
  },

  // ─── PROFILE CARD ────────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  profileSchool: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  profileChevron: {
    padding: 4,
  },

  // ─── SECTION ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // ─── MORE ITEM (4-column grid) ────────────────────────────────────────────────
  moreItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  moreItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  moreItemLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // ─── UTILITIES SECTION (2-row grid) ──────────────────────────────────────────
  utilitiesCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // ─── PROMO BANNER ─────────────────────────────────────────────────────────────
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoBannerContent: {
    flex: 1,
  },
  promoBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  promoBannerDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
  promoBannerIcons: {
    alignItems: 'center',
    gap: 8,
  },
});
