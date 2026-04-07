import DefaultImage from "@tera/components/web/DefaultImage";
import React, { useEffect, useState } from "react";
import {
  Badge,
  BellOutlined,
  Button,
  EnvelopeOutlined,
  MagnifyingGlassOutlined,
  Squares2x2Outlined,
  XCircleOutlined,
  getQueryParams,
} from "tera-dls";
import IconVN from "@tera/themes/images/Icons/vn.svg?react";
import FormTera, { FormTeraItem, useFormTera } from "@tera/components/dof/FormTera";
import { useLocation } from "react-router-dom";
import Search from "@tera/components/dof/Control/Search";
import _ from "lodash";

interface HeaderProps {
  content?: React.ReactNode;
  onSearch?: (value) => void;
  disabledLeftBar?: boolean;
}

function Header({ content, onSearch, disabledLeftBar = false }: HeaderProps) {
  const [formRef] = useFormTera();
  const [isShow, setIsShow] = useState<boolean>(false);

  const { search } = useLocation();
  const queryParams = getQueryParams(search) as any;

  const handleSearch = (value) => {
    onSearch(value);
    formRef?.current?.reset({ ...value }, { keepValues: true });
  };

  useEffect(() => {
    if (queryParams) {
      const values = _.pick(queryParams, ["keyword"]);

      formRef?.current?.reset({
        keyword: values?.keyword,
      });
    }
  }, [queryParams]);

  return (
    <div className="rounded flex items-center justify-between w-full">
      {content ? content : <div />}

      {!disabledLeftBar && (
        <div className="flex gap-x-2.5 items-center">
          <div className="flex gap-x-2 pr-2.5 border-r items-center">
            {isShow ? (
              <div className="flex items-center gap-x-2">
                <FormTera
                  ref={formRef}
                  onSubmit={handleSearch}
                  isLoading={false}
                >
                  <FormTeraItem className="!mb-0" name="keyword">
                    <Search
                      placeholder="Tìm kiếm"
                      icon={<MagnifyingGlassOutlined />}
                      className="h-[32px]"
                    />
                  </FormTeraItem>
                </FormTera>

                <XCircleOutlined
                  className="size-6 text-red-500 cursor-pointer"
                  onClick={() => setIsShow((prev) => !prev)}
                />
              </div>
            ) : (
              <MagnifyingGlassOutlined
                className="size-6 cursor-pointer text-[#6B7280]"
                onClick={() => setIsShow((prev) => !prev)}
              />
            )}

            <Badge
              count={0}
              showZero={false}
              overflowCount={99}
              className="size-[15px] flex justify-center items-center p-[3px] bg-red-400 text-white text-[8px] top-[3px] right-[5px]"
            >
              <span className="cursor-pointer">
                <BellOutlined className="size-6 text-[#6B7280]" />
              </span>
            </Badge>
          </div>
          <h2>Tên cửa hàng</h2>
          <DefaultImage alt="" src="" className="size-6 rounded-full" />
          <Squares2x2Outlined className="size-6 text-[#6B7280]" />
          <IconVN className="size-6" />
          <Button type="light" className="px-2.5 py-[5px] rounded-[3px]">
            <div className="flex items-center gap-x-1">
              <EnvelopeOutlined className="size-5 text-[#6B7280]" />
              <span className="text-[12px] text-gray-600">Góp ý</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
