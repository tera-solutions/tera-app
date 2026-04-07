import HeaderViewList from "@tera/components/web/HeaderViewList";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import ProductReviewFilter from "./containers/Filter";
import SearchTable from "@tera/components/web/SearchTable";
import { formatDate } from "tera-dls";
import { renderRating } from "@tera/commons/utils/utils";

const ProductReviewPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (value) => renderRating(value),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (value) => formatDate(value),
    },
  ];
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Đánh giá sản phẩm</h1>

      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm sản phẩm"
          />
        }
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              name: "Tên sản phẩm",
              customer: "Khách hàng",
              rating: 5,
              comment: "Bình luận",
              created_at: "01/01/2025",
            },
            {
              id: 2,
              name: "Tên sản phẩm",
              customer: "Khách hàng",
              rating: 4,
              comment: "Bình luận",
              created_at: "01/01/2025",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <ProductReviewFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default ProductReviewPage;
