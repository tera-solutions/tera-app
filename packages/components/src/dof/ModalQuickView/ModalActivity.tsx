import { useQuery } from "@tanstack/react-query";
import NoData from "@tera/components/web/NoData";
import { messageError } from "@tera/commons/constants/message";
import { useStores } from "hooks/useStores";
import { DETAIL_TYPE } from "@tera/commons/hooks/useQuickView";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";
import Appointment from "./components/Appointment";
import Call from "./components/Call";
import Task from "./components/Task";
import { ModalQuickViewProps } from "./interfaces";

const ModalActivity = ({
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
    data: dataDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["modal-quick-view-activity", detail_id, detail_type],

    queryFn: () => {
      switch (detail_type) {
        case "appointment":
          return QuickViewApi.getDetailAppointment(detail_id);
        case "call":
          return QuickViewApi.getDetailCall(detail_id);
        case "task":
          return QuickViewApi.getDetailTask(detail_id);
      }
    },

    enabled: !!detail_type && !!detail_id,
  });

  const renderUI = (detail_type: DETAIL_TYPE) => {
    switch (detail_type) {
      case "appointment":
        return <Appointment data={dataDetail} />;
      case "call":
        return <Call data={dataDetail} />;
      case "task":
        return <Task data={dataDetail} />;
      default:
        return <NoData />;
    }
  };

  const renderTitle = {
    appointment: "XEM NHANH LỊCH HẸN",
    call: "XEM NHANH CUỘC GỌI",
    task: "XEM NHANH NHIỆM VỤ",
  };

  if (isError) {
    setClose();
    notification.error({
      message: messageError.DATA_NOT_FOUND,
    });
  }

  return (
    <Modal
      title={renderTitle[detail_type]}
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
      <Spin spinning={isLoading}>{renderUI(detail_type)}</Spin>
    </Modal>
  );
};

export default ModalActivity;
