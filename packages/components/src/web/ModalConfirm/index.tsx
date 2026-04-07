// import { useEffect, useState } from 'react';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ExclamationTriangleOutlined,
  Modal,
} from "tera-dls";
interface IModal {
  isOpen: boolean;
  title: string;
  textContent: string | React.ReactNode;
  icon?: "success" | "warning" | "danger";
  handleClose: () => void;
  handleOk: () => void;
  isloading?: boolean;
}

const ModalConfirm = ({
  isOpen,
  title,
  textContent,
  icon,
  handleClose,
  handleOk,
  isloading,
}: IModal) => {
  const typeIcon = {
    success: <CheckCircleOutlined color="#438558" />,
    warning: <ExclamationTriangleOutlined color="#F5C344" />,
    danger: <ExclamationCircleOutlined color="#C9444A" />,
  };

  return (
    <>
      <Modal
        centered={true}
        title={title}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleClose}
        okText="Đồng ý"
        cancelText="Huỷ"
        closeIcon={false}
        confirmLoading={isloading}
      >
        <div className="flex flex-col items-center gap-4">
          {icon ? (
            <div className="w-20 h-20 font-thin">{typeIcon[icon]}</div>
          ) : (
            ""
          )}

          <div className="text-base text-center">{textContent}</div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirm;
