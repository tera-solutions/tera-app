import { BTN_PRIMARY, HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import classNames from "classnames";
import ImageLevel1 from "@tera/themes/images/pages/package/level-1.png";
import ImageLevel2 from "@tera/themes/images/pages/package/level-2.png";
import ImageLevel3 from "@tera/themes/images/pages/package/level-3.png";
import { Button, CheckOutlined, Row } from "tera-dls";

const PackageListPage = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Danh sách gói cửa hàng</h1>
      <h2 className="font-bold text-center text-4xl mb-10">
        Gói cao cấp dành cho người bán
      </h2>
      <Row className="grid-cols-3 w-2/3 m-auto gap-16">
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-blue-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageLevel1} alt="level-1" />
            <p className="text-xl text-gray-700">Shop bạc</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                100 Giới hạn Tải lên Sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Lợi nhuận tối đa 18%
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">Miễn phí</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>365</p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>
            Gói miễn phí
          </Button>
        </div>
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-yellow-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageLevel2} alt="level-2" />

            <p className="text-xl text-gray-700">Shop Vàng</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                150 Giới hạn Tải lên Sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Lợi nhuận tối đa 25%
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">398 k</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>365</p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>Mua gói</Button>
        </div>
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-purple-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageLevel3} alt="level-3" />

            <p className="text-xl text-gray-700">Shop Kim Cương</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                1000 Giới hạn Tải lên Sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Lợi nhuận tối đa 30%
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">698 k</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>365</p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>Mua gói</Button>
        </div>
      </Row>
    </div>
  );
};

export default PackageListPage;
