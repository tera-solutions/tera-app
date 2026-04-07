import { useQuery } from "@tanstack/react-query";
import { followerMode } from "@tera/components/dof/CrmProvider";
import EmployeeApi from "@tera/components/shared/Employee/_api";
import { useEffect } from "react";

interface IProps {
  objectType: string;
  objectId: string;
  follower?: boolean;
  params?: any;
  mode?: followerMode;
  enable?: boolean;
  [key: string]: any;
}
const useGetData = ({
  objectType,
  objectId,
  follower = false,
  params,
  mode,
  enable = true,
  ...props
}: IProps) => {
  const defaultParams = {
    customer: {
      customer_id: objectId,
      follower: follower ? 1 : 0,
    },
    supplier: {
      supplier_id: objectId,
      follower: follower ? 1 : 0,
    },
    task: {
      task_id: objectId,
      follower: follower ? 1 : 0,
    },
    appointment: {
      appointment_id: objectId,
      follower: follower ? 1 : 0,
    },
    call: {
      call_id: objectId,
      follower: follower ? 1 : 0,
    },
    contact: {
      contact_id: objectId,
      follower: follower ? 1 : 0,
    },
  };

  const {
    data: list,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "get-followers",
      objectType,
      objectId,
      mode,
      follower,
      mode === "default" && params,
    ],

    queryFn: () => {
      return EmployeeApi.getList({
        params: {
          onlyUser: 1,
          ...params,
          ...(defaultParams[objectType] ?? {}),
        },
      });
    },

    staleTime: 300000,
    gcTime: 300000,
    enabled: !!objectType && !!objectId && mode === "default" && enable,
    ...props,
  });

  useEffect(() => {
    objectType && objectId && refetch();
  }, [objectType, objectId]);

  return { list, isLoading, refetch, isFetching };
};

export default useGetData;
