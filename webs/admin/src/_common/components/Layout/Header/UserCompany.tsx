import { useQuery } from "@tanstack/react-query";
import { useStores } from "_common/hooks/useStores";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationApi from "@tera/api/location";
import {
  BuildingStorefrontOutlined,
  CheckSolid,
  ChevronRightOutlined,
  OptionProps,
  PlusCircleOutlined,
  Popover,
} from "tera-dls";
import ModalFormStore from "./ModalCreateLocation";

const UserCompany = observer(() => {
  const [isForm, setIsForm] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    commonStore: { business, location_id, setLocationId },
  } = useStores();

  const { data: locations } = useQuery({
    queryKey: ["get-list-location", business?.id],

    queryFn: () => {
      const params = {
        limit: 30,
        page: 1,
      };
      return LocationApi.getList({ params });
    },

    enabled: !!business?.id,
    gcTime: 300000,
    staleTime: 300000,
  });

  const optionLocations: OptionProps[] = useMemo(() => {
    if (!locations) return [];
    return locations?.data?.map((location) => ({
      value: location.id,
      label: location.name,
    }));
  }, [locations]);

  useEffect(() => {
    if (locations) {
      if (location_id) {
        const isLocation = locations?.data?.some(
          (item) => Number(item?.id) === Number(location_id),
        );
        if (!isLocation) {
          setLocationId(locations?.data[0]?.id);
        }
      } else {
        setLocationId(locations?.data[0]?.id);
      }
    }
  }, [location_id, locations]);

  const Content = () => {
    return (
      <div className="flex flex-col gap-y-2.5 shadow">
        <div
          className="p-2.5 flex items-center gap-x-[10px] cursor-pointer hover:text-blue-500"
          style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)" }}
          onClick={() => setIsForm(true)}
        >
          <PlusCircleOutlined className="w-5 h-5 text-blue-600" />
          <span>Tạo cửa hàng, doanh nghiệp mới</span>
        </div>
        <ul className="h-60 overflow-auto">
          {optionLocations.map((item) => (
            <li
              className={classNames(
                "p-2.5 flex gap-x-[5px] items-center hover:bg-blue-50 cursor-pointer",
                { "!bg-blue-200": item.value == location_id },
              )}
              onClick={() => {
                if (item.value == location_id) return;
                navigate(0);
                setLocationId(item.value as number);
              }}
            >
              <span className="mr-auto">{item.label}</span>
              {location_id == item.value && (
                <CheckSolid className="w-5 h-5 text-blue-700 stroke-2" />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const locationName = useMemo(() => {
    return locations?.data?.find((item) => item?.id == location_id);
  }, [locations, location_id]);

  return (
    <>
      <Popover
        content={<Content />}
        placement="bottom-start"
        className="p-0 border"
        showArrow={false}
        trigger="click"
      >
        <div className="xmd:flex hidden p-2 items-center gap-x-[5px] text-blue-600 cursor-pointer">
          <BuildingStorefrontOutlined className="w-5 h-5" />
          <div className="flex gap-x-[15px]">
            <span className="font-bold max-w-[150px] truncate">
              {locationName?.name}
            </span>
            <ChevronRightOutlined className="w-4 h-4" />
          </div>
        </div>
      </Popover>
      <ModalFormStore open={isForm} onCancel={() => setIsForm(false)} />
    </>
  );
});

export default UserCompany;
