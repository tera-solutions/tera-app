import Footer from "@tera/components/web/Login/Footer";
import { useNavigate } from "react-router-dom";
import backgroundLogin from "@tera/themes/images/uiNew/bg-login.png";
import registrationSuccessActor from "@tera/themes/images/uiNew/register-success-actor.png";
import registrationSuccessTimeline from "@tera/themes/images/uiNew/register-success-timeline.png";
import { tw } from "tailwind-merge.config";

function RegistrationBusinessSuccess() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        color: "white",
        backgroundSize: "cover",
        backgroundImage: `url(${backgroundLogin})`,
      }}
      className={`min-h-[100vh] bg-no-repeat bg-center flex flex-col justify-center items-center p-[60px] `}
    >
      <div
        className="flex flex-col justify-between gap-10 flex-1 h-full w-full items-center p-[30px] leading-[30px] rounded-[30px]"
        style={{ backgroundColor: "#ffffff36" }}
      >
        <div className="flex items-center flex-col gap-2.5">
          <img
            src={registrationSuccessActor}
            className="w-auto h-[200px] object-cover"
          />
          <div className="text-[30px] leading-[36px] font-light flex flex-col gap-2.5 text-center">
            <div>
              <p>Chúc mừng bạn đã</p>
              <p>đăng ký dùng thử doanh nghiệp thành công!</p>
            </div>
            <p className="text-[16px]">
              Tera sẽ gửi thông tin cho bạn qua mail trong thời gian sớm nhất!
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <img
              src={registrationSuccessTimeline}
              className="w-full max-h-[84px] object-cover"
            />
            <div className="flex text-center gap-5 justify-between w-full text-[16px] leading-[25px] font-light">
              <p className={tw("sm:w-[130px] md:w-[180px]")}>
                <p>Khách hàng</p> đăng ký dùng thử
              </p>
              <p className=" flex-1">
                <p>Tera</p> xác nhận thông tin
              </p>
              <p className={tw("sm:w-[130px] md:w-[180px]")}>
                <p>Tera</p> cấp tài khoản qua mail
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="text-base font-light flex gap-2.5 justify-center ">
            <span className="text-[#111827] ">Bạn đã có tài khoản Tera?</span>
            <span
              className="text-[#007AFF] cursor-pointer font-normal"
              onClick={() => navigate("/auth/login")}
            >
              Đăng nhập
            </span>
            <span className="text-gray-500">hoặc</span>
            <span
              className="text-[#007AFF] cursor-pointer font-normal"
              onClick={() => navigate("/auth/register")}
            >
              Đăng ký
            </span>
          </div>
          <Footer
            textProps={{
              className: "text-blue-600",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RegistrationBusinessSuccess;
