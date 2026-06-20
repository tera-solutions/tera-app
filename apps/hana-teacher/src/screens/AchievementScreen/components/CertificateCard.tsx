import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles';

interface CertificateProps {
  title: string;
  student: string;
  image: string;
}

export default function CertificateCard({
  title,
  student,
  image,
}: CertificateProps) {
  return (
    <View style={styles.certificateCard}>
      <Image
        source={{ uri: image }}
        style={styles.certificateImage}
        resizeMode="cover"
      />
      <Text style={styles.certificateTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.certificateStudent}>{student}</Text>
    </View>
  );
}
