import Footer from "@tera/common/components/Login/Footer";
import { useNavigate } from "react-router-dom";
import backgroundNotification from "@tera/themes/images/uiNew/bg-notification.png";
import ErrorIcon from "@tera/themes/images/uiNew/error-icon.png";
import { Button } from "tera-dls";

function Content({ messages }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        color: "white",
        backgroundImage: `url(${backgroundNotification})`,
        backgroundSize: "cover",
      }}
      className={`min-h-[100vh] bg-no-repeat bg-center flex flex-col justify-center items-center py-[60px] px-[30px]`}
    >
      <div
        className="flex flex-1 gap-10 flex-col w-full h-full items-center p-[30px] leading-[30px] rounded-[30px] justify-between"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="font-light text-3xl text-red-500">{messages}</div>
          <div
            style={{
              width: 169,
              height: 200,
              backgroundImage: `url(${ErrorIcon})`,
              backgroundSize: "50% cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          <Button
            className="bg-blue-600 font-normal"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </Button>
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

export default Content;
