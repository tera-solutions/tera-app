import { useQuery } from "@tanstack/react-query";
import { OptionProps } from "tera-dls";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";

type TAddress = "city" | "district" | "ward";

interface SelectAddressProps {
  id: number | null;
  type: TAddress;
  [key: string]: any;
}

function SelectAddress({ id, type, ...props }: SelectAddressProps) {
  const { data } = useQuery({
    queryKey: [`get-list-${type}`, id],

    queryFn: () => {
      const params = {
        limit: 100,
      };
      switch (type) {
        case "city":
          return HrmApi.getListCity(params);
        case "district":
          return HrmApi.getListDistrict(id, params);
        case "ward":
          return HrmApi.getListWard(id, params);
      }
    },

    staleTime: 300000,
    gcTime: 300000,
  });

  const optionsAddress: OptionProps[] =
    data?.data?.map((address) => ({
      value: address?.id?.toString(),
      label: address?.name,
    })) ?? [];

  return <SelectEntity options={optionsAddress} {...props} />;
}

export default SelectAddress;
