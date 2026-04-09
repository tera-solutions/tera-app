import { useQuery } from "@tanstack/react-query";
import { messageError } from "@tera/commons/constants/message";
import { useStores } from "@tera/stores/useStores";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";
import ConsultingTicket from "./components/ConsultingTicket";
import { ModalQuickViewProps } from "./interfaces";

const ModalConsultingTicket = ({
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
    queryKey: ["get-detail-consulting-ticket", detail_id, detail_type],
    queryFn: () => QuickViewApi.getDetailConsultingTicket(detail_id),
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
      title="XEM NHANH THẺ TƯ VẤN"
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
        <ConsultingTicket data={dataDetail} />
      </Spin>
    </Modal>
  );
};

export default ModalConsultingTicket;
