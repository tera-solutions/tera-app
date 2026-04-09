import Template from "@tera/components/web/Template";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import { Col } from "tera-dls";
import BusinessForm from "./containers/BusinessForm";
import PersonalForm from "./containers/PersonalForm";

const activeClassName = "bg-[#0095D9]";
type IType = "personal" | "business";

const Register = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<IType>("personal");

  return (
    <Template>
      <Col
        className="w-[476px] h-full rounded-[30px] p-[30px] flex flex-col gap-[30px] text-white"
        style={{
          background: `url(${backgroundRightLogin}),#BEE8EE80`,
          backgroundSize: "50% cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-3xl text-center">ĐĂNG KÝ DÙNG THỬ</div>
        <div className="h-full">
          <div className="flex p-2.5 bg-[#314E52] rounded-[45px]">
            <div
              className={`cursor-pointer rounded-[60px] text-base p-2.5  w-full grid place-items-center ${
                type === "personal" ? activeClassName : ""
              }`}
              onClick={() => setType("personal")}
            >
              Đăng ký cá nhân
            </div>
            <div
              onClick={() => setType("business")}
              className={`cursor-pointer rounded-[60px] text-base p-2.5 w-full grid place-items-center ${
                type === "business" ? activeClassName : ""
              }`}
            >
              Đăng ký doanh nghiệp
            </div>
          </div>

          <div className="mt-2">
            {type === "personal" && <PersonalForm />}
            {type === "business" && <BusinessForm />}
          </div>
        </div>
        <div className="text-base font-light flex gap-2.5 justify-center">
          <span className="text-[#111827]">Bạn đã có tài khoản Tera?</span>
          <span
            className="text-[#007AFF] cursor-pointer font-normal"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </span>
        </div>
      </Col>
    </Template>
  );
};

export default Register;
