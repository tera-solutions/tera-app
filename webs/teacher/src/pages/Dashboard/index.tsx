import DefaultImage from "@tera/components/web/DefaultImage";
import Icon from "@tera/components/web/Icon";
import {
  BTN_PRIMARY,
  BTN_PRIMARY_LIGHT,
  HEADING_CLASS_NAME,
  TITLE_CLASS_NAME,
} from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useNavigate } from "react-router-dom";
import ImageNonVerified from "@tera/themes/images/pages/dashboard/non-verified.png";
import ImageLevel1 from "@tera/themes/images/pages/package/level-1.png";
import { Button, Col, formatCurrency, formatNumber, Row } from "tera-dls";

const Dashboard = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <DefaultImage src={image} alt="image" className="rounded w-10 h-10" />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Số lượng bánh",
      dataIndex: "quantity",
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (revenue) => formatCurrency(revenue),
    },
  ];
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Bảng điều khiển</h1>
      <div className="flex flex-col gap-8">
        <Row className="grid-cols-4 gap-8">
          <div className="flex gap-2.5 justify-between p-6 rounded-xl bg-blue-100">
            <div>
              <p className="text-xl">Các sản phẩm</p>
              <p className="leading-[60px] text-[24px] text-gray-700">10</p>
            </div>
            <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
              <Icon.IconBox className="m-auto" />
            </div>
          </div>
          <div className="flex gap-2.5 justify-between p-6 rounded-xl bg-green-100">
            <div>
              <p className="text-xl">Tổng đơn hàng</p>
              <p className="leading-[60px] text-[24px] text-gray-700">10</p>
            </div>
            <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
              <Icon.IconDocument className="m-auto" />
            </div>
          </div>
          <div className="flex gap-2.5 justify-between p-6 rounded-xl bg-yellow-100">
            <div>
              <p className="text-xl">Xếp hạng</p>
              <p className="leading-[60px] text-[24px] text-gray-700">5</p>
            </div>
            <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
              <Icon.IconStar className="w-8 h-8 text-yellow-500 m-auto" />
            </div>
          </div>
          <div className="flex gap-2.5 justify-between p-6 rounded-xl bg-pink-100">
            <div>
              <p className="text-xl">Tổng doanh số </p>
              <p className="leading-[60px] text-[24px] text-gray-700">10 M</p>
            </div>
            <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
              <Icon.IconGrow className="w-8 h-8 text-pink-500 m-auto" />
            </div>
          </div>
        </Row>
        <div className="flex bg-gray-100 rounded-md px-6 py-5 gap-8">
          <div className="shrink-0">
            <p className="text-[#343C6A] text-3xl">Đơn hàng</p>
            <p className="font-light text-main">Tháng này </p>
          </div>
          <Row className="flex-1 grid-cols-4 gap-5">
            <Col className="flex items-center justify-center gap-5">
              <Icon.IconCartPlus />
              <div>
                <p className="font-light">Đơn hàng mới</p>
                <p className="text-main text-3xl">999</p>
              </div>
            </Col>
            <Col className="flex items-center justify-center gap-5">
              <Icon.IconDocumentX className="w-8 h-8" />
              <div>
                <p className="font-light">Đã hủy</p>
                <p className="text-main text-3xl">12</p>
              </div>
            </Col>
            <Col className="flex items-center justify-center gap-5">
              <Icon.IconTrunc className="w-8 h-8" />
              <div>
                <p className="font-light">Đang giao hàng</p>
                <p className="text-main text-3xl">60</p>
              </div>
            </Col>
            <Col className="flex items-center justify-center gap-5">
              <Icon.IconDocumentCheck className="w-8 h-8" />
              <div>
                <p className="font-light">Đã giao hàng </p>
                <p className="text-main text-3xl">98</p>
              </div>
            </Col>
          </Row>
        </div>
        <Row className="grid-cols-4 gap-8">
          <Col className="flex flex-col gap-8">
            <div className="p-4 rounded-md bg-gray-100">
              <p className={TITLE_CLASS_NAME}>Gói đã mua</p>
              <div className="flex items-center gap-8 mt-3">
                <img src={ImageLevel1} alt="level-1" />
                <div className="flex flex-col gap-2.5">
                  <p className="text-blue-500">
                    Gói hiện tại:{" "}
                    <span className="font-semibold">Shop Bạc</span>
                  </p>
                  <ul className="leading-5">
                    <li>Giới hạn Tải lên Sản phẩm: 50 lần</li>
                    <li>
                      Gói hết hạn vào lúc:{" "}
                      <span className="text-yellow-500">dd/mm/yyyy</span>
                    </li>
                  </ul>
                  <Button className={BTN_PRIMARY_LIGHT}>Gói nâng cấp</Button>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-md bg-gray-100 flex flex-col items-center">
              <img src={ImageNonVerified} alt="non-verified" />
              <Button className={BTN_PRIMARY}>Xác minh ngay</Button>
            </div>
          </Col>
          <Col className="shadow col-span-3 p-4 rounded-md h-full w-full bg-gradient-to-b from-[#C0F5FF4D] to-[#B2DAE600]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[#343C6A] font-light text-2xl">
                  Thống kê SL đơn hàng theo trạng thái đơn bán hàng
                </p>
                <p className="text-xs text-gray-500">dd/mm/yyyy - dd/mm/yyyy</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="grid-cols-4 gap-x-8">
          <Col className="py-8 px-7 flex flex-col gap-3 bg-indigo-100 rounded-md">
            <p className={TITLE_CLASS_NAME}>Số lượng đã bán</p>
            <div className="text-[#1B1B28]">
              <p>Số tiền đã bán của bạn (tháng hiện tại)</p>
              <p className="text-main text-2xl leading-[60px]">100 M</p>
            </div>
            <p className="text-[#1B1B28]">Tháng trước: 990,000 đ</p>
          </Col>
          <Row className="col-span-3 grid-cols-4 items-center gap-8">
            <Col className="p-6 rounded-md bg-blue-100 h-max flex flex-col items-center gap-3 cursor-pointer">
              <p className="font-light text-main text-2xl">Rút tiền</p>
              <Icon.IconTrashCurrency />
            </Col>
            <Col className="p-6 rounded-md bg-blue-100 h-max flex flex-col items-center gap-3 cursor-pointer">
              <p className="font-light text-main text-2xl">
                Thêm sản phẩm mới{" "}
              </p>
              <Icon.IconBoxThin />
            </Col>
            <Col className="p-6 rounded-md bg-blue-100 h-max flex flex-col items-center gap-3 cursor-pointer">
              <p className="font-light text-main text-2xl">Cài đặt cửa hàng</p>
              <Icon.IconStore />
            </Col>
            <Col className="p-6 rounded-md bg-blue-100 h-max flex flex-col items-center gap-3 cursor-pointer">
              <p className="font-light text-main text-2xl">
                Cài đặt thanh toán
              </p>
              <Icon.IconCreditCard />
            </Col>
          </Row>
        </Row>
        <Row className="grid-cols-4 gap-x-8">
          <Col className="py-8 px-7 flex flex-col gap-3 bg-indigo-100 rounded-md">
            <p className={TITLE_CLASS_NAME}>Top danh mục sản phẩm</p>
            <div className="mt-10 pr-1">
              <div className="flex justify-between items-center py-2.5 gap-2.5 [&:not(:last-child)]:border-b">
                <p>Tên danh mục sản phẩm</p>
                <p>5</p>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-2.5 [&:not(:last-child)]:border-b">
                <p>Tên danh mục sản phẩm</p>
                <p>5</p>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-2.5 [&:not(:last-child)]:border-b">
                <p>Tên danh mục sản phẩm</p>
                <p>5</p>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-2.5 [&:not(:last-child)]:border-b">
                <p>Tên danh mục sản phẩm</p>
                <p>5</p>
              </div>
            </div>
          </Col>
          <Col className="col-span-3 py-6 px-4 flex flex-col gap-3 bg-gray-100 rounded-md">
            <p className={TITLE_CLASS_NAME}>10 sản phẩm hàng đầu</p>
            <TableTera
              columns={columns}
              data={[
                {
                  image: "https://picsum.photos/200",
                  name: "Tên sản phẩm",
                  category: "Danh mục",
                  quantity: 100,
                  price: 100000,
                  revenue: 10000,
                },
                {
                  image: "https://picsum.photos/200",
                  name: "Tên sản phẩm",
                  category: "Danh mục",
                  quantity: 100,
                  price: 100000,
                  revenue: 10000,
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
