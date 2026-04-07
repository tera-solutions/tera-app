import HoverQuickView from "@tera/components/web/HoverQuickView";
import { DATE_TIME_FORMAT } from "@tera/commons/constants/common";
import { Description, formatDate, Image, Row } from "tera-dls";

function Customer({ data }) {
  const info = [
    {
      title: "Mã khách hàng",
      value: <span className="text-green-500">{data?.code}</span>,
    },
    {
      title: "Tên khách hàng",
      value: data?.business_name,
    },
    {
      title: "Tên viết tắt",
      value: data?.abbreviated,
    },
    {
      title: "Phân loại",
      value: data?.customer_type_text?.title,
    },
    {
      title: "Đối tượng",
      value: data?.object_text?.title,
    },
    {
      title: "Số điện thoại",
      value: data?.phone,
    },
    {
      title: "Email",
      value: data?.email,
    },

    {
      title: "Ngày thành lập / Ngày sinh",
      value: data?.founding && formatDate(data?.founding, DATE_TIME_FORMAT),
    },

    {
      title: "Nhân viên phụ trách",
      value: (
        <HoverQuickView
          avatarUrl={data?.staff?.avatar_url}
          email={data?.staff?.email}
          code={data?.staff?.code}
          name={data?.staff?.full_name}
        >
          {data?.staff?.full_name}
        </HoverQuickView>
      ),
    },
    {
      title: "Địa chỉ",
      value: data?.address,
    },
  ];

  // const bank = [
  //   {
  //     title: 'Tên ngân hàng',
  //     value: dataBank?.bank_code_text?.title,
  //   },
  //   {
  //     title: 'Chi nhánh',
  //     value: dataBank?.bank_branch,
  //   },
  //   {
  //     title: 'Số tài khoản',
  //     value: dataBank?.bank_number,
  //   },
  //   {
  //     title: 'Là tài khoản doanh nghiệp',
  //     value: dataBank?.is_bank_business?.toString() && (
  //       <Tag color={StatusYesNo?.[dataBank?.is_bank_business]?.color}>
  //         {StatusYesNo?.[dataBank?.is_bank_business]?.title}
  //       </Tag>
  //     ),
  //   },
  // ];

  // const ship = [
  //   {
  //     title: 'Quốc gia',
  //     value: dataDelivery?.country_text?.title,
  //   },
  //   {
  //     title: 'Quận, huyện',
  //     value: dataDelivery?.district_text?.title,
  //   },
  //   {
  //     title: 'Tỉnh/Thành phố',
  //     value: dataDelivery?.province_text?.title,
  //   },
  //   {
  //     title: 'Phường, xã',
  //     value: dataDelivery?.ward_text?.title,
  //   },
  //   {
  //     title: 'Mã vùng',
  //     value: dataDelivery?.zip_code,
  //   },
  //   {
  //     title: 'Số nhà',
  //     value: dataDelivery?.house_number,
  //   },
  //   {
  //     title: 'Địa chỉ',
  //     value: dataDelivery?.address_line2,
  //   },
  // ];

  return (
    <div className="">
      {/* <CardForm title="THÔNG TIN CHUNG"> */}
      <Row className="grid gap-y-2.5">
        <div className="w-[100px] h-[100px] rounded-[5px] m-auto flex flex-col items-center gap-y-2.5">
          <Image
            src={data?.avatar_url}
            alt={data?.src}
            containerClassName="rounded-[5px]"
            imageClassName="rounded-[5px]"
          />
        </div>
        <div>
          {info.map((item, index) => (
            <Description
              key={index}
              label={item?.title}
              childrenClassName="text-gray-800 font-normal col-span-7"
              labelClassName="col-span-5"
              className="grid-cols-12"
            >
              {item?.value}
            </Description>
          ))}
        </div>
      </Row>
      {/* </CardForm> */}
      {/* <Row>
        <CardForm title="THÔNG TIN NGÂN HÀNG (MẶC ĐỊNH)">
          {bank.map((item, index) => (
            <Description key={index} label={item?.title}>
              {item?.value}
            </Description>
          ))}
        </CardForm>
        <CardForm title="THÔNG TIN ĐỊA CHỈ (MẶC ĐỊNH)">
          {ship.map((item, index) => (
            <Description key={index} label={item?.title}>
              {item?.value}
            </Description>
          ))}
        </CardForm>
      </Row> */}
    </div>
  );
}

export default Customer;
