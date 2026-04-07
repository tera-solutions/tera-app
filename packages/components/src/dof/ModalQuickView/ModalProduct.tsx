import { useQuery } from "@tanstack/react-query";
import { useStores } from "hooks/useStores";
import { useEffect } from "react";
import { Button, Modal, Spin, notification } from "tera-dls";
import QuickViewApi from "./_api";

import { messageError } from "@tera/commons/constants/message";
import { ModalQuickViewProps } from "./interfaces";
import { usePermission } from "@tera/states/hooks";
import { PRODUCT_PERMISSION_KEY } from "@tera/commons/constants/permission";
import NormalProduct from "./components/Product/NormalProduct";
import VariantProduct from "./components/Product/VariantProduct";
import ComboProduct from "./components/Product/ComboProduct";

const ModalProduct = ({
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

  const {
    data: dataDetail,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["modal-quick-view-product", detail_id, detail_type],
    queryFn: () => QuickViewApi.getDetailProduct({ id: detail_id }),
    enabled: !!detail_type && !!detail_id,
    gcTime: 300000,
    staleTime: 300000,
  });

  useEffect(() => {
    if (detail_id && detail_type) refetch();
  }, [detail_id, detail_type]);

  if (isError) {
    setClose(detail_type);
    notification.error({
      message: messageError.DATA_NOT_FOUND,
    });
  }

  const handleCancel = () => {
    setClose(detail_type);
    typeof onClose === "function" && onClose();
  };

  const renderViewObject = {
    single: <NormalProduct dataDetail={dataDetail} />,
    variable: <VariantProduct dataDetail={dataDetail} />,
    combo: <ComboProduct dataDetail={dataDetail} />,
  };

  const objectClassName = {
    single: "sm:w-[80%] xl:w-[60%]",
    variable: "sm:w-[80%] xl:w-[80%]",
    combo: "sm:w-[80%] xl:w-[80%]",
  };

  return (
    <Modal
      title="Xem nhanh sản phẩm"
      open={open}
      onCancel={handleCancel}
      footer={
        footer || (
          <div className="flex gap-[16px]">
            {hasPage(
              PRODUCT_PERMISSION_KEY.PRODUCT_MANAGEMENT_DETAIL_PRODUCT,
            ) && (
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
              onClick={handleCancel}
              className="text-[13px] leading-[15px] py-[8px] px-[12px] font-normal"
            >
              Đóng
            </Button>
          </div>
        )
      }
      className={objectClassName[dataDetail?.type]}
    >
      <div className="max-h-[800px] overflow-auto">
        <Spin spinning={isLoading} wrapperClassName="flex justify-center">
          {dataDetail?.type && renderViewObject?.[dataDetail?.type]}
        </Spin>
      </div>
    </Modal>
  );
};

export default ModalProduct;
