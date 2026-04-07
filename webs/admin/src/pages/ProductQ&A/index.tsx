import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import { TabItemType, Tabs, Toggle } from "tera-dls";
import ProductQAFilter from "./containers/Filter";

const ProductQAPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "name",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
    },
    {
      title: "Câu trả lời",
      dataIndex: "answer",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => <Toggle checked={value} />,
    },
  ];

  const items: TabItemType[] = [
    {
      key: "1",
      label: "Tất cả",
    },
    {
      key: "2",
      label: "Chờ duyệt",
    },
    {
      key: "3",
      label: "Đã duyệt",
    },
    {
      key: "4",
      label: "Từ chối",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Hỏi đáp sản phẩm</h1>
      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm tên khách hàng, tên sản phẩm"
          />
        }
        bottomContent={<Tabs items={items} className="mb-0" />}
      >
        <TableTera
          columns={columns}
          data={[
            {
              name: "Tên tài khoản",
              product: "Tên sản phẩm",
              question: "Câu hỏi",
              answer: "Câu trả lời",
              status: true,
            },
            {
              name: "Tên tài khoản",
              product: "Tên sản phẩm",
              question: "Câu hỏi",
              answer: "Câu trả lời",
              status: false,
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <ProductQAFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default ProductQAPage;
