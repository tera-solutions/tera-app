import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LeadAPI } from "@tera/api";
import { UpdatePayload } from "@tera/api/_interface";

/** Convert a lead into a student — creates the student, links it back to the
 * lead, and moves the lead to "studying". */
export const useLeadConvert = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeadAPI.convert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LeadActivityService = {
  useLeadConvert,
};
