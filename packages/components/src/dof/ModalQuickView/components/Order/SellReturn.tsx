import { useQuery } from "@tanstack/react-query";
import CustomTag from "@tera/components/web/CustomTag";
import HoverQuickView from "@tera/components/web/HoverQuickView";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import { useStores } from "@tera/stores/useStores";
import useQuickView from "@tera/states/hooks/useQuickView";
import { toJS } from "mobx";
import { useMemo } from "react";
import EmployeeInfoApi from "@tera/api/EmployeeInfo";
import { Description, formatCurrency, formatDate } from "tera-dls";
import DescriptionGeneral from "./components/DescriptionGeneral";
import DescriptionProduct from "./components/DescriptionProduct";
import Overview from "./components/Overview";
import SummaryOrder from "./components/Summary";

const SellReturn = ({ dataDetail }) => {
  const children = dataDetail?.children || [];
  const parent = dataDetail?.parent || {};
  const {
    globalStore: { user },
    globalStore: { user: globalUser },
  } = useStores();
  const currentUser = globalUser || user;
  const userId = toJS(currentUser)?.id;

  const { quickView, redirectDetails } = useQuickView();

  const { data: infoEmployee } = useQuery({
    queryKey: ["get-info-employee", userId],
    queryFn: () => EmployeeInfoApi.getInfo({ user_id: userId }),
    staleTime: 300000,
    gcTime: 300000,
  });

  const renderLinkRefNo = useMemo(
    () =>
      [parent, ...children]
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
        }),
    [parent, children],
  );

  const renderGeneral = [
    {
      title: "Khách hàng",
      value: dataDetail?.contact?.name,
    },
    {
      title: "Ngày tạo đơn",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
    {
      title: "Số điện thoại",
      value: dataDetail?.service_custom_field_2,
    },
    {
      title: "Ngày trả hàng",
      value: formatDate(dataDetail?.transaction_date, DATE_FORMAT),
    },
    {
      title: "Nhân viên yêu cầu",
      value: (
        <HoverQuickView
          avatarUrl={infoEmployee?.avatar_url}
          code={infoEmployee?.code}
          email={infoEmployee?.email}
          name={infoEmployee?.full_name}
          phone={infoEmployee?.phone}
          sub={infoEmployee?.status_text?.title}
        >
          {infoEmployee?.full_name}
        </HoverQuickView>
      ),
    },
  ];

  const renderTransport = [
    {
      title: "Địa chỉ giao hàng",
      value: dataDetail?.shipping_address,
    },
    {
      title: "Ghi chú",
      value: dataDetail?.staff_note,
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
          ĐƠN TRẢ HÀNG BÁN
        </h3>

        <DescriptionGeneral data={renderGeneral} />
        <DescriptionProduct
          data={dataDetail?.purchase_lines}
          isImport={true}
          isPurchase={true}
        />
        <div className="divide-y border border-gray-200">
          <SummaryOrder label="Tổng">
            {formatCurrency(dataDetail?.final_total)}
          </SummaryOrder>
        </div>
        <div className="space-y-4">
          {renderTransport.map(({ title, value }) => (
            <Description
              className="grid-cols-4 mb-0"
              label={`${title}:`}
              labelClassName="col-span-1 text-gray-800 font-medium"
              childrenClassName="text-gray-700 col-span-3"
            >
              {value}
            </Description>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellReturn;
