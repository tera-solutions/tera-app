import { BTN_PRIMARY, BTN_PRIMARY_LIGHT } from '@tera/commons/constants/common';
import React from 'react';
import { Modal, ModalProps } from 'tera-dls';

interface ModalFormProps extends ModalProps {
  children: React.ReactNode;
}

const ModalForm = (props: ModalFormProps) => {
  const { children } = props;
  return (
    <Modal
      closeIcon={false}
      width={500}
      okText="Đồng ý"
      cancelText="Hủy"
      okButtonProps={{
        className: BTN_PRIMARY,
      }}
      cancelButtonProps={{
        className: BTN_PRIMARY_LIGHT,
      }}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalForm;
