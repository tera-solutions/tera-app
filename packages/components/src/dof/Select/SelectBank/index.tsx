import { forwardRef, useState } from "react";
import { AnyObject, OptionProps, SelectProps } from "tera-dls";
import { AdministratorApi } from "@tera/components/dof/_api";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import SelectEntity from "../SelectEntity";
import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
interface SelectConfigLeaveProps extends SelectProps {
  paramsApi?: AnyObject;
}

export type OptionsSelectBank = OptionProps & {
  image: string;
};

const SelectBank = forwardRef<HTMLInputElement, SelectConfigLeaveProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [keyword, setKeyword] = useState("");
    const search = useDebounce(keyword, 300);

    const { data: listBank } = useQueryLegacy({
      // 1. Query Key vẫn giữ nguyên là một mảng
      queryKey: ["get-bank-list", search, paramsApi],

      // 2. Query Fn phải là một hàm (v5 bắt buộc dùng thuộc tính queryFn)
      queryFn: () =>
        AdministratorApi.getListBank({
          keyword: search,
          ...paramsApi,
        }),

      // 3. Các Option cấu hình
      staleTime: 300000, // 5 phút
      gcTime: 300000, // v5 đổi cacheTime thành gcTime (Garbage Collection Time)
    });

    const optionsConfigLeave: OptionsSelectBank[] = listBank?.map((bank) => ({
      labelDisplay: (
        <div className="flex gap-2.5 items-center h-full">
          <img
            src={bank?.image_bank}
            className="w-[26px] h-[26px] rounded-[4px] p-[2px]"
          />
          <div className="flex flex-col justify-center text-xs line-clamp-1">
            <h3 className="font-semibold">{bank?.card_name}</h3>
            <p>{bank?.description}</p>
          </div>
        </div>
      ),
      label: bank?.card_name,
      value: bank?.id,
      image: bank?.image_bank,
    }));

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        placeholder={placeholder}
        options={optionsConfigLeave}
        searchValue={keyword}
        selectedValue={selectedValue}
        onSearch={setKeyword}
        {...props}
      />
    );
  },
);

export default SelectBank;
