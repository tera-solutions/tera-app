import usePageConfig from "@tera/commons/hooks/usePageConfig";
import { usePermission } from "@tera/states/hooks";
import { memo } from "react";
import { ButtonProps, Button as ButtonTera, Icon } from "tera-dls";
import configList from "./config-list.json";
interface ButtonDofProps extends ButtonProps {
  button_key: string;
}
const ButtonWrapper = memo(({ button_key, ...restProps }: ButtonDofProps) => {
  const { hasButton } = usePermission();

  const data = usePageConfig();
  if (!hasButton(button_key)) return null;

  const defaultConfig = configList.list.find(
    (item) => item.code === button_key,
  );
  const config = { ...defaultConfig, ...(data?.config_controls ?? {}) };

  const propsBtn: ButtonProps = {
    className: config.class_name,
  };
  return (
    <>
      {config.status === "active" && (
        <ButtonTera {...propsBtn} {...restProps} data-object_type={button_key}>
          <Icon type={config.icon} className="w-5 h-5 stroke-2" />
          {config.title}
        </ButtonTera>
      )}
    </>
  );
});

export default ButtonWrapper;
