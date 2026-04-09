import { useQuery } from "@tanstack/react-query";
import { messageError } from "@tera/commons/constants/message";
import { useStores } from "@tera/stores/useStores";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";
import Opportunity from "./components/Opportunity";
import { ModalQuickViewProps } from "./interfaces";

const ModalOpportunity = ({
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
  onView;
  const {
    data: dataDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-opportunity-detail", detail_id, detail_type],
    queryFn: () => QuickViewApi.getDetailOpportunity(detail_id),
    enabled: !!detail_type && !!detail_id,
  });

  if (isError) {
    setClose();
    notification.error({
      message: messageError.DATA_NOT_FOUND,
    });
  }

  return (
    <Modal
      title="XEM NHANH CƠ HỘI"
      okText="Xem chi tiết"
      cancelText="Đóng"
      open={open}
      width="25%"
      footer={
        footer ? (
          footer
        ) : (
          <div className="flex gap-[16px]">
            <Button
              onClick={() => {
                if (typeof onView === "function") onView();
                setClose();
              }}
              className="text-[13px] leading-[15px] py-[8px] px-[12px] font-normal"
            >
              Xem chi tiết
            </Button>
            <Button
              onClick={() => {
                setClose(detail_type);
                typeof onClose === "function" && onClose();
              }}
              className="text-[13px] leading-[15px] py-[8px] px-[12px] font-normal"
            >
              Đóng
            </Button>
          </div>
        )
      }
    >
      <Spin spinning={isLoading}>
        <Opportunity data={dataDetail} />
      </Spin>
    </Modal>
  );
};

export default ModalOpportunity;
