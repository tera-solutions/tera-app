import { useMutationLegacy } from "@tera/common/hooks/tanstack";

import { REGEX } from "@tera/common/constants/common";
import Input from "@tera/common/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/common/dof/FormTera";
import SelectJobTitle from "@tera/common/dof/Select/ObjectType/SelectJobTitle";
import SelectPaymentMethod from "@tera/common/dof/Select/ObjectType/SelectPaymentMethod";
import SelectPosition from "@tera/common/dof/Select/ObjectType/SelectPosition";
import SelectScalesType from "@tera/common/dof/Select/ObjectType/SelectScalesType";
import { AuthApi } from "@tera/api/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, notification } from "tera-dls";
import CheckedRules from "../PersonalForm/CheckedRules";

const className =
  "bg-[#00000066] border-[1px] border-white py-2 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D]";
const BusinessForm = () => {
  const form = useForm({
    mode: "onChange",
  });

  const {
    setError,
    formState: { errors },
  } = form;
  const ruleError = errors?.rule;

  const navigate = useNavigate();

  const handleScrollToError = (errorField: string): void => {
    const element = document.getElementById(`${errorField}`) as any;
    element && element.scrollIntoView({ behavior: "smooth" });
  };

  const handleErrorForm = (errors): void => {
    const errorField = Object.keys(errors)?.[0];
    handleScrollToError(errorField);
  };

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables) => AuthApi.register(variables),

    onSuccess: (res) => {
      notification.success({
        message: res?.msg,
      });
      if (!Number(res?.data?.is_verify)) {
        navigate("/auth/login");
        return;
      }

      navigate("/auth/register-business/success");
    },

    onError: (error: any) => {
      const { field, message } = error?.data?.msg;
      if (field && message) {
        setError(field, {
          type: "error",
          message,
        });
        handleScrollToError(field);
      }
    },
  });

  const handleSubmitForm = (values) => {
    mutate({ ...values, type: "business" });
  };

  return (
    <FormTera form={form} onSubmit={handleSubmitForm} onError={handleErrorForm}>
      <div className="overflow-x-auto h-[350px] mb-2 flex flex-col gap-[30px] ">
        <div>
          <div className="text-[#111827] mb-2.5 text-base font-medium">
            Thông tin người đại diện
          </div>
          <div id={"owner_name"} className="mb-4">
            <FormTeraItem
              label="Họ và tên"
              labelClassName={
                "font-light text-white text-base mb-2.5 leading-[16px]"
              }
              name={"owner_name"}
              rules={[{ required: "Vui lòng nhập họ và tên" }]}
              isRequired={false}
            >
              <Input
                autoFocus
                maxLength={100}
                placeholder="Vui lòng nhập"
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"owner_email"} className="mb-4">
            <FormTeraItem
              label="Email"
              name="owner_email"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
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
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"owner_phone"} className="mb-4">
            <FormTeraItem
              label="Số điện thoại"
              name="owner_phone"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
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
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"owner_job_title"} className="mb-4">
            <FormTeraItem
              name={"owner_job_title"}
              label="Chức danh"
              labelClassName={
                "font-light text-white text-base mb-2.5 leading-[16px]"
              }
              rules={[{ required: "Vui lòng chọn chức danh" }]}
              isRequired={false}
            >
              <SelectJobTitle
                placeholderClassName="text-base flex items-center h-6"
                valueClassName="text-base flex items-center h-6 text-white"
                placeholder="Vui lòng chọn"
                className="bg-[#00000066] py-2 text-base text-white caret-white rounded-[10px] font-normal [&>*:first-child]:h-6"
              />
            </FormTeraItem>
          </div>
          <div id={"owner_department"} className="mb-4">
            <FormTeraItem
              name={"owner_department"}
              label="Phòng ban/ Bộ phận"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
              rules={[{ required: "Vui lòng chọn phòng ban" }]}
              isRequired={false}
            >
              <SelectPosition
                placeholderClassName="text-base flex items-center h-6"
                valueClassName="text-base flex items-center h-6 text-white"
                placeholder="Vui lòng chọn"
                className="bg-[#00000066] py-2 text-base text-white caret-white rounded-[10px] font-normal [&>*:first-child]:h-6 "
              />
            </FormTeraItem>
          </div>
        </div>
        <div>
          <div className="text-[#111827] mb-2.5 text-base font-medium">
            Thông tin doanh nghiệp
          </div>
          <div id={"name"} className="mb-4">
            <FormTeraItem
              label="Tên công ty"
              labelClassName={
                "font-light text-white text-base mb-2.5 leading-[16px]"
              }
              className="mb-4"
              name={"name"}
              rules={[{ required: "Vui lòng nhập tên công ty" }]}
              isRequired={false}
            >
              <Input
                maxLength={100}
                placeholder="Vui lòng nhập"
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"email"} className="mb-4">
            <FormTeraItem
              label="Email công ty"
              name="email"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
              className="mb-4"
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
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"address"} className="mb-4">
            <FormTeraItem
              label="Địa chỉ công ty"
              labelClassName={
                "font-light text-white text-base mb-2.5 leading-[16px]"
              }
              className="mb-4"
              name={"address"}
              rules={[{ required: "Vui lòng nhập địa chỉ công ty" }]}
              isRequired={false}
            >
              <Input
                maxLength={255}
                placeholder="Vui lòng nhập"
                className={className}
              />
            </FormTeraItem>
          </div>
          <div id={"employee_size"} className="mb-4">
            <FormTeraItem
              name={"employee_size"}
              label="Quy mô nhân sự"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
              rules={[{ required: "Vui lòng chọn quy mô nhân sự" }]}
              isRequired={false}
            >
              <SelectScalesType
                placeholderClassName="text-base flex items-center h-6"
                valueClassName="text-base flex items-center h-6 text-white"
                placeholder="Vui lòng chọn"
                className="bg-[#00000066] py-2 text-base text-white caret-white rounded-[10px] font-normal [&>*:first-child]:h-6 "
              />
            </FormTeraItem>
          </div>
          <div id={"payment_methods"} className="mb-4">
            <FormTeraItem
              name={"payment_methods"}
              label="Phương thức thanh toán"
              labelClassName={
                "font-light text-white text-base  mb-2.5 leading-[16px]"
              }
              rules={[{ required: "Vui lòng chọn phương thức thanh toán" }]}
              isRequired={false}
            >
              <SelectPaymentMethod
                placeholderClassName="text-base flex items-center h-6"
                valueClassName="text-base flex items-center h-6 text-white"
                placeholder="Vui lòng chọn"
                className="bg-[#00000066] py-2 text-base text-white caret-white rounded-[10px] font-normal [&>*:first-child]:h-6 "
              />
            </FormTeraItem>
          </div>
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
        <CheckedRules isError={ruleError} />
      </FormTeraItem>
      <Button
        htmlType="submit"
        loading={isLoading}
        className={
          "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-bold text-xl rounded-[70px] hover:bg-[#007fd9]"
        }
      >
        Đăng ký
      </Button>
    </FormTera>
  );
};

export default BusinessForm;
