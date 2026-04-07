import { messageError } from "@tera/commons/constants/message";
import { ReactNode } from "react";
import { notification } from "tera-dls";

interface IErrorProp {
  errorProp: any;
}

const ErrorToast = ({ errorProp }: IErrorProp) => {
  const errors =
    typeof errorProp?.errors !== "string" &&
    errorProp?.errors.length > 0 &&
    errorProp?.errors;

  const errorMessage = errors || [errorProp?.msg] || [messageError.ERROR_API];
  const flattenMessage = Object.values(errorMessage).flat();
  notification.error({
    message: (
      <ul>
        {flattenMessage?.map((message: ReactNode, key) => (
          <li key={key}>{message}</li>
        ))}
      </ul>
    ),
  });
};

export default ErrorToast;
