import React from "react";
import { Button, Modal } from "tera-dls";

interface ModalViewMoreDesProps {
  title: string;
  open: boolean;
  onCloseModal: () => void;
  content: React.ReactNode | string[] | string;
  width?: number | string;
}

function ModalViewMoreDes({
  title,
  open,
  onCloseModal,
  content,
  width,
}: ModalViewMoreDesProps) {
  return (
    <Modal
      width={width}
      centered
      title={title}
      open={open}
      onCancel={onCloseModal}
      footer={
        <Button type="primary" onClick={onCloseModal}>
          Đóng
        </Button>
      }
      closeIcon={false}
    >
      <div className="break-word">{content}</div>
    </Modal>
  );
}

export default ModalViewMoreDes;
