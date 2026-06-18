import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function CreateClassBanner() {
  return (
    <View
      style={{
        margin: 16,
        padding: 20,
        borderRadius: 24,
        backgroundColor: '#EEF6FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
      }}
    >
      <View style={{ width: '60%' }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: "#0066cc"
          }}
        >
          Tạo lớp học mới
        </Text>

        <Text
          style={{
            color: '#666',
            marginTop: 8,
            fontSize: 12
          }}
        >
          Thêm lớp học và bắt đầu quản lý ngay
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: '#0B84FF',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            alignSelf: 'flex-start',
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontWeight: '700',
            }}
          >
            + Tạo lớp mới
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: '40%' }}>
        <Image
          source={require('@tera/assets/app/element_69.png')}
          style={{ width: 150, height: 80 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
