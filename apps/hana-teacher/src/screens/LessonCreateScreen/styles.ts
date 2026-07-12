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
    marginBottom: 4,
  },
  hintText: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 12,
  },

  // ─── PLAN SUMMARY ────────────────────────────────────────────────────────
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  planMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // ─── CLASSROOM PICKER ────────────────────────────────────────────────────
  classroomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  classroomRowActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EEF5FF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  classroomName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  classroomMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 16,
  },

  // ─── SUMMARY / WARNING ───────────────────────────────────────────────────
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  noticeCardInfo: {
    backgroundColor: '#EBF5FF',
  },
  noticeCardWarn: {
    backgroundColor: '#FFF7E6',
  },
  noticeText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },

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
