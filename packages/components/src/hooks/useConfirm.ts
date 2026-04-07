import { IConfirmStore } from "../stores/interface";
import { useStores } from "./useStores";

function useConfirm() {
  const {
    confirmStore: { setOpenConfirm },
  } = useStores();

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
