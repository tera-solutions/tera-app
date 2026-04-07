import { useNavigate } from "react-router-dom";
import ForgotPassword from "@tera/themes/images/uiNew/forgot-password.png";
import backgroundNotification from "@tera/themes/images/uiNew/bg-notification.png";
import Footer from "@tera/common/components/Login/Footer";

function SendForgotPasswordSuccess() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        color: "white",
        backgroundImage: `url(${backgroundNotification})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className={`min-h-[100vh] bg-no-repeat bg-center flex flex-col justify-center items-center p-[60px]`}
    >
      <div
        className="flex flex-col flex-1 w-full h-full items-center p-[30px] leading-[30px] rounded-[30px] justify-between"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.10)" }}
      >
        <div className="flex flex-col gap-2.5 items-center">
          <div className="font-light text-3xl text-center">
            Gửi email thay đổi mặt khẩu thành công
          </div>
          <div
            style={{
              width: 300,
              height: 300,
              backgroundImage: `url(${ForgotPassword})`,
            }}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="text-base font-light flex gap-2.5 justify-center ">
            <span className="text-[#111827]">Bạn đã có tài khoản Tera?</span>
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

export default SendForgotPasswordSuccess;
