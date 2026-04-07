import Search from '@tera/components/dof/Control/Search';
import FormTera, { FormTeraItem, useFormTera } from '@tera/components/dof/FormTera';
import _ from 'lodash';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MagnifyingGlassOutlined, SearchProps, getQueryParams } from 'tera-dls';
interface SearchTableProps extends SearchProps {
  onSearch: (value) => void;
}
function SearchTable({ onSearch, ...props }: SearchTableProps) {
  const [formRef] = useFormTera();

  const { search } = useLocation();
  const queryParams = getQueryParams(search) as any;

  const handleSearch = (value) => {
    if (formRef?.current?.isDirty) {
      onSearch(value);
      formRef?.current?.reset({ ...value }, { keepValues: true });
    }
  };

  useEffect(() => {
    if (queryParams) {
      const values = _.pick(queryParams, ['keyword']);

      formRef?.current?.reset({
        keyword: values?.keyword,
      });
    }
  }, [queryParams]);

  return (
    <FormTera ref={formRef} onSubmit={handleSearch} isLoading={false}>
      <FormTeraItem className="!mb-0" name="keyword">
        <Search
          placeholder="Tìm kiếm"
          icon={<MagnifyingGlassOutlined />}
          className="!py-[6px]"
          {...props}
        />
      </FormTeraItem>
    </FormTera>
  );
}

export default SearchTable;
