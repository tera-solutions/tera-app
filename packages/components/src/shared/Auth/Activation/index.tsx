import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import backgroundImage from "@tera/themes/images/uiNew/bg-form.png";
import { Spin, notification } from "tera-dls";
import { AuthApi } from "@tera/api/auth/auth";
import Fail from "./Fail";
import Success from "./Success";

type TResult = "success" | "fail";

function Activation() {
  const classCoverBox = "h-[100vh] flex items-center justify-center bg-cover";
  const [result, setResult] = useState<TResult>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.activation(variables),

    onSuccess: (res) => {
      setResult("success");
      notification.success({
        message: res?.msg,
      });
    },

    onError: (error: any) => {
      setResult("fail");
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      notification.error({
        message: errorMessage,
      });
    },
  });

  useEffect(() => {
    if (token) {
      const params = {
        token,
        type: "activation",
      };
      mutate(params);
    }
  }, []);

  const renderUI = (type: TResult) => {
    switch (type) {
      case "success":
        return <Success />;
      case "fail":
        return <Fail />;
      default:
        return <Spin tip="Đang kiểm tra" />;
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
        className={classCoverBox}
      >
        {renderUI(result)}
      </div>
    </Spin>
  );
}

export default Activation;
