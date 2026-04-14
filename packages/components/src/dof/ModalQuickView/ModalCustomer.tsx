import { useQuery } from "@tanstack/react-query";
import { useStores } from "@tera/stores/useStores";
import { useEffect } from "react";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";
import Customer from "./components/Customer";
import { messageError } from "@tera/commons/constants/message";
import { ModalQuickViewProps } from "./interfaces";
import { usePermission } from "@tera/commons/hooks/usePermission";

const ModalCustomer = ({
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

  const { hasPage } = usePermission();

  onView;
  const {
    data: dataDetails,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["modal-quick-view-customer", detail_id, detail_type],
    queryFn: () => QuickViewApi.getDetailCustomer({ id: detail_id }),
    enabled: !!detail_type && !!detail_id,
    gcTime: 300000,
    staleTime: 300000,
  });

  // const { data: dataDetailBank } = useQuery(
  //   ['get-customer-bank-detail', dataDetails?.bank_default_id],
  //   () =>
  //     QuickViewApi.getDetailCustomerBank({ id: dataDetails?.bank_default_id }),
  //   {
  //     enabled: !!dataDetails?.bank_default_id,
  //     gcTime: 300000,
  //     staleTime: 300000,
  //   },
  // );

  // const { data: dataDetailDelivery } = useQuery(
  //   ['get-customer-delivery-detail', dataDetails?.delivery_address_default_id],
  //   () =>
  //     QuickViewApi.getDetailCustomerDelivery({
  //       id: dataDetails?.delivery_address_default_id,
  //     }),
  //   {
  //     enabled: !!dataDetails?.delivery_address_default_id,
  //     gcTime: 300000,
  //     staleTime: 300000,
  //   },
  // );

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
      title="XEM NHANH KHÁCH HÀNG"
      destroyOnClose
      okText="Xem chi tiết"
      cancelText="Đóng"
      closeIcon={false}
      open={open}
      width={550}
      footer={
        footer ? (
          footer
        ) : (
          <div className="flex gap-[16px]">
            {hasPage("crm_customer_view_customer_detail") && (
              <Button
                onClick={() => {
                  if (typeof onView === "function") onView();
                  setClose();
                }}
                className="text-[13px] leading-[15px] py-[8px] px-[12px] font-normal"
              >
                Xem chi tiết
              </Button>
            )}
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
        <Customer
          data={dataDetails}
          // dataBank={dataDetailBank}
          // dataDelivery={dataDetailDelivery}
        />
      </Spin>
    </Modal>
  );
};

export default ModalCustomer;
