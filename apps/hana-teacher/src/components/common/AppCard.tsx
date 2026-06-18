import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: any;
}

export default function AppCard({
  children,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFF',
          borderRadius: 24,
          padding: 16,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}