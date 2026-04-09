import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import Template from "@tera/components/web/Template";
import { REGEX } from "@tera/commons/constants/common";
import InputPassword from "@tera/components/dof/Control/InputPassword";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { AuthApi } from "@tera/api/auth/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import {
  Button,
  Col,
  EyeOutlined,
  EyeSlashOutlined,
  Row,
  Spin,
  notification,
} from "tera-dls";

const EnableBusiness = () => {
  const form = useForm({
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [visiblePasswordOne, setVisiblePasswordOne] = useState<boolean>(false);
  const [visiblePasswordTwo, setVisiblePasswordTwo] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.verifyToken(variables),

    onSuccess: () => {
      setIsValid(true);
    },

    onError: (error: any) => {
      const errorMessage = error?.data?.msg ?? "Error!! please try again!";
      setIsValid(false);
      setErrorMessage(errorMessage);
      navigate("/auth/business/enable/fail");
      notification.error({
        message: errorMessage,
      });
    },
  });

  useEffect(() => {
    if (token) {
      const params = {
        token,
      };
      mutate(params);
    }
  }, []);

  const { mutate: mutateEnable, isLoading: loadingEnable } = useMutationLegacy({
    mutationFn: (variables: any) => AdminApi.enableBusiness(variables),

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

  const handleSubmitForm = (values) => {
    if (!isValid) {
      notification.error({
        message: errorMessage,
      });
      return;
    }
    const data = {
      token,
      password: values?.password,
    };
    mutateEnable(data);
  };

  return (
    <Template>
      <Col
        className={`w-[476px] rounded-[30px] flex flex-col items-center`}
        style={{
          background: `url(${backgroundRightLogin}), #BEE8EE80`,
          backgroundSize: "50% cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="h-full w-full p-[30px] gap-[30px] flex flex-col">
          <div className="text-3xl text-center text-white">
            Thay đổi mật khẩu
          </div>
          <Spin spinning={isLoading}>
            <FormTera
              form={form}
              onSubmit={handleSubmit(handleSubmitForm)}
              className="flex-1"
            >
              <Row className="flex flex-col justify-between h-full">
                <div>
                  <FormTeraItem
                    name={"password"}
                    label="Mật khẩu mới"
                    labelClassName={"font-light text-white text-base mb-2.5"}
                    isRequired={false}
                    rules={[
                      {
                        required: "Vui lòng nhập mật khẩu",
                        pattern: {
                          value: REGEX.PASSWORD,
                          message: "Mật khẩu không được chứa khoảng cách",
                        },
                        minLength: {
                          value: 8,
                          message: "Mật khẩu phải lớn hơn 8 ký tự",
                        },
                      },
                    ]}
                  >
                    <InputPassword
                      maxLength={16}
                      placeholder="Vui lòng nhập mật khẩu"
                      className="bg-gray-200 py-3 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                      suffixProps={{
                        className:
                          "[&>*:first-child]:h-auto [&>*:first-child]:mr-1",
                      }}
                      visibilityToggle={{
                        visible: visiblePasswordOne,
                        onVisibleChange: setVisiblePasswordOne,
                      }}
                      iconRender={(visible) => (
                        <div className="text-white">
                          {visible ? (
                            <EyeSlashOutlined
                              onClick={() => setVisiblePasswordOne(false)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          ) : (
                            <EyeOutlined
                              onClick={() => setVisiblePasswordOne(true)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          )}
                        </div>
                      )}
                    />
                  </FormTeraItem>

                  <FormTeraItem
                    label="Nhập lại mật khẩu"
                    labelClassName={"font-light text-white text-base mb-2.5"}
                    name="confirm_password"
                    isRequired={false}
                    rules={[
                      {
                        minLength: {
                          value: 8,
                          message: "Mật khẩu phải lớn hơn 8 ký tự",
                        },
                        required: "Vui lòng nhập mật khẩu",
                        pattern: {
                          value: REGEX.PASSWORD,
                          message: "Mật khẩu không được chứa khoảng cách",
                        },
                        validate: {
                          existed: (value, values) => {
                            const password = values?.password.trim();
                            if (value.trim() !== password) {
                              return "Nhập lại mật khẩu không trùng với mật khẩu mới";
                            }
                          },
                        },
                      },
                    ]}
                  >
                    <InputPassword
                      maxLength={16}
                      placeholder="Vui lòng nhập lại mật khẩu"
                      className="bg-gray-200 py-3 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                      suffixProps={{
                        className:
                          "[&>*:first-child]:h-auto [&>*:first-child]:mr-1",
                      }}
                      visibilityToggle={{
                        visible: visiblePasswordTwo,
                        onVisibleChange: setVisiblePasswordTwo,
                      }}
                      iconRender={(visible) => (
                        <div className="text-white">
                          {visible ? (
                            <EyeSlashOutlined
                              onClick={() => setVisiblePasswordTwo(false)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          ) : (
                            <EyeOutlined
                              onClick={() => setVisiblePasswordTwo(true)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          )}
                        </div>
                      )}
                    />
                  </FormTeraItem>
                </div>
                <Button
                  htmlType="submit"
                  loading={loadingEnable}
                  className={
                    "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-normal text-base rounded-[70px] hover:bg-[#007fd9]"
                  }
                >
                  Kích hoạt
                </Button>
              </Row>
            </FormTera>
            <div className="text-base font-light flex gap-2.5 justify-center">
              <span className="text-[#111827]">Bạn đã có tài khoản Tera?</span>
              <span
                className="text-[#007AFF] cursor-pointer font-normal"
                onClick={() => navigate("/auth/login")}
              >
                Đăng nhập
              </span>
            </div>
          </Spin>
        </div>
      </Col>
    </Template>
  );
};

export default EnableBusiness;
