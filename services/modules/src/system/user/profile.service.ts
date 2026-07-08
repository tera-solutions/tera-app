import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { AuthApi } from "@tera/api/auth/auth";

// QUERY
export const useProfile = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["profile"],
    queryFn: () => AuthApi.getProfile(),
    ...options,
  });
};

// MUTATION
export const useProfileUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (params: any) => AuthApi.updateProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useChangePassword = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (params: { current_password: string; new_password: string }) =>
      AuthApi.changePassword(params),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ProfileService = {
  useProfile,
  useProfileUpdate,
  useChangePassword,
};
