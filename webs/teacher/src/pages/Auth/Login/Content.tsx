import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useGoogleLogin } from '@react-oauth/google';

import Template from "@tera/components/web/Template";
import { CryptoJSAesEncrypt } from "@tera/commons/utils/hashHelper";
import { throttle } from "lodash";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import teraLogo from "@tera/themes/images/uiNew/tera-logo.png";
import PasswordIcon from "@tera/themes/images/Icons/PasswordIcon";
import UserIcon from "@tera/themes/images/Icons/UserIcon";

import {
  Button,
  Col,
  EyeOutlined,
  EyeSlashOutlined,
  Form,
  FormItem,
  Input,
  InputPassword,
  notification,
  updateQueryParams,
} from "tera-dls";
import * as yup from "yup";
import { AuthApi } from "@tera/api/auth/auth";
import { useStores } from "@tera/stores/useStores";

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tài khoản").trim(),
  password: yup.string().required("Vui lòng nhâp mật khẩu").trim(),
});

const Content = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    globalStore: { updateUser, updateAccessId },
  } = useStores();

  const [visible, setVisible] = useState<boolean>(false);
  const [errorAnimation, setErrorAnimation] = useState<boolean>(false);

  // const { authStore } = useStates();

  const navigate = useNavigate();
  // const location = useLocation();
  // const params: { [key: string]: any } = getQueryParams(location.search);

  const isError = !!errors?.username || !!errors?.password;

  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => console.log(tokenResponse.access_token),
  // });

  const handleError = useCallback(
    throttle(() => {
      setErrorAnimation(true);
      const id = setTimeout(() => {
        setErrorAnimation(false);
        clearTimeout(id);
      }, 600);
    }, 600),
    [isError, setErrorAnimation],
  );
  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables) => AuthApi.login(variables),
    onSuccess: (res) => {
      res?.data?.access_id && updateAccessId(res?.data?.access_id);
      if (!!res?.data?.verify_auth) {
        setTimeout(() => {
          navigate(`/auth/otp/${res?.data?.user?.id}`);
        }, 200);
      } else {
        const bodyParams = {
          access_id: res?.data?.access_id,
        };
        const queryParams = updateQueryParams({
          client_id: "tera",
          req: JSON.stringify(CryptoJSAesEncrypt(bodyParams)),
        });
        // setTimeout(() => {
        //   navigate(`/auth/check-auth${queryParams}`);
        // }, 10);

        updateUser(res?.data);

        setTimeout(() => {
          navigate("/");
        }, 200);

        // if (params?.callback) {
        //   // window.open(`${params?.callback}${queryParams}`, '_self');
        //   // console.log('params?.callback', params?.callback);
        // } else {
        //   console.log('authStore?.redirect_url', authStore?.redirect_url);
        //   navigate(
        //     `${authStore?.redirect_url}/auth/check-auth${queryParams}`,
        //   );

        //   // window.open(
        //   //   `${authStore?.redirect_url}/auth/check-auth${queryParams}`,
        //   //   '_self',
        //   // );
        // }
      }
    },

    onError: (error: any) => {
      if (error?.data?.code === 501) {
        notification.error({
          message: error?.data?.msg,
        });
        return;
      }
      if (error?.data?.code === 403) {
        notification.error({
          message: error?.data?.msg,
        });
        return;
      }

      console.log("error", error);

      const { field, message } = error?.data?.msg;

      if (field && message) {
        setError(field, {
          type: "error",
          message,
        });
        handleError();
      }
    },
  });

  const handleLogin = (values) => {
    if (isLoading) return;
    mutate(values);
  };

  return (
    <Template>
      <Col
        className={`w-[476px] rounded-[30px] flex items-center ${
          errorAnimation ? "animation-ring" : ""
        }`}
        style={{
          background: `url(${backgroundRightLogin}), #BEE8EE80`,
          backgroundSize: "50% cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className=" w-full px-[30px]">
          <div className="mb-[60px] w-full flex justify-center">
            <img src={teraLogo} className="w-[270px] h-[140px] " />
          </div>
          <Form onSubmit={handleSubmit(handleLogin, handleError)}>
            <FormItem
              name={"username"}
              label=""
              className="mb-5"
              messages={errors?.username?.message}
              isError={!!errors?.username}
            >
              <Input
                maxLength={320}
                autoFocus
                placeholder="Vui lòng nhập tài khoản"
                prefix={
                  <div className="border-r-[2px] px-3 pr-4 border-r-gray-700">
                    <UserIcon viewBox="0 0 23 23" width={23} height={23} />
                  </div>
                }
                className="py-2.5 pl-[90px] text-xl text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] placeholder:text-base"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                {...register("username")}
              />
            </FormItem>
            <FormItem
              name={"password"}
              label=""
              messages={errors?.password?.message}
              isError={!!errors?.password}
            >
              <InputPassword
                maxLength={16}
                placeholder="Vui lòng nhập mật khẩu"
                prefix={
                  <div className="border-r-[2px] border-r-gray-700 px-3 pr-4 grid place-items-center">
                    <PasswordIcon viewBox="0 0 21 26" width={23} height={23} />
                  </div>
                }
                className="bg-[#00000066] py-2.5 pl-[90px] text-xl text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] placeholder:text-base"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                suffixProps={{
                  className: "[&>*:first-child]:h-auto [&>*:first-child]:mr-5",
                }}
                visibilityToggle={{ visible, onVisibleChange: setVisible }}
                iconRender={(visible) => (
                  <div className="text-gray-700">
                    {visible ? (
                      <EyeSlashOutlined
                        onClick={() => setVisible(false)}
                        className="w-6 h-6 cursor-pointer"
                      />
                    ) : (
                      <EyeOutlined
                        onClick={() => setVisible(true)}
                        className="w-6 h-6 cursor-pointer"
                      />
                    )}
                  </div>
                )}
                {...register("password")}
              />
            </FormItem>
            <div className="mb-[20px]">
              <span
                className="text-[15px] cursor-pointer italic leading-[15px] "
                style={{ color: "#005880" }}
                onClick={() => {
                  navigate("/auth/forgot-password");
                }}
              >
                Quên mật khẩu?
              </span>
            </div>
            <Button
              htmlType="submit"
              loading={isLoading}
              className={
                "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-medium text-xl h-[50px] rounded-[10px] hover:bg-[#007fd9]"
              }
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </Col>
    </Template>
  );
};

export default Content;
