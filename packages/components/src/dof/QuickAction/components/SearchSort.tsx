import Search from "@tera/components/dof/Control/Search";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { FormTeraRefProps } from "@tera/components/dof/FormTera/_interfaces";
import { useEffect, useRef } from "react";
import {
  AdjustmentsHorizontalOutlined,
  Button,
  Dropdown,
  DropdownItem,
} from "tera-dls";

type ISearchSort = {
  keyword?: string;
};
type SearchSortProps = {
  isShowSort?: boolean;
  handleSearchSort?: (value: ISearchSort) => void;
  placeholder?: string;
  keyword?: string;
};
const SearchSort = ({
  handleSearchSort,
  isShowSort,
  placeholder,
  keyword,
}: SearchSortProps) => {
  const ref = useRef<FormTeraRefProps>();
  const dropdownItems: DropdownItem[] = [
    { key: "asc", label: "A - Z" },
    { key: "desc", label: "Z - A" },
    { key: "oldest", label: "Cũ nhất" },
    { key: "latest", label: "Mới nhất" },
  ];
  const handleSearch = (value) => {
    handleSearchSort({ keyword: value.keyword });
  };

  useEffect(() => {
    ref.current.setValue("keyword", keyword);
  }, [keyword]);

  return (
    <div className="flex items-center justify-between gap-2.5">
      <FormTera onSubmit={handleSearch} className="w-full" ref={ref}>
        <FormTeraItem name="keyword" className="mb-0">
          <Search className="rounded-[39px]" placeholder={placeholder} />
        </FormTeraItem>
      </FormTera>
      {isShowSort && (
        <Dropdown menu={{ items: dropdownItems }} trigger="click">
          <Button type="alternative" className="rounded-xsm bg-blue-50">
            <AdjustmentsHorizontalOutlined className="text-gray-500 shrink-0 w-4 h-4" />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default SearchSort;
