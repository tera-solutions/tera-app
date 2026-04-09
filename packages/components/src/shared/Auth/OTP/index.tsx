import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import Template from "@tera/components/web/Template";
import { useStores } from "@tera/stores/useStores";
import useCountDown from "@tera/commons/hooks/useCountDown";
import { CryptoJSAesEncrypt } from "@tera/commons/utils/hashHelper";
import classNames from "classnames";
import moment from "moment";
import { AuthApi } from "@tera/api/auth/auth";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate, useParams } from "react-router-dom";
import CheckedIcon from "@tera/themes/images/Icons/CheckedIcon";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import {
  Button,
  Col,
  Spin,
  getQueryParams,
  notification,
  updateQueryParams,
} from "tera-dls";

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 10,
};

const inputStyle = {
  width: 50,
  height: 50,
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: "10px",
};

const Otp = () => {
  const { globalStore } = useStores();
  const { id } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isResendSuccess, setIsResendSuccess] = useState<boolean>(false);
  const { time, resetCountdown } = useCountDown({ initialTime: 120 });
  const formattedTime = moment.utc(time * 1000).format("mm:ss");
  const params: { [key: string]: any } = getQueryParams(location.search);

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.verifyOtp(variables),

    onSuccess: (res) => {
      const bodyParams = {
        access_id: res?.data?.access_id,
      };
      const queryParams = updateQueryParams({
        client_id: "tera",
        req: JSON.stringify(CryptoJSAesEncrypt(bodyParams)),
      });
      if (params?.callback) {
        window.open(`${params?.callback}${queryParams}`, "_self");
      } else {
        window.open(
          `${globalStore?.redirect_url}/auth/check-auth${queryParams}`,
          "_self",
        );
      }
    },

    onError: (error: any) => {
      if (error?.data?.code === 501) {
        setIsLocked(true);
      }
      setOtp("");
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      setMessageError(errorMessage);
    },
  });
  const { mutate: resendOtp, isLoading: loadingResend } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.resendOtp(variables),

    onSuccess: (res) => {
      if (res?.code === 200) {
        resetCountdown();
        setIsResendSuccess(true);
      }
    },

    onError: (error: any) => {
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      notification.error({
        message: errorMessage,
      });
    },
  });

  const handleSendOtp = () => {
    if (otp?.length < 6) return;
    const data = {
      user_id: id,
      otp_code: otp,
    };
    mutate(data);
  };

  const handleResendOtp = () => {
    if (time > 60) return;
    const data = {
      user_id: id,
    };
    resendOtp(data);
    setMessageError(null);
    setOtp("");
  };

  return (
    <Template>
      <Col
        className={`w-[476px] rounded-[30px] flex items-center`}
        style={{
          background: `url(${backgroundRightLogin}), #BEE8EE80`,
          backgroundSize: "50% cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="h-full w-full p-[30px] gap-[30px] flex flex-col">
          {isResendSuccess && (
            <div className="flex gap-[16px] justify-center items-center">
              <CheckedIcon width={57} height={36} />
              <span className="text-blue-800 text-base font-light">
                Gửi mã OTP vào mail thành công
              </span>
            </div>
          )}
          <div className="text-3xl text-center text-white">Xác nhận OTP</div>
          <div className="flex flex-col items-center gap-y-2.5 flex-1">
            {!isLocked && (
              <>
                <Spin spinning={loadingResend}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props, index) => {
                      return (
                        <input
                          key={index}
                          {...props}
                          className={`tera-no-control ${
                            messageError ? "!border-[1px] !border-red-500" : ""
                          }`}
                        />
                      );
                    }}
                    inputType="number"
                    containerStyle={containerStyle}
                    inputStyle={inputStyle}
                    shouldAutoFocus
                  />
                </Spin>

                <p className="text-red-500">{formattedTime}</p>
              </>
            )}
            {messageError && (
              <p className="text-red-600 text-base font-normal text-center">
                {messageError}
              </p>
            )}

            {!isLocked && (
              <p className="text-gray-800 text-base">
                Chưa thấy mã OTP? Nhấn{" "}
                <span
                  className={classNames("text-green-800 cursor-pointer", {
                    "!text-gray-500": time > 60,
                    "!cursor-text": time > 60,
                  })}
                  onClick={handleResendOtp}
                >
                  vào đây
                </span>{" "}
                để nhận lại mã.
              </p>
            )}
          </div>
          <Button
            onClick={handleSendOtp}
            disabled={otp?.length !== 6}
            loading={isLoading}
            className={
              "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-bold text-xl rounded-[70px] hover:bg-[#007fd9]"
            }
          >
            Đăng nhập
          </Button>
          <div className="text-base font-light flex gap-2.5 justify-center">
            <span className="text-[#111827]">Bạn đã có tài khoản Tera?</span>
            <span
              className="text-[#007AFF] cursor-pointer font-normal"
              onClick={() => navigate("/auth/login")}
            >
              Đăng nhập
            </span>
          </div>
        </div>
      </Col>
    </Template>
  );
};

export default Otp;
