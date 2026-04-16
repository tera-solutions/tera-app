import { useTranslation } from "react-i18next";
import Search from "@tera/components/dof/Control/Search";
import FormTera, {
  FormTeraItem,
  useFormTera,
} from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MagnifyingGlassOutlined, getQueryParams } from "tera-dls";

interface IProps {
  placeholder?: string;
  onSearch: (val: any) => void;
}

function HeaderSearch({ onSearch, placeholder }: IProps) {
  const { t } = useTranslation();

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
    <FormTera ref={formRef} onSubmit={handleSearch} isLoading={false}>
      <FormTeraItem className="!mb-0" name="keyword">
        <Search
          placeholder={placeholder || t("common.search_placeholder")}
          icon={<MagnifyingGlassOutlined />}
          className="w-[400px] rounded-[39px] py-[6px] pl-8"
        />
      </FormTeraItem>
    </FormTera>
  );
}

export default HeaderSearch;
