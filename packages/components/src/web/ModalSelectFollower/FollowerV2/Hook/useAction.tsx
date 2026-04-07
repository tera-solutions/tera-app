import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import AppointmentApi from "@tera/components/shared/Activity/containers/Appointment/_api";
import CallApi from "@tera/components/shared/Activity/containers/Call/_api";
import TaskApi from "@tera/components/shared/Activity/containers/Task/_api";
import ContactApi from "@tera/components/shared/Contact/_api";
import CustomerApi from "@tera/components/shared/CustomerManagement/_api/customer";
import SupplierApi from "@tera/components/shared/CustomerManagement/_api/supplier";
import { notification } from "tera-dls";

const useAction = (objectId, objectType) => {
  const queryClient = useQueryClient();
  const addApi = {
    customer: {
      api: CustomerApi.addFollower,
      params: { customer_id: objectId },
    },
    supplier: {
      api: SupplierApi.addFollower,
      params: { supplier_id: objectId },
    },
    task: {
      api: TaskApi.addFollower,
      params: { task_id: objectId },
    },
    appointment: {
      api: AppointmentApi.addFollower,
      params: { appointment_id: objectId },
    },
    call: {
      api: CallApi.addFollower,
      params: { call_id: objectId },
    },
    contact: {
      api: ContactApi.addFollower,
      params: { call_id: objectId },
    },
  };

  const deleteApi = {
    customer: {
      api: CustomerApi.deleteFollower,
      params: { customer_id: objectId },
    },
    supplier: {
      api: SupplierApi.deleteFollower,
      params: { supplier_id: objectId },
    },
    task: {
      api: TaskApi.deleteFollower,
      params: { task_id: objectId },
    },
    appointment: {
      api: AppointmentApi.deleteFollower,
      params: { appointment_id: objectId },
    },
    call: {
      api: CallApi.deleteFollower,
      params: { call_id: objectId },
    },
    contact: {
      api: ContactApi.deleteFollower,
      params: { call_id: objectId },
    },
  };

  const { mutate: mutateAdd, isLoading: isAdding } = useMutationLegacy({
    mutationFn: (variables: any) => {
      return addApi[objectType]?.api?.({
        params: { followers: variables, ...addApi[objectType]?.params },
      });
    },

    onSuccess: (res: any) => {
      if (res.code === 200) {
        queryClient.invalidateQueries({
          queryKey: ["get-followers"],
        });
        notification.success({
          message: res?.msg,
        });
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutationLegacy({
    mutationFn: (variables: any) => {
      return deleteApi[objectType]?.api?.({
        params: { followers: variables, ...deleteApi[objectType]?.params },
      });
    },

    onSuccess: (res: any) => {
      if (res.code === 200) {
        queryClient.invalidateQueries({
          queryKey: ["get-followers"],
        });
        notification.success({
          message: res?.msg,
        });
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  return { onAdd: mutateAdd, onRemove: mutateDelete, isAdding, isDeleting };
};

export default useAction;
