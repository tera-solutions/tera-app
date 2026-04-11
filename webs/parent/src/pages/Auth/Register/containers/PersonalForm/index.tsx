import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useState } from "react";
import { useForm } from "react-hook-form";

import CheckedRules from "./CheckedRules";
import Input from "@tera/components/dof/Control/Input";
import InputPassword from "@tera/components/dof/Control/InputPassword";
import { Button, EyeOutlined, EyeSlashOutlined, notification } from "tera-dls";
import { REGEX } from "@tera/commons/constants/common";

import { useNavigate } from "react-router-dom";
import { AuthApi } from "@tera/api/auth/auth";

const PersonalForm = () => {
  const form = useForm({
    mode: "onChange",
  });
  const { handleSubmit, setError } = form;
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const isError = form?.formState?.errors?.rule;

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables) => AuthApi.register(variables),

    onSuccess: (res) => {
      navigate("/auth/register-user/success");
      notification.success({
        message: res?.msg,
      });
    },

    onError: (error: any) => {
      const { field, message } = error?.data?.msg;
      if (field && message) {
        setError(field, {
          type: "error",
          message,
        });
      }
    },
  });

  const handleSubmitForm = (values) => {
    if (isLoading) return;
    mutate({ ...values, type: "user" });
  };

  return (
    <FormTera form={form} onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="overflow-x-auto h-[350px] mb-2">
        <div id={"full_name"} className="mb-4">
          <FormTeraItem
            label="Họ và tên"
            name="full_name"
            labelClassName={
              "font-light text-white text-base mb-2.5 leading-[16px]"
            }
            className="mb-4"
            rules={[{ required: "Vui lòng nhập họ và tên" }]}
            isRequired={false}
          >
            <Input
              maxLength={100}
              autoFocus
              placeholder="Vui lòng nhập"
              className="bg-[#00000066] border-[1px] border-white py-2 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] "
            />
          </FormTeraItem>
        </div>
        <div id={"Email"} className="mb-4">
          <FormTeraItem
            label="Email"
            labelClassName={
              "font-light text-white text-base  mb-2.5 leading-[16px]"
            }
            className="mb-4"
            name="email"
            rules={[
              {
                required: "Vui lòng nhập email",
                pattern: {
                  value: REGEX.EMAIL,
                  message: "Địa chỉ Email không hợp lệ",
                },
              },
            ]}
            isRequired={false}
          >
            <Input
              maxLength={320}
              placeholder="Vui lòng nhập"
              className="bg-[#00000066] py-2 text-base border-[1px] border-white text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] "
            />
          </FormTeraItem>
        </div>
        <div id={"phone"} className="mb-4">
          <FormTeraItem
            label="Số điện thoại"
            labelClassName={
              "font-light text-white text-base  mb-2.5 leading-[16px]"
            }
            className="mb-4"
            name="phone"
            rules={[
              {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: REGEX.PHONE_NUMBER,
                  message: "Số điện thoại không hợp lệ",
                },
                minLength: {
                  value: 8,
                  message: "Số điện thoại phải lớn hơn 8 ký tự",
                },
              },
            ]}
            isRequired={false}
          >
            <Input
              maxLength={20}
              placeholder="Vui lòng nhập"
              className="bg-[#00000066] py-2 text-base border-[1px] border-white text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] "
            />
          </FormTeraItem>
        </div>
        <div id={"password"} className="mb-4">
          <FormTeraItem
            label="Mật khẩu"
            labelClassName={
              "font-light text-white text-base mb-2.5 leading-[16px]"
            }
            className="mb-4"
            name="password"
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
            isRequired={false}
          >
            <InputPassword
              type="confirm-password"
              maxLength={16}
              placeholder="Vui lòng nhập"
              className="bg-[#00000066] border-[1px] border-white py-2 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D]"
              suffixProps={{
                className: "[&>*:first-child]:h-auto [&>*:first-child]:mr-1",
              }}
              visibilityToggle={{ visible, onVisibleChange: setVisible }}
              iconRender={(visible) => (
                <div className="text-white">
                  {visible ? (
                    <EyeSlashOutlined
                      onClick={() => setVisible(false)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  ) : (
                    <EyeOutlined
                      onClick={() => setVisible(true)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  )}
                </div>
              )}
            />
          </FormTeraItem>
        </div>
      </div>
      <FormTeraItem
        label=""
        name="rule"
        rules={[
          {
            required: {
              value: true,
              message: "",
            },
          },
        ]}
        isRequired={false}
      >
        <CheckedRules isError={isError} />
      </FormTeraItem>
      <Button
        htmlType="submit"
        className={
          "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-bold text-xl rounded-[70px] hover:bg-[#007fd9]"
        }
      >
        Đăng ký
      </Button>
    </FormTera>
  );
};

export default PersonalForm;
