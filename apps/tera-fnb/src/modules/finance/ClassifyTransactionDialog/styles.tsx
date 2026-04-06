import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
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
    titleText: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#1F2937' 
    },

    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },

    scrollView: {
        flex: 1,
        paddingHorizontal: 15,
    },
    
    // Group Header
    groupHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginTop: 15,
        marginBottom: 8,
        paddingTop: 5,
        // Dùng padding ngang trong ScrollView
    },
    otherHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15, // Căn chỉnh với nút Sửa
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 4,
    },
    editText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
        marginLeft: 4,
    },

    // Item Row
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        // paddingLeft: 10, // Căn chỉnh với header
    },
    radioIcon: {
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 16,
        color: '#1F2937',
    },
    itemDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    }
});
