import CustomTag from "@tera/components/web/CustomTag";
import HoverQuickView from "@tera/components/web/HoverQuickView";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import useQuickView from "@tera/states/hooks/useQuickView";
import { paymentMethod } from "@tera/components/shared/Accountant/constants/payment";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Description, formatCurrency, formatDate } from "tera-dls";
import DescriptionGeneral from "./components/DescriptionGeneral";
import DescriptionProduct from "./components/DescriptionProduct";
import Overview from "./components/Overview";
import SummaryOrder from "./components/Summary";

const SellOrder = ({ dataDetail }) => {
  const { quickView, redirectDetails } = useQuickView();

  const parent = get(dataDetail, "parent", {});
  const children = get(dataDetail, "children", []);
  const totalData = get(dataDetail, "final_total");

  const [discountValue, setDiscountValue] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const taxAmount = Number(get(dataDetail, "tax_amount", 0));
  const shippingAmount = Number(get(dataDetail, "shipping_charges", 0));
  const finalTotal = Number(get(dataDetail, "final_total", 0));

  useEffect(() => {
    if (!totalData) return;
    const discountType = get(dataDetail, "discount_type");
    const discountAmount = Number(get(dataDetail, "discount_amount", 0));
    const totalBeforeTax = Number(get(dataDetail, "total_before_tax", 0));

    let discountValue = discountAmount;

    if (discountType === "percentage") {
      discountValue = Number(totalBeforeTax) * (Number(discountAmount) / 100);
    }

    setTotalPrice(finalTotal - shippingAmount - taxAmount + discountValue);

    setDiscountValue(discountValue);
  }, [totalData]);

  const renderLinkRefNo = useMemo(() => {
    return [parent, ...children]
      .filter((item) => item?.invoice_no)
      .map((item) => {
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() =>
                quickView({
                  detail_type: item?.type,
                  detail_id: item?.id,
                  onView: () => redirectDetails(item?.type, item?.id),
                })
              }
            >
              {item?.invoice_no}
            </span>
          </>
        );
      });
  }, [parent, children]);

  const renderGeneral = [
    {
      title: "Khách hàng",
      value: (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() =>
            quickView({
              detail_type: "customer",
              detail_id: dataDetail?.contact?.id,
              onView: () =>
                redirectDetails("customer", dataDetail?.contact?.id),
            })
          }
        >
          {dataDetail?.contact?.business_name}
        </span>
      ),
    },
    {
      title: "Ngày tạo đơn",
      value: formatDate(dataDetail?.created_at, DATE_FORMAT),
    },
    {
      title: "Địa chỉ",
      value: dataDetail?.shipping_address,
    },
    {
      title: "Ngày đặt hàng",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
    {
      title: "Nhân viên bán hàng",
      value: (
        <HoverQuickView
          avatarUrl={dataDetail?.sales_person?.avatar_url}
          code={dataDetail?.sales_person?.code}
          email={dataDetail?.sales_person?.email}
          name={dataDetail?.sales_person?.full_name}
          phone={dataDetail?.sales_person?.phone}
          sub={dataDetail?.sales_person?.job_title_text}
        >
          {dataDetail?.sales_person?.full_name}
        </HoverQuickView>
      ),
    },
    {
      title: "Điện thoại",
      value: dataDetail?.service_custom_field_2,
    },
  ];

  const statusLength = dataDetail?.statuses?.length;

  return (
    <div className="space-y-6">
      <Overview
        statusNode={
          // <div className="flex gap-2">
          //   {dataDetail?.statuses.map((data, index) => {
          //     return (
          //       <CustomTag
          //         title={data?.title}
          //         color={data?.color}
          //         key={data?.id}
          //         index={index}
          //         showIndex={dataDetail?.statuses?.length > 1}
          //         wrapperClassName="inline-block w-auto shrink-0"
          //       />
          //     );
          //   })}
          // </div>
          <CustomTag
            title={dataDetail?.statuses?.[statusLength - 1]?.title}
            color={dataDetail?.statuses?.[statusLength - 1]?.color}
          />
        }
        businessName={dataDetail?.location?.name}
        invoiceNo={dataDetail?.invoice_no}
        reference={renderLinkRefNo}
      />

      <div className="space-y-6">
        <h3 className="text-gray-700 uppercase font-medium text-base text-center">
          ĐƠN BÁN HÀNG
        </h3>

        <DescriptionGeneral data={renderGeneral} />
        <DescriptionProduct data={dataDetail?.sell_lines} isImport={false} />
        <div className="divide-y border border-gray-200">
          <SummaryOrder label="Tạm tính">
            {formatCurrency(totalPrice)}
          </SummaryOrder>
          {taxAmount > 0 && (
            <SummaryOrder label="Thuế (VAT)">
              {formatCurrency(taxAmount)}
            </SummaryOrder>
          )}
          {discountValue > 0 && (
            <SummaryOrder label="Chiết khấu">
              {formatCurrency(discountValue)}
            </SummaryOrder>
          )}
          {shippingAmount > 0 && (
            <SummaryOrder label="Phí vận chuyển">
              {formatCurrency(shippingAmount)}
            </SummaryOrder>
          )}
          <SummaryOrder label="Lợi nhuận">
            {formatCurrency(get(dataDetail, "final_profit", 0))}
          </SummaryOrder>
          <SummaryOrder label="Thành tiền">
            {formatCurrency(finalTotal)}
          </SummaryOrder>
          {dataDetail?.payment_method && (
            <SummaryOrder label="Hình thức thanh toán">
              {paymentMethod[dataDetail?.payment_method]}
            </SummaryOrder>
          )}
        </div>

        <Description
          className="grid-cols-4"
          label="Ghi chú:"
          labelClassName="col-span-1 text-gray-800 font-medium"
          childrenClassName="text-gray-700 col-span-3"
        >
          {dataDetail?.staff_note}
        </Description>
      </div>
    </div>
  );
};
export default SellOrder;
