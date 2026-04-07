import { OptionProps, Select, SelectProps } from "tera-dls";
import SelectWrapper from ".";
import { forwardRef, useMemo, useState } from "react";

interface SelectDemoProps extends SelectProps {
  data?: any[];
}

const SelectDemo2 = ({ data, ...props }: SelectDemoProps, ref) => {
  const [dataSource, setDataSource] = useState(data || []);

  const options = useMemo((): OptionProps[] => {
    if (!dataSource) return [];
    const result = dataSource?.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));
    return result || [];
  }, [dataSource]);

  const handleReceiveData = (data) => {
    if (data) setDataSource(data?.data?.data);
  };

  return (
    <SelectWrapper
      onReceiveData={handleReceiveData}
      type="department"
      data={data}
    >
      <Select options={options} {...props} ref={ref} />
    </SelectWrapper>
  );
};

export default forwardRef(SelectDemo2);
