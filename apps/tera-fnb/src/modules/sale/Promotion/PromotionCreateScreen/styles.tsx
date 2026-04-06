import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
 header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    scrollContent: { paddingBottom: 20 },
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        paddingVertical: 10,
    },
    inputRow: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    inputLabel: {
        fontSize: 13,
        color: '#6B7280',
        paddingTop: 5,
    },
    textInput: {
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 8,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pickerLabel: { fontSize: 15, color: '#1F2937' },
    pickerValueContainer: { flexDirection: 'row', alignItems: 'center' },
    pickerValue: { 
        fontSize: 15, 
        fontWeight: '500', 
        color: '#4B5563', 
        marginRight: 5 
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    switchLabel: { fontSize: 15, color: '#1F2937' },
    deleteButton: {
        marginTop: 20,
        marginHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EF4444',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    saveButton: {
        backgroundColor: '#10B981', // Green save button
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});
