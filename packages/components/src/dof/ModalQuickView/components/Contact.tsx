import CardForm from "@tera/components/web/CardForm";
import ViewMore from "@tera/components/web/ViewMore";
import { Description, Row } from "tera-dls";

function Contact({ data }) {
  const followers = data?.followers?.map((item) => item?.employee?.full_name);
  const locations = data?.locations?.map((item) => item?.location?.name);

  const info = [
    {
      title: "Mã liên hệ",
      value: data?.code,
    },
    {
      title: "Bộ phận",
      value: data?.department_text?.title,
    },
    {
      title: "Họ và tên",
      value: data?.full_name,
    },
    {
      title: "Email cá nhân",
      value: data?.personal_email,
    },
    {
      title: "Xưng hô",
      value: data?.prefix_text?.title,
    },
    {
      title: "Email công ty",
      value: data?.company_email,
    },
    {
      title: "Email khác",
      value: data?.other_email,
    },
    {
      title: "SĐT công ty",
      value: data?.company_phone,
    },
  ];

  const other = [
    {
      title: "Facebook",
      value: data?.fb,
    },
    {
      title: "Chi nhánh",
      value: (
        <ViewMore
          content={locations}
          text={locations?.join(", ")}
          title="Xem thêm người theo dõi"
        />
      ),
    },
    {
      title: "Zalo",
      value: data?.zalo,
    },
    // {
    //   title: 'Dùng chung',
    //   value: (
    //     <Tag color={StatusYesNo?.[data?.is_shared]?.color}>
    //       {StatusYesNo?.[data?.is_shared]?.title}
    //     </Tag>
    //   ),
    // },
    {
      title: "Người theo dõi",
      value: (
        <ViewMore
          content={followers}
          text={followers?.join(", ")}
          title="Xem thêm người theo dõi"
        />
      ),
    },

    {
      title: "Instagram",
      value: data?.instagram,
    },
  ];

  const address = [
    {
      title: "Quốc gia",
      value: data?.country_text?.title,
    },
    {
      title: "Phường, xã",
      value: data?.ward_text?.title,
    },
    {
      title: "Tỉnh/Thành phố",
      value: data?.province_text?.title,
    },
    {
      title: "Số nhà, đường phố",
      value: data?.house_number,
    },
    {
      title: "Quận, huyện",
      value: data?.district_text?.title,
    },
    {
      title: "Địa chỉ",
      value: data?.address,
    },
  ];

  return (
    <div className="flex flex-col gap-y-10">
      <CardForm title="THÔNG TIN CHUNG">
        <Row className="grid grid-cols-2 gap-y-0">
          {info.map((item, index) => (
            <Description key={index} label={item?.title}>
              {item?.value}
            </Description>
          ))}
        </Row>
      </CardForm>
      <CardForm title="THÔNG TIN ĐỊA CHỈ">
        <Row className="grid grid-cols-2 gap-y-0">
          {address.map((item, index) => (
            <Description key={index} label={item?.title}>
              {item?.value}
            </Description>
          ))}
        </Row>
      </CardForm>
      <CardForm title="THÔNG TIN KHÁC">
        <Row className="grid grid-cols-2 gap-y-0">
          {other.map((item, index) => (
            <Description key={index} label={item?.title}>
              {item?.value}
            </Description>
          ))}
        </Row>
      </CardForm>
    </div>
  );
}

export default Contact;
