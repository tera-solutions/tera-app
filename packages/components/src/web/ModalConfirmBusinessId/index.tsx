import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStores } from "hooks/useStores";
import FormStore, {
  FormStoreRef,
} from "@tera/components/shared/Store/containers/Form";
import { observer } from "mobx-react-lite";
import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LocationApi from "@tera/api/location";
import { Button, Modal, OptionProps, Select, Skeleton } from "tera-dls";
function ModalConfirmBusinessId() {
  const {
    commonStore: {
      openModalLocationId,
      location_id,
      setLocationId,
      setOpenModalLocationId,
    },
    globalStore: { location_id: globalLocationId },
  } = useStores();
  const queryClient = useQueryClient();

  const formRef = useRef<FormStoreRef>();
  const navigate = useNavigate();

  const { data: locations, isLoading } = useQuery({
    queryKey: ["get-list-location"],

    queryFn: () => {
      const params = {
        limit: 30,
        page: 1,
      };
      return LocationApi.getList({ params });
    },

    gcTime: 300000,
    staleTime: 300000,
  });

  const hasLocation = locations?.data?.length > 0;

  const optionLocations: OptionProps[] = useMemo(() => {
    if (!locations) return [];
    return locations?.data?.map((location) => ({
      value: location.id,
      label: location.name,
    }));
  }, [locations]);

  const handleOk = () => {
    if (hasLocation) {
      if (!globalLocationId && !location_id) return;
      setOpenModalLocationId(false);
    } else {
      formRef.current.onSubmit();
    }
  };

  return (
    <Modal
      title={hasLocation ? "Xác nhận cửa hàng" : "Thêm mới cửa hàng"}
      // okText="Đồng ý"
      destroyOnClose
      closeIcon={false}
      width={500}
      // cancelButtonProps={{ className: 'hidden' }}
      // onOk={() => {
      //   if (hasLocation) {
      //     setOpenModalLocationId(false);
      //   } else {
      //     formRef.current.onSubmit();
      //   }
      // }}
      open={openModalLocationId}
      footer={
        <div className="flex gap-x-2.5">
          {!hasLocation && (
            <Button type="alternative" onClick={() => navigate(-1)}>
              Trở về
            </Button>
          )}
          <Button onClick={handleOk}>{hasLocation ? "Đồng ý" : "Lưu"}</Button>
        </div>
      }
    >
      <Skeleton loading={isLoading} round active paragraph title={false}>
        {hasLocation ? (
          <Select
            options={optionLocations}
            onSelect={(value: number) => {
              setLocationId(value);
            }}
            value={globalLocationId || location_id}
          />
        ) : (
          <FormStore
            ref={formRef}
            onRefetch={() => {
              queryClient.invalidateQueries({
                queryKey: ["get-list-location"],
              });
            }}
          />
        )}
      </Skeleton>
    </Modal>
  );
}

export default observer(ModalConfirmBusinessId);
