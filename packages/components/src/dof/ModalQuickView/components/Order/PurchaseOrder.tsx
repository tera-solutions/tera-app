import HoverQuickView from "@tera/components/web/HoverQuickView";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import useQuickView from "@tera/states/hooks/useQuickView";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Description, formatCurrency, formatDate } from "tera-dls";
import DescriptionGeneral from "./components/DescriptionGeneral";
import CustomTag from "@tera/components/web/CustomTag";
import DescriptionProduct from "./components/DescriptionProduct";
import Overview from "./components/Overview";
import SummaryOrder from "./components/Summary";
import DescriptionProductMultipleContact from "./components/DescriptionProductMultipleContact";

const PurchaseOrder = ({ dataDetail }) => {
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { quickView, redirectDetails } = useQuickView();
  const taxAmount = Number(get(dataDetail, "tax_amount", 0));
  const parent = get(dataDetail, "parent", {});
  const renderLinkRefNo = useMemo(() => {
    return (
      <span
        className="text-blue-600 cursor-pointer"
        onClick={() =>
          quickView({
            detail_id: parent?.id,
            detail_type: parent?.type,
            onView: () => redirectDetails(parent?.type, parent?.id),
          })
        }
      >
        {parent?.invoice_no}
      </span>
    );
  }, [parent]);

  useEffect(() => {
    if (dataDetail?.final_total) {
      const discountType = dataDetail?.discount_type;
      const discountAmount = dataDetail?.discount_amount ?? 0;
      const totalBeforeTax = dataDetail?.total_before_tax ?? 0;

      const taxAmount = dataDetail?.tax_amount ?? 0;
      const finalTotal = dataDetail?.final_total ?? 0;

      let discountValue = discountAmount;

      if (discountType === "percentage") {
        discountValue = Number(totalBeforeTax) * (Number(discountAmount) / 100);
      }

      setTotalPrice(
        Number(finalTotal) - Number(taxAmount) + Number(discountValue),
      );

      setDiscountValue(discountValue);
    }
  }, [dataDetail?.final_total]);

  const renderGeneral = [
    {
      title: "Nhà cung cấp",
      value: (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() =>
            quickView({
              detail_id: dataDetail?.contact?.id,
              detail_type: "supplier",
              onView: () =>
                redirectDetails("supplier", dataDetail?.contact?.id),
            })
          }
        >
          {dataDetail?.contact?.business_name}
        </span>
      ),
    },
    {
      title: "Ngày tạo đơn",
      value: formatDate(dataDetail?.created_at, DATE_FORMAT),
    },
    {
      title: "Ngày yêu cầu",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
    {
      title: "",
      value: "",
    },
    {
      title: "Nhân viên yêu cầu",
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
          ĐƠN MUA HÀNG
        </h3>

        <DescriptionGeneral data={renderGeneral} />
        {dataDetail?.sub_type === "purchase" ? (
          <DescriptionProductMultipleContact
            data={dataDetail?.purchase_lines}
            isPurchase={true}
          />
        ) : (
          <DescriptionProduct
            data={dataDetail?.purchase_lines}
            isPurchase={true}
          />
        )}
        <div className="divide-y border border-gray-200">
          <SummaryOrder label="Tạm tính">
            {formatCurrency(totalPrice)}
          </SummaryOrder>
          <SummaryOrder label="Thuế (VAT)">
            {formatCurrency(taxAmount)}
          </SummaryOrder>
          <SummaryOrder label="Chiết khấu">
            {formatCurrency(discountValue)}
          </SummaryOrder>
          <SummaryOrder label="Thành tiền">
            {formatCurrency(dataDetail?.final_total)}
          </SummaryOrder>
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

export default PurchaseOrder;
