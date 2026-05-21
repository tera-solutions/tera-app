import { IConfirmStore } from "@tera/game/states/_interface";
import { useStates } from "./useStates";

function useConfirm() {
  const {
    confirmStore: { setOpenConfirm },
  } = useStates();

  const confirm = {
    success({ align, content, onCancel, onOk, ...props }: IConfirmStore) {
      setOpenConfirm({
        content,
        type: "success",
        align,
        onCancel,
        onOk,
        props,
      });
    },
    warning({ align, content, onCancel, onOk, ...props }: IConfirmStore) {
      setOpenConfirm({
        content,
        align,
        type: "warning",
        onCancel,
        onOk,
        props,
      });
    },
    error({ align, content, onCancel, onOk, ...props }: IConfirmStore) {
      setOpenConfirm({
        content,
        type: "error",
        align,
        onOk,
        onCancel,
        props,
      });
    },
    default({ align, content, onCancel, onOk, ...props }: IConfirmStore) {
      setOpenConfirm({
        content,
        type: null,
        align,
        onCancel,
        onOk,
        props,
      });
    },
  };

  return confirm;
}

export default useConfirm;
