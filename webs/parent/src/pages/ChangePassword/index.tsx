import {
  BTN_PRIMARY,
  HEADING_CLASS_NAME,
} from "@tera/commons/constants/common";
import { messageValidate } from "@tera/commons/constants/message";
import InputPassword from "@tera/components/dof/Control/InputPassword";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import { Button } from "tera-dls";

const ChangePasswordPage = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Thay đổi mật khẩu</h1>

      <FormTera className="p-4 rounded-md shadow">
        <FormTeraItem
          name="new-password"
          label="Mật khẩu mới"
          layout="inline"
          labelClassName="min-w-[200px]"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <InputPassword />
        </FormTeraItem>
        <FormTeraItem
          name="confirm-password"
          label="Nhập lại mật khẩu"
          layout="inline"
          labelClassName="min-w-[200px]"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <InputPassword />
        </FormTeraItem>
        <Button className={classNames(BTN_PRIMARY, "ml-auto")}>Lưu</Button>
      </FormTera>
    </div>
  );
};

export default ChangePasswordPage;
