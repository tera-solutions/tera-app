import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
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

    // Section Group
    section: {
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    
    // Nav Item (Chevron)
    navItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    navItemTitle: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    navItemValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navItemValue: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 5,
    },
    
    // Toggle Item (Switch)
    toggleItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    toggleItemTitle: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
     // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        padding: 10,
        paddingHorizontal: 15,
    },
    saveButton: {
        backgroundColor: '#3B82F6', 
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
