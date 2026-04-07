import { useStores } from "hooks/useStores";
import { useParams } from "react-router-dom";
import { ISetQuickAction } from "@tera/states/stores/interface";

function useQuickAction() {
  const {
    quickActionStore: { actions, setQuickAction, clearQuickAction },
  } = useStores();

  const { id } = useParams();
  const convertId = Number(id) || null;
  const openQuickAction = (values: ISetQuickAction) => {
    const params = {
      open: true,
      object_type: values.object_type,
      object_id: values?.object_id || convertId,
      active_key: values?.active_key || values?.actions?.[0] || actions?.[0],
      actions: values?.actions,
      params: values?.params,
    };
    setQuickAction(params);
  };

  return { openQuickAction, clearQuickAction };
}

export default useQuickAction;
