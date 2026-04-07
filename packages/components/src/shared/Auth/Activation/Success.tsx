import { useNavigate } from "react-router-dom";
import Picture from "@tera/themes/images/uiNew/reset-success.png";

function Success() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-y-5 items-center">
      <div
        style={{
          width: 400,
          height: 300,
          backgroundImage: `url(${Picture})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100%",
        }}
      />
      <p className="text-sm">
        <span className="text-blue-500">Kích hoạt tài khoản thành công.</span>
        <span className="text-blue-500 font-semibold">Vui lòng LOGIN</span>
      </p>
      <p className="text-base">
        <span className="text-gray-500">hoặc</span>{" "}
        <span className="text-gray-800">Nhấn</span>{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/auth/login")}
        >
          vào đây
        </span>
      </p>
    </div>
  );
}

export default Success;
