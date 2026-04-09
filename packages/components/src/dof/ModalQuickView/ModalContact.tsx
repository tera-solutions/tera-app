import { useQuery } from "@tanstack/react-query";
import { useStores } from "@tera/stores/useStores";
import { useEffect } from "react";
import { Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";
import Contact from "./components/Contact";
import { messageError } from "@tera/commons/constants/message";
import { ModalQuickViewProps } from "./interfaces";

const ModalContact = ({
  open,
  detail_id,
  detail_type,
  onView,
  onClose,
  footer,
}: ModalQuickViewProps) => {
  const {
    quickViewStore: { setClose },
  } = useStores();

  const {
    data: dataDetails,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["modal-quick-view-contact", detail_id, detail_type],
    queryFn: () => QuickViewApi.getDetailContact({ id: detail_id }),
    enabled: !!detail_type && !!detail_id,
    gcTime: 300000,
    staleTime: 300000,
  });

  useEffect(() => {
    if (detail_id && detail_type) refetch();
  }, [detail_id, detail_type]);

  if (isError) {
    setClose();
    notification.error({
      message: messageError.DATA_NOT_FOUND,
    });
  }

  return (
    <Modal
      title="XEM NHANH LIÊN HỆ"
      okText="Xem chi tiết"
      cancelText="Đóng"
      closeIcon={false}
      open={open}
      onOk={() => {
        if (typeof onView === "function") onView();
        setClose();
      }}
      onCancel={() => {
        if (typeof onClose === "function") onClose();
        setClose(detail_type);
      }}
      width={1200}
      footer={footer}
    >
      <Spin spinning={isLoading}>
        <Contact data={dataDetails} />
      </Spin>
    </Modal>
  );
};

export default ModalContact;
