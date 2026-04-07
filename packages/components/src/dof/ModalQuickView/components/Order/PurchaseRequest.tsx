import HoverQuickView from "@tera/components/web/HoverQuickView";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import useQuickView from "@tera/states/hooks/useQuickView";
import { Description, formatCurrency, formatDate } from "tera-dls";
import DescriptionGeneral from "./components/DescriptionGeneral";
import DescriptionProduct from "./components/DescriptionProduct";
import Overview from "./components/Overview";
import SummaryOrder from "./components/Summary";
import CustomTag from "@tera/components/web/CustomTag";

function PurchaseRequest({ dataDetail }) {
  const children = dataDetail?.children || [];
  const parent = dataDetail?.parent || {};

  const { quickView, redirectDetails } = useQuickView();

  const renderGeneral = [
    {
      title: "Ngày yêu cầu",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
    {
      title: "Ngày tạo đơn",
      value: formatDate(dataDetail?.created_at, DATE_FORMAT),
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
    {
      title: "Ngày yêu cầu mua hàng",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
  ];

  const statusLength = dataDetail?.statuses?.length;

  return (
    <div className="space-y-6">
      <Overview
        statusNode={
          <CustomTag
            title={dataDetail?.statuses?.[statusLength - 1]?.title}
            color={dataDetail?.statuses?.[statusLength - 1]?.color}
          />
        }
        businessName={dataDetail?.location?.name}
        invoiceNo={dataDetail?.invoice_no}
        reference={[parent, ...children]
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
          })}
      />

      <div className="space-y-6">
        <h3 className="text-gray-700 uppercase font-medium text-base text-center">
          YÊU CẦU MUA HÀNG
        </h3>

        <DescriptionGeneral data={renderGeneral} />
        <DescriptionProduct
          data={dataDetail?.purchase_lines}
          disableQuantitySold={true}
          isPurchase={true}
        />
        <div className="divide-y border border-gray-200">
          <SummaryOrder label="Tổng">
            {formatCurrency(dataDetail?.final_total)}
          </SummaryOrder>
          <SummaryOrder label="Thuế (VAT)">{0} %</SummaryOrder>
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
}

export default PurchaseRequest;
