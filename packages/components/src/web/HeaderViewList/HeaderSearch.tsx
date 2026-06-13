import { useTranslation } from "react-i18next";
import Search from "@tera/components/dof/Control/Search";
import FormTera, {
  FormTeraItem,
  useFormTera,
} from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MagnifyingGlassOutlined, XMarkOutlined, getQueryParams } from "tera-dls";

interface IProps {
  placeholder?: string;
  onSearch: (val: any) => void;
}

function HeaderSearch({ onSearch, placeholder }: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [formRef] = useFormTera();

  const { search } = useLocation();
  const queryParams = getQueryParams(search) as any;

  const handleSearch = (value: any) => {
    onSearch(value);
    formRef?.current?.reset({ ...value }, { keepValues: true });
  };

  useEffect(() => {
    if (queryParams) {
      const values = _.pick(queryParams, ["keyword"]);
      formRef?.current?.reset({
        keyword: values?.keyword ?? "",
      });
    }
  }, [queryParams]);

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden xmd:block">
        <FormTera ref={formRef} onSubmit={handleSearch} isLoading={false}>
          <FormTeraItem className="!mb-0" name="keyword">
            <Search
              placeholder={placeholder || t("common.search_placeholder")}
              icon={<MagnifyingGlassOutlined />}
              className="w-[400px] rounded-[39px] py-[6px] pl-8"
            />
          </FormTeraItem>
        </FormTera>
      </div>

      {/* Mobile: icon button + expandable input below */}
      <div className="xmd:hidden flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors self-start"
        >
          {isOpen ? (
            <XMarkOutlined className="w-4 h-4" />
          ) : (
            <MagnifyingGlassOutlined className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">Lọc</span>
        </button>

        {isOpen && (
          <FormTera ref={formRef} onSubmit={handleSearch} isLoading={false}>
            <FormTeraItem className="!mb-0" name="keyword">
              <Search
                placeholder={placeholder || t("common.search_placeholder")}
                icon={<MagnifyingGlassOutlined />}
                className="w-full rounded-[39px] py-[6px] pl-8"
                autoFocus
              />
            </FormTeraItem>
          </FormTera>
        )}
      </div>
    </>
  );
}

export default HeaderSearch;
