import { useQueryClient } from "@tanstack/react-query";
import FormStore, {
  FormStoreRef,
} from "@tera/components/shared/Store/containers/Form";
import { useRef } from "react";
import { Modal } from "tera-dls";

interface FormStoreProps {
  open: boolean;
  onCancel: () => void;
}

function ModalFormStore({ open, onCancel }: FormStoreProps) {
  const formRef = useRef<FormStoreRef>();
  const queryClient = useQueryClient();

  return (
    <Modal
      title="Thêm cấu hình cửa hàng"
      open={open}
      width={700}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={() => formRef?.current?.onCancel()}
      onOk={() => formRef?.current?.onSubmit()}
      destroyOnClose
    >
      <FormStore
        ref={formRef}
        onRefetch={() => {
          queryClient.invalidateQueries({
            queryKey: ["get-list-location"],
          });
          onCancel();
        }}
        onClose={onCancel}
      />
    </Modal>
  );
}

export default ModalFormStore;
