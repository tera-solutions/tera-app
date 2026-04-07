import Search from "@tera/components/dof/Control/Search";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import SelectPrintCategoryType from "@tera/components/dof/Select/SelectTypeCategoryPrintKey";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Col, MagnifyingGlassOutlined, Row } from "tera-dls";

interface IHeader {
  onFilter: (values: any) => void;
  placeholder?: string;
}

function SelectContactModalHeader({
  onFilter,
  placeholder = "Tìm kiếm theo mã, tên từ khoá",
}: IHeader) {
  const [selectCategory, setSelectCategory] = useState(null);
  const [keyword, setKeyword] = useState("");
  const form = useForm();

  const { handleSubmit } = form;

  const handleSearch = ({ keyword }) => {
    setKeyword(keyword);
  };

  useEffect(() => {
    onFilter({ keyword, type: selectCategory?.value });
  }, [keyword, selectCategory]);

  return (
    <div className="w-full">
      <FormTera form={form} onSubmit={handleSubmit(handleSearch)}>
        <Row className="grid-cols-3">
          <Col>
            <FormTeraItem name="keyword" className="mb-0">
              <Search
                placeholder={placeholder}
                icon={<MagnifyingGlassOutlined />}
                className="w-full"
              />
            </FormTeraItem>
          </Col>
          <Col />
          <Col>
            <FormTeraItem name="category_type_id">
              <SelectPrintCategoryType
                selectedValue={selectCategory}
                onChangeCustom={(selectedValue) =>
                  setSelectCategory(selectedValue)
                }
              />
            </FormTeraItem>
          </Col>
        </Row>
      </FormTera>
    </div>
  );
}

export default SelectContactModalHeader;
