import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Select,
  DatePicker,
  ArrowTrendingUpOutlined,
  formatCurrency,
} from "tera-dls";
import img_tear from "@tera/themes/images/Affiliates/tear.png";
import { formatNumber } from "@tera/commons/utils";
import customTwMerge from "tailwind-merge.config";

interface IForm {
  compare: string;
  date: any;
}

interface IGridBoxProps {
  classNameProp?: string;
  value?: any;
}

const GridBox = ({ classNameProp, value }: IGridBoxProps) => {
  const form = useForm<IForm>({
    mode: "onChange",
  });

  const handleSubmitForm = (values: IForm) => {
    console.log("values", values);
  };

  return (
    <FormTera className="w-full" form={form} onSubmit={handleSubmitForm}>
      <div
        className="rounded-[16px] over-view-sell box-shadow-custom h-[350px] max-h-[350px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.00) 0%, #90EBFF 100%), linear-gradient(90deg, #FFF 0%, #2252CD 100%)",
        }}
      >
        <Row className="grid-cols-2 py-5 px-8 flex items-center justify-between">
          <Col className="text-[#374151] text-[24px] font-medium">
            Chỉ số tiếp thị
          </Col>
          <Col className="flex gap-2.5">
            <FormTeraItem name="compare">
              <Select
                className="w-[200px] h-[36px] rounded-[60px] border-gray-200 border-[1px] text-gray-400 hover:border-gray-200 focus:shadow-none focus:border-none"
                placeholder="So sánh với"
                options={[]}
              />
            </FormTeraItem>
            <FormTeraItem name="date">
              <DatePicker />
            </FormTeraItem>
          </Col>
        </Row>
        <Row className="grid-cols-4 px-8 py-9">
          <Col
            className={customTwMerge(
              "relative border-line",
              classNameProp ? classNameProp : "py-10 px-24 ",
            )}
          >
            <img
              className={customTwMerge(
                "tear-custom",
                classNameProp && "right-[35px]",
              )}
              src={img_tear}
              alt="tear-custom"
            />
            <div className="text-[#374151] box-content">
              <div className="text-[40px] font-bold pb-[60px] text-center">
                {formatNumber(value?.totalClick ?? 0)} +
              </div>
              <div className="flex justify-between">
                <span className="text-[16px]">Click</span>
                <span className="flex text-[24px]">
                  <ArrowTrendingUpOutlined className="text-green-600 w-[20px] h-[20px]" />{" "}
                  10%
                </span>
              </div>
            </div>
          </Col>
          <Col
            className={customTwMerge(
              "relative border-line",
              classNameProp ? classNameProp : "py-10 px-24 ",
            )}
          >
            <img
              className={customTwMerge(
                "tear-custom",
                classNameProp && "right-[35px]",
              )}
              src={img_tear}
              alt="tear-custom"
            />
            <div className="text-[#374151] box-content">
              <div className="text-[40px] font-bold pb-[60px] text-center">
                {formatNumber(value?.subscribers ?? 0)} +
              </div>
              <div className="flex justify-between">
                <span className="text-[16px]">Người đăng ký</span>
                <span className="flex text-[24px]">
                  <ArrowTrendingUpOutlined className="text-green-600 w-[20px] h-[20px]" />{" "}
                  10%
                </span>
              </div>
            </div>
          </Col>
          <Col
            className={customTwMerge(
              "relative border-line",
              classNameProp ? classNameProp : "py-10 px-24 ",
            )}
          >
            <img
              className={customTwMerge(
                "tear-custom",
                classNameProp && "right-[35px]",
              )}
              src={img_tear}
              alt="tear-custom"
            />
            <div className="text-[#374151] box-content">
              <div className="text-[40px] font-bold pb-[60px] text-center">
                {value?.conversionRate ?? 0} %
              </div>
              <div className="flex justify-between">
                <span className="text-[16px]">Chuyển đổi</span>
                <span className="flex text-[24px]">
                  <ArrowTrendingUpOutlined className="text-green-600 w-[20px] h-[20px]" />{" "}
                  10%
                </span>
              </div>
            </div>
          </Col>
          <Col
            className={customTwMerge(
              "relative",
              classNameProp ? classNameProp : "py-10 px-24 ",
            )}
          >
            <img
              className={customTwMerge(
                "tear-custom",
                classNameProp && "right-[35px]",
              )}
              src={img_tear}
              alt="tear-custom"
            />
            <div className="text-[#374151] box-content">
              <div className="text-[40px] font-bold pb-[60px] text-center">
                {formatCurrency(value?.payouts ?? 0)}
              </div>
              <div className="flex justify-between">
                <span className="text-[16px]">Payout</span>
                <span className="flex text-[24px]">
                  <ArrowTrendingUpOutlined className="text-green-600 w-[20px] h-[20px]" />{" "}
                  10%
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </FormTera>
  );
};

export default GridBox;
