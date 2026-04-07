import { BTN_PRIMARY, HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import classNames from "classnames";
import ImageOffSite from "@tera/themes/images/pages/advertising/off-site.png";
import ImageOverseas from "@tera/themes/images/pages/advertising/overseas.png";
import ImageStandard from "@tera/themes/images/pages/advertising/standard.png";
import { Button, CheckOutlined, Row } from "tera-dls";

const AdvertisingPackageListPage = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Danh sách gói cửa hàng</h1>
      <h2 className="font-bold text-center text-4xl mb-10">
        Gói cao cấp dành cho người bán
      </h2>
      <Row className="grid-cols-3 w-2/3 m-auto gap-16">
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-blue-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageStandard} alt="level-1" />

            <p className="text-xl text-gray-700">Standard promotion</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                10 Giới hạn chênh lệch sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Quảng cáo tối đa sản phẩm, trung tâm thương mại sẽ thúc đẩy cửa
                hàng của bạn, tăng mức tiếp cận của cửa hàng và thúc đẩy thời
                gian giới thiệu: 1 ngày lợi nhuận ước tính : 100 USD trở lên.
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">199k</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>7</p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>
            Gói miễn phí
          </Button>
        </div>
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-yellow-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageOverseas} alt="level-2" />

            <p className="text-xl text-gray-700">Overseas promotion</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                50 Giới hạn chênh lệch sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Quảng cáo tối đa sản phẩm, trung tâm thương mại sẽ thúc đẩy cửa
                hàng của bạn, tăng mức tiếp cận của cửa hàng và thúc đẩy thời
                gian giới thiệu: 1 ngày lợi nhuận ước tính : 100 USD trở lên.
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">666 k</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>30 </p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>Mua gói</Button>
        </div>
        <div className="flex flex-col gap-10 items-center py-8 px-4 rounded-xl bg-purple-100">
          <div className="flex flex-col gap-8 items-center">
            <img src={ImageOffSite} alt="level-3" />

            <p className="text-xl text-gray-700">Off-site promotion</p>
          </div>
          <ul className="w-full">
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                100 Giới hạn chênh lệch sản phẩm
              </span>
            </li>
            <li className="flex items-start gap-2.5 py-2">
              <CheckOutlined className="text-green-500 w-5 h-5 shrink-0" />
              <span className="text-gray-700 text-base">
                Quảng cáo tối đa sản phẩm, trung tâm thương mại sẽ thúc đẩy cửa
                hàng của bạn, tăng mức tiếp cận của cửa hàng và thúc đẩy thời
                gian giới thiệu: 1 ngày lợi nhuận ước tính : 150 USD trở lên.
              </span>
            </li>
          </ul>
          <div className="w-full flex items-center gap-4 justify-center">
            <p className="text-4xl text-gray-800 ">698 k</p>
            <div className="border-l border-gray-500 text-gray-500 pl-4">
              <p>30</p>
              <p>ngày</p>
            </div>
          </div>
          <Button className={classNames(BTN_PRIMARY, "mt-10")}>Mua gói</Button>
        </div>
      </Row>
    </div>
  );
};

export default AdvertisingPackageListPage;
