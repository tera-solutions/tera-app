import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { UploadedFile } from "@tera/api/common/FileAPI";
import {
  AttachMaterialPayload,
  DetachMaterialPayload,
  LessonMaterialAPI,
} from "@tera/api";

export const useLessonMaterialUpload = () => {
  const { t } = useTranslation();
  return useMutationAdapter<UploadedFile, Error, File>({
    mutationFn: (file) => LessonMaterialAPI.upload(file),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonMaterialAttach = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter<any, Error, AttachMaterialPayload>({
    mutationFn: (payload) => LessonMaterialAPI.attach(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonMaterialDetach = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter<any, Error, DetachMaterialPayload>({
    mutationFn: (payload) => LessonMaterialAPI.detach(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LessonMaterialService = {
  useLessonMaterialUpload,
  useLessonMaterialAttach,
  useLessonMaterialDetach,
};
