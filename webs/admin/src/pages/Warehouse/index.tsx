import {
  BTN_PRIMARY,
  BTN_PRIMARY_LIGHT,
  HEADING_CLASS_NAME,
} from "@tera/commons/constants/common";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import {
  Button,
  Col,
  formatCurrency,
  PlusSolid,
  Row,
  TrashOutlined,
} from "tera-dls";

const WarehousePage = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Kho sản phẩm</h1>
      <div className="grid grid-cols-5 h-[calc(100vh-156px)] overflow-hidden">
        <div className="col-span-3 overflow-hidden flex flex-col p-1">
          <FormTera className="grid grid-cols-4 gap-2.5 items-center">
            <FormTeraItem name="keyword" className="col-span-2">
              <Input placeholder="Tìm kiếm theo Tên sản phẩm / Mã vạch" />
            </FormTeraItem>
            <FormTeraItem name="category">
              <Select placeholder="Tất cả danh mục" allowClear />
            </FormTeraItem>
            <FormTeraItem name="brand">
              <Select placeholder="Tất cả thương hiệu" allowClear />
            </FormTeraItem>
          </FormTera>

          <div className="grid grid-cols-4 gap-4 w-[90%] m-auto overflow-auto flex-1 pr-1">
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
            <div className="group relative border rounded-md">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-full aspect-square rounded-t-md"
              />
              <div className="p-4 pt-8 flex flex-col gap-2">
                <p className="text-gray-700">Tên sản phẩm</p>
                <p>{formatCurrency(100000)}</p>
              </div>
              <div className="absolute p-2.5 rounded-md bg-green-400 text-white top-[10px] left-[10px]">
                Trong kho : 9999
              </div>
              <div className="absolute hidden group-hover:flex w-full h-full inset-0 cursor-pointer bg-black/50 rounded-md">
                <PlusSolid className="w-10 h-10 text-white m-auto" />
              </div>
            </div>
          </div>
        </div>
        <Col className="col-span-2 flex flex-col p-1">
          <div className="border rounded p-4 overflow-auto flex-1">
            <div className="p-2.5 flex items-start justify-between [&:not(:last-child)]:border-b">
              <p className="line-clamp-2 break-word leading-5">
                Tên sản phẩm 2 dòng Tên sản phẩm 2 dòngTên sản phẩm 2 dòngTên
                sản phẩm 2 dòngTên sản phẩm 2 dòngTên sản phẩm 2 dòng ...
              </p>
              <div className="flex gap-4 items-center shrink-0">
                <p className="text-base text-main">{formatCurrency(100000)}</p>
                <TrashOutlined className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="p-2.5 flex items-start justify-between [&:not(:last-child)]:border-b">
              <p className="line-clamp-2 break-word leading-5">
                Tên sản phẩm 2 dòng Tên sản phẩm 2 dòngTên sản phẩm 2 dòngTên
                sản phẩm 2 dòngTên sản phẩm 2 dòngTên sản phẩm 2 dòng ...
              </p>
              <div className="flex gap-4 items-center shrink-0">
                <p className="text-base text-main">{formatCurrency(100000)}</p>
                <TrashOutlined className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="p-2.5 flex items-start justify-between [&:not(:last-child)]:border-b">
              <p className="line-clamp-2 break-word leading-5">
                Tên sản phẩm 2 dòng Tên sản phẩm 2 dòngTên sản phẩm 2 dòngTên
                sản phẩm 2 dòngTên sản phẩm 2 dòngTên sản phẩm 2 dòng ...
              </p>
              <div className="flex gap-4 items-center shrink-0">
                <p className="text-base text-main">{formatCurrency(100000)}</p>
                <TrashOutlined className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
          <Row className="grid-cols-2 gap-4 mt-4 shrink-0">
            <Button className={classNames(BTN_PRIMARY_LIGHT, "w-full py-4")}>
              Thêm tất cả vào sản phẩm của tôi
            </Button>
            <Button className={classNames(BTN_PRIMARY, "w-full py-4")}>
              Thêm vào sản phẩm của tôi
            </Button>
          </Row>
        </Col>
      </div>
    </div>
  );
};

export default WarehousePage;
