import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { BTN_PRIMARY, HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import classNames from "classnames";
import {
  BuildingOffice2Outlined,
  Button,
  Col,
  CubeOutlined,
  CurrencyDollarOutlined,
  DatePicker,
  DocumentOutlined,
  formatCurrency,
  Input,
  Row,
  UserOutlined,
} from "tera-dls";

const LinkSystemPage = () => {
  const columns_1 = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
    },
    {
      title: "Số đơn hàng",
      dataIndex: "quantity",
    },
    {
      title: "Số tiền môi giới",
      dataIndex: "currency",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Mức độ",
      dataIndex: "level",
    },
  ];

  const columns_2 = [
    {
      title: "Người dùng giới thiệu",
      dataIndex: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
    },
    {
      title: "Loại giới thiệu",
      dataIndex: "recommend",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
    },
    {
      title: "Ngày",
      dataIndex: "date",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Hệ thống liên kết</h1>
      <div className="flex flex-col gap-6">
        <Row className="grid-cols-4 items-center gap-8">
          <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-blue-100">
            <div>
              <p className="text-xl">Số dư chi nhánh</p>
              <p className="leading-[60px] text-[24px] text-gray-700">10</p>
            </div>
            <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
              <BuildingOffice2Outlined className="w-8 h-8 text-blue-500 m-auto" />
            </div>
          </Col>
          <Col className="col-span-3 flex gap-6">
            <Input
              disabled
              value="https://www.selling-ppdholding.vn/shops/create?invitation_code=2041"
            />
            <Button className={classNames(BTN_PRIMARY, "shrink-0")}>
              Sao chép liên kết
            </Button>
          </Col>
        </Row>
        <Row className="rounded-md shadow">
          <div className="px-6 py-2.5 border-b flex justify-between items-center">
            <h2 className="text-base text-main">
              Số liệu thống kê về đơn vị liên kết
            </h2>
            <DatePicker className="w-[200px]" />
          </div>
          <Row className="p-4 grid-cols-4 gap-8">
            <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-blue-100">
              <div>
                <p className="text-xl">Người bán</p>
                <p className="leading-[60px] text-[24px] text-gray-700">10</p>
              </div>
              <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
                <UserOutlined className="w-8 h-8 text-blue-500 m-auto" />
              </div>
            </Col>
            <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-green-100">
              <div>
                <p className="text-xl">Tổng số đơn đặt hàng</p>
                <p className="leading-[60px] text-[24px] text-gray-700">10</p>
              </div>
              <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
                <CubeOutlined className="w-8 h-8 text-green-500 m-auto" />
              </div>
            </Col>
            <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-yellow-100">
              <div>
                <p className="text-xl">Tổng cộng</p>
                <p className="leading-[60px] text-[24px] text-gray-700">10</p>
              </div>
              <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
                <CurrencyDollarOutlined className="w-8 h-8 text-yellow-500 m-auto" />
              </div>
            </Col>
            <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-pink-100">
              <div>
                <p className="text-xl">Tổng môi giới</p>
                <p className="leading-[60px] text-[24px] text-gray-700">10</p>
              </div>
              <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
                <DocumentOutlined className="w-8 h-8 text-pink-500 m-auto" />
              </div>
            </Col>
          </Row>
        </Row>
        <HeaderViewList
          actionLeftRender={
            <SearchTable
              placeholder="Tìm kiếm tên cửa hàng"
              onSearch={() => console.log()}
            />
          }
          onClickFilter={() => console.log()}
        >
          <TableTera
            data={[
              {
                id: 1,
                name: "Tên cửa hàng",
                quantity: 900,
                currency: 100000,
                level: "Cao",
              },
              {
                id: 2,
                name: "Tên cửa hàng",
                quantity: 900,
                currency: 100000,
                level: "Cao",
              },
            ]}
            columns={columns_1}
          />
        </HeaderViewList>
        <div>
          <HeaderViewList
            actionLeftRender={
              <SearchTable
                placeholder="Tìm kiếm tên người dùng, mã ĐH, tên sản phẩm"
                onSearch={() => console.log()}
              />
            }
            onClickFilter={() => console.log()}
          >
            <TableTera
              data={[
                {
                  id: 1,
                  name: "Tên người dùng",
                  quantity: 100,
                  code: "HD_4532",
                  recommend: "Mua hàng",
                  product: "Tên sản phẩm",
                  date: "01/01/2025",
                },
                {
                  id: 2,
                  name: "Tên người dùng",
                  quantity: 100,
                  code: "HD_4532",
                  recommend: "Mua hàng",
                  product: "Tên sản phẩm",
                  date: "01/01/2025",
                },
              ]}
              columns={columns_2}
            />
          </HeaderViewList>
        </div>
      </div>
    </div>
  );
};

export default LinkSystemPage;
