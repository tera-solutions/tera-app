import React from "react";
import { Button, Modal } from "tera-dls";
import AvatarItem from "./AvatarItem";

function ModalViewMore({ open, title, onCancel, listAvatars }) {
  return (
    <Modal
      width={500}
      centered
      title={title}
      open={open}
      onCancel={onCancel}
      closeIcon={false}
      footer={
        <Button type="primary" onClick={onCancel}>
          Đóng
        </Button>
      }
    >
      <div className="flex flex-col gap-y-2.5 h-[600px] overflow-auto text-red-500">
        {listAvatars?.map((item) => (
          <AvatarItem
            src={item?.src}
            alt={item?.alt}
            content={item?.content}
            status={item?.status}
          />
        ))}
      </div>
    </Modal>
  );
}

export default ModalViewMore;
