import { useQuery } from "@tanstack/react-query";
import { useStores } from "@tera/stores/useStores";
import { useEffect } from "react";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";

import { DETAIL_TYPE } from "@tera/commons/hooks/useQuickView";
import PurchaseOrder from "./components/Order/PurchaseOrder";
import PurchaseReturn from "./components/Order/PurchaseReturn";
import PriceQuote from "./components/Order/PriceQuote";
import SellOrder from "./components/Order/SellOrder";
import SellReturn from "./components/Order/SellReturn";
import NoData from "@tera/components/web/NoData";
import { messageError } from "@tera/commons/constants/message";
import { ModalQuickViewProps } from "./interfaces";
import { usePermission } from "@tera/states/hooks";
import PurchaseRequest from "./components/Order/PurchaseRequest";

const ModalOrder = ({
  open,
  detail_id,
  detail_type,
  onView,
  onClose,
  permission,
}: ModalQuickViewProps) => {
  const {
    quickViewStore: { setClose },
  } = useStores();
  const { hasPage } = usePermission();

  const {
    data: dataDetail,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["modal-quick-view-order", detail_id, detail_type],

    queryFn: () => {
      switch (detail_type) {
        case "purchase_request":
          return QuickViewApi.getDetailPurchaseRequest({ id: detail_id });
        case "purchase":
          return QuickViewApi.getDetailPurchase({ id: detail_id });
        case "sell":
          return QuickViewApi.getDetailSellOrder({ id: detail_id });
        case "price_quote":
          return QuickViewApi.getDetailPriceQuote({ id: detail_id });
        case "purchase_return":
          return QuickViewApi.getDetailPurchaseReturn({ id: detail_id });
        case "sell_return":
          return QuickViewApi.getDetailSaleOrderReturn({ id: detail_id });
      }
    },

    enabled: !!detail_type && !!detail_id,
    gcTime: 300000,
    staleTime: 300000,
  });

  const renderUI = (detail_type: DETAIL_TYPE) => {
    switch (detail_type) {
      case "purchase_request":
        return <PurchaseRequest dataDetail={dataDetail} />;
      case "purchase":
        return <PurchaseOrder dataDetail={dataDetail} />;
      case "sell":
        return <SellOrder dataDetail={dataDetail} />;
      case "price_quote":
        return <PriceQuote dataDetail={dataDetail} />;
      case "purchase_return":
        return <PurchaseReturn dataDetail={dataDetail} />;
      case "sell_return":
        return <SellReturn dataDetail={dataDetail} />;
      default:
        return <NoData />;
    }
  };

  const renderTitle = () => {
    switch (detail_type) {
      case "purchase_request":
        return "Xem nhanh yêu cầu mua hàng";
      case "purchase":
        return "Xem nhanh đơn mua hàng";
      case "sell":
        return "Xem nhanh đơn bán hàng";
      case "price_quote":
        return "Xem nhanh đơn báo giá";
      case "purchase_return":
        return "Xem nhanh đơn trả hàng mua";
      case "sell_return":
        return "Xem nhanh đơn trả hàng bán";
      default:
        return "";
    }
  };
  useEffect(() => {
    if (detail_id && detail_type) refetch();
  }, [detail_id, detail_type]);

  const handleCancel = () => {
    if (typeof onClose === "function") onClose();
    setClose(detail_type);
  };

  if (isError) {
    setClose(detail_type);
    notification.error({
      message: messageError.DATA_NOT_FOUND,
    });
  }

  return (
    <Modal
      title={renderTitle()}
      open={open}
      width="42%"
      onCancel={handleCancel}
      footer={
        <>
          <Button onClick={handleCancel}>Đóng</Button>
          {hasPage(permission) && (
            <Button
              onClick={() => {
                if (typeof onView === "function") onView();
                setClose();
              }}
            >
              Xem chi tiết
            </Button>
          )}
        </>
      }
    >
      <div className="max-h-[600px] overflow-auto">
        <Spin spinning={isLoading}>{renderUI(detail_type)}</Spin>
      </div>
    </Modal>
  );
};

export default ModalOrder;
