import { useNavigate } from "react-router-dom";
import Error from "@tera/themes/images/uiNew/Error.png";

function Fail() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-y-5 items-center">
      <div
        style={{
          width: 300,
          height: 300,
          backgroundImage: `url(${Error})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="text-sm text-center">
        <p className="text-red-500">Kích hoạt tài khoản thất bại</p>
        <p className="text-blue-500 font-bold">
          Vui lòng kiểm tra và kích hoạt lại tài khoản
        </p>
      </div>
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

export default Fail;
