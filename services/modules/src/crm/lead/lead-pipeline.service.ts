import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LeadAPI } from "@tera/api";
import { UpdatePayload } from "@tera/api/_interface";

/** Move a lead through the care pipeline (pending/verified/consulting/studying). */
export const useLeadUpdateStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeadAPI.updateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LeadPipelineService = {
  useLeadUpdateStatus,
};
