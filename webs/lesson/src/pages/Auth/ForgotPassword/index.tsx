import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { yupResolver } from "@hookform/resolvers/yup";

import Template from "@tera/components/web/Template";
import { AuthApi } from "@tera/api/auth/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import backgroundRightLogin from "@tera/themes/images/uiNew/bg-right-login.png";
import { Button, Col, Form, FormItem, Input, notification } from "tera-dls";

import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables) => AuthApi.forgotPassword(variables),

    onSuccess: (res) => {
      notification.success({
        message: res?.msg,
      });
      navigate("/auth/forgot-password/success");
    },

    onError: (error: any) => {
      const errorMessage = error?.data?.msg ?? "Error!! Please try again!";
      setError("email", { message: errorMessage });
    },
  });

  const handleSubmitForm = (values) => {
    if (isLoading) return;
    mutate(values);
  };

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
        <div className="text-[30px] leading-[30px] text-center text-white">
          Quên mật khẩu
        </div>
        <div className=" w-full px-[30px] flex-1 h-full">
          <Form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <FormItem
                label="Nhập email đăng ký"
                className="mb-5"
                messages={errors?.email?.message}
                isError={!!errors?.email}
                labelClassName={"font-light text-white text-base mb-2.5"}
                isRequired={false}
              >
                <Input
                  autoFocus
                  placeholder="Vui lòng nhập"
                  className="bg-gray-200 py-2 text-base text-white caret-white rounded-[10px] font-normal placeholder:text-[#FFFFFF4D] "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                  {...register("email")}
                />
              </FormItem>

              <div className="flex flex-col gap-5 items-center text-base font-light italic">
                <div className="text-red-600 font-light flex flex-col items-center w-full ">
                  <div>* Nhập email đã đăng ký trước đó.</div>
                  <div>Hệ thống sẽ gửi 1 tin nhắn đến email của bạn.</div>
                  <div>Vui lòng kiểm tra hộp thư đến.</div>
                </div>

                <p className="text-yellow-800">
                  Lưu ý thời gian hết hạn tin nhắn là 5 phút.
                </p>
              </div>
            </div>
            <Button
              htmlType="submit"
              loading={isLoading}
              className={
                "bg-[#0095D9] w-full flex justify-center text-[#FFF] font-normal text-base rounded-[70px] hover:bg-[#007fd9]"
              }
            >
              Gửi email
            </Button>
          </Form>
        </div>
        <div className="text-base font-light flex gap-2.5 justify-center">
          <span className="text-[#111827]">Bạn đã có tài khoản Tera?</span>
          <span
            className="text-[#007AFF] cursor-pointer font-normal"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </span>
        </div>
      </Col>
    </Template>
  );
};

export default ForgotPassword;
