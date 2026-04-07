import InputNumber from "@tera/components/dof/Control/InputNumber";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

interface IProps {
  total: number;
  page?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  maxPage?: number;
}

const PaginationShort = (props: IProps) => {
  const form = useForm({ defaultValues: { current_page: 1 } });
  const { handleSubmit, setValue } = form;
  const { page, pageSize, onChange, maxPage } = props;

  const handleSubmitForm = (values) => {
    onChange(values?.current_page, pageSize);
  };

  useEffect(() => {
    setValue("current_page", page);
  }, [page]);

  const handleNext = useCallback(
    _.debounce(() => {
      if (page + 1 > maxPage) return;
      onChange(page + 1, pageSize);
    }, 200),
    [page, maxPage, pageSize],
  );

  const handlePrevious = useCallback(
    _.debounce(() => {
      if (page === 1) return;
      onChange(page - 1, pageSize);
    }, 200),
    [page, pageSize],
  );

  const isFirstPage = page === 1;
  const isLastPage = page + 1 > maxPage;

  return (
    <div className="flex justify-between items-center p-2 bg-white">
      <div className="flex gap-2.5 items-center">
        <ChevronLeftOutlined
          className={`w-5 h-5  ${
            isFirstPage ? "cursor-not-allowed text-gray-300" : "cursor-pointer"
          }`}
          onClick={handlePrevious}
        />
        <FormTera
          form={form}
          onSubmit={handleSubmit(handleSubmitForm)}
          className="h-full"
        >
          <FormTeraItem className="!mb-0 flex-1" name="current_page">
            <InputNumber
              onBlur={handleSubmit(handleSubmitForm)}
              placeholder=""
              min={1}
              max={maxPage}
              className="grid place-items-center py-[5px] px-2.5 border w-12 text-center"
              allowStepHandler={false}
            />
          </FormTeraItem>
        </FormTera>
        <ChevronRightOutlined
          className={`w-5 h-5  ${
            isLastPage ? "cursor-not-allowed text-gray-300" : "cursor-pointer"
          }`}
          onClick={handleNext}
        />
      </div>
      <div className="pr-2">
        Hiển thị {page} của {maxPage}
      </div>
    </div>
  );
};

export default PaginationShort;
