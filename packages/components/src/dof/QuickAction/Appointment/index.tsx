import { useQuery } from "@tanstack/react-query";
import { OBJECT_KEY_CRM } from "@tera/commons/constants/object-key";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import customTwMerge from "tailwind-merge.config";
import { Empty, Spin } from "tera-dls";
import { generateTitle, paramsObject } from "../common";
import SearchSort from "../components/SearchSort";
import Item from "./Item";
import CreateFormByConsultingTicket from "./containers/CreateFormByConsultingTicket";
import CreateFormByCustomer from "./containers/CreateFormByCustomer";
import { usePermission } from "@tera/states/hooks";
import AppointmentApi from "../_api/appointment";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";
type AppointmentProps = {
  object_type: string;
  object_id: number;
  isScroll: boolean;
};
function Appointment({ object_type, object_id, isScroll }: AppointmentProps) {
  const {
    quickActionStore: { openForm, setOpenForm },
  } = useStores();
  const { hasPage } = usePermission();
  const [keyword, setKeyword] = useState("");

  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-list-appointment", object_type, object_id, keyword],

    queryFn: () =>
      AppointmentApi.getList({
        ...(paramsObject(object_id)[object_type] ?? {}),
        limit: 9999,
        keyword,
      }),

    staleTime: 300000,
    gcTime: 300000,
    enabled: !!object_type && !!object_id,
  });
  const listAppointment = response?.data;
  const infoTitle = generateTitle(response?.info);

  useEffect(() => {
    object_type && object_id && refetch();
  }, [object_type, object_id]);

  return (
    <Spin spinning={isLoading}>
      <div
        className={customTwMerge(
          "sticky top-0 -mx-4 p-4 z-10 bg-white transition-shadow duration-300 space-y-2.5",
          isScroll && "shadow-xsm",
        )}
      >
        {response?.info && infoTitle[object_type]}
        {hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_APPOINTMENT_SEARCH) && (
          <SearchSort
            handleSearchSort={(value) => setKeyword(value?.keyword)}
            isShowSort
            keyword={keyword}
            placeholder="Tìm kiếm theo tiêu đề lịch hẹn"
          />
        )}
      </div>
      {listAppointment && listAppointment.length > 0 ? (
        <div className="flex flex-col gap-4 divide-y divide-dashed">
          {listAppointment?.map((item) => (
            <Item key={item?.id} value={item} object_type={object_type} />
          ))}
        </div>
      ) : (
        <Empty classNameImage="w-12" />
      )}
      {object_type === OBJECT_KEY_CRM.customer && (
        <CreateFormByCustomer
          type="customer"
          object_id={object_id}
          open={openForm}
          onClose={() => setOpenForm(false)}
        />
      )}
      {object_type === OBJECT_KEY_CRM.supplier && (
        <CreateFormByCustomer
          type="supplier"
          object_id={object_id}
          open={openForm}
          onClose={() => setOpenForm(false)}
        />
      )}
      {object_type === OBJECT_KEY_CRM.consulting_ticket && (
        <CreateFormByConsultingTicket
          object_id={object_id}
          open={openForm}
          onClose={() => setOpenForm(false)}
        />
      )}
    </Spin>
  );
}

export default observer(Appointment);
