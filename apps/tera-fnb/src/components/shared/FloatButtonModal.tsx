import colors from '@tera/commons/constants/colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export interface IProps {
  visible: boolean;
  itemCount?: number;
  onClose?: ((event?: any) => void) | undefined; // Ghi chú
  children?: React.ReactNode;
}

const { height, width } = Dimensions.get('window');

const FloatButtonModal = ({
  visible,
  itemCount = 3,
  onClose,
  children,
}: IProps) => {
  const [displayContent, setDisplayContent] = useState(visible);
  const MODAL_HEIGHT = 50 * Number(itemCount);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const slideUpValue = height - MODAL_HEIGHT;

  useEffect(() => {
    if (visible) {
      setDisplayContent(true);
      slideAnim.setValue(height);
    }
  }, [visible]);

  useEffect(() => {
    if (!displayContent) return;
    if (visible) {
      // Khi Modal hiển thị: Trượt xuống từ trên cùng (y: 0)
      Animated.timing(slideAnim, {
        toValue: slideUpValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Khi Modal đóng: Trượt lên lại vị trí ban đầu (-MODAL_HEIGHT)
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDisplayContent(false);
      });
    }
  }, [displayContent, visible, slideAnim, slideUpValue]);

  const onCreatePOS = () => {
    console.tron('onCreatePOS');
  };

  const onCreateOnline = () => {
    console.tron('onCreateOnline');
  };

  if (!displayContent) {
    return null;
  }

  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={displayContent}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={floatStyles.overlay} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            floatStyles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
              height: MODAL_HEIGHT,
            },
          ]}
        >
          <View style={floatStyles.modalView}>{children}</View>
        </Animated.View>
      </Modal>
    </>
  );
};

export const floatStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Căn bottom
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ
  },
  modalContent: {
    position: 'absolute',
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 30, // Khoảng cách cho thanh Home Indicator
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textStyle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default FloatButtonModal;
