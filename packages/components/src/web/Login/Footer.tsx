import React from "react";

const application = [
  {
    id: "a1",
    text: "CRM",
    backgroundColor: "#44D0FC",
  },
  {
    id: "a2",
    text: "HRM",
    backgroundColor: "#897927",
  },
  {
    id: "a3",
    text: "ERP",
    backgroundColor: "#7965F3",
  },
  {
    id: "a4",
    text: "Shopee",
    backgroundColor: "#E18C29",
  },
  {
    id: "a5",
    text: "Lazada",
    backgroundColor: "#3C55DC",
  },
  {
    id: "a6",
    text: "Zalo",
    backgroundColor: "#02D1FF",
  },
];

interface IProps {
  textProps?: any;
}
const Footer = ({ textProps }: IProps) => {
  return (
    <div className=" flex flex-col items-center gap-2.5 text-base">
      <p {...textProps}>Điều khoản dịch vụ & Chính sách bảo mật của Tera</p>
      <div className="flex gap-5">
        {application.map((item) => (
          <div
            key={item.id}
            className="rounded-[6px] w-[40px] h-[40px] text-[11px] leading-[27px] pt-[6px] font-normal text-center"
            style={{ backgroundColor: item.backgroundColor }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
