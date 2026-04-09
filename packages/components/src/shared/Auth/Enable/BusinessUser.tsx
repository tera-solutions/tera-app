import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import Template from "@tera/components/web/Template";
import { AuthApi } from "@tera/api/auth/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import { Col, Spin, notification } from "tera-dls";

const BusinessUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: mutateEnable, isLoading: loadingEnable } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.enableBusiness(variables),

    onSuccess: () => {
      navigate("/auth/register-user/success");
    },

    onError: (error: any) => {
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      notification.error({
        message: errorMessage,
      });
      navigate("/auth/business/enable/fail");
    },
  });

  useEffect(() => {
    if (token) {
      const params = {
        token,
        is_user: 1,
      };
      mutateEnable(params);
    }
  }, []);

  return (
    <Template>
      <Col
        className={`w-[476px] rounded-[30px] flex items-center flex-col gap-[30px] py-[30px] `}
        style={{
          background: `url(${backgroundRightLogin}), #BEE8EE80`,
          backgroundSize: "50% cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="h-full w-full p-[30px] gap-[30px] flex flex-col">
          <div className="text-3xl text-center text-white">
            Đang xác thực...
          </div>
          <Spin
            spinning={loadingEnable}
            wrapperClassName="w-ful h-full grid place-items-center"
          >
            {/* <div className="text-base font-light flex gap-2.5 justify-center">
                <span className="text-[#111827]">
                  Bạn đã có tài khoản Tera?
                </span>
                <span
                  className="text-[#007AFF] cursor-pointer font-normal"
                  onClick={() => navigate('/auth/login')}
                >
                  Đăng nhập
                </span>
              </div> */}
          </Spin>
        </div>
      </Col>
    </Template>
  );
};

export default BusinessUser;
