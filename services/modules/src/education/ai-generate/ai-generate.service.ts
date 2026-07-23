import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { AiGenerateAPI } from "@tera/api";
import type {
  AiGenerateRequestPayload,
  AiJobEnqueuedResponse,
  AiVocabularySearchPayload,
} from "@tera/api";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

// QUERY
export const useAiGenerateHealth = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "health"],
    queryFn: () => AiGenerateAPI.getHealth(),
    ...options,
  });
};

export const useAiImageAssets = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "image", "assets", payload.id],
    queryFn: () => AiGenerateAPI.getImageAssets(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useAiVocabularyList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "vocabulary", "list", payload.params],
    queryFn: () => AiGenerateAPI.getVocabularyList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useAiVocabularySearch = (
  payload: AiVocabularySearchPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "vocabulary", "search", payload.params],
    queryFn: () => AiGenerateAPI.searchVocabulary(payload),
    enabled: !!payload.params?.q,
    keepPreviousData: true,
    ...options,
  });
};

export const useAiVocabularyDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "vocabulary", "detail", payload.id],
    queryFn: () => AiGenerateAPI.getVocabularyDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useAiJobList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "job", "list", payload.params],
    queryFn: () => AiGenerateAPI.getJobList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useAiJobDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["ai-generate", "job", "detail", payload.id],
    queryFn: () => AiGenerateAPI.getJobDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
const useAiGenerateMutation = (
  mutationFn: (payload: AiGenerateRequestPayload) => Promise<AiJobEnqueuedResponse>,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-generate", "job", "list"] });
      queryClient.invalidateQueries({ queryKey: ["ai-generate", "vocabulary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAiImageGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateImage);

export const useAiVideoGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateVideo);

export const useAiAudioGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateAudio);

export const useAiStoryGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateStory);

export const useAiDialogueGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateDialogue);

export const useAiLessonGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateLesson);

export const useAiFlashcardGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateFlashcard);

export const useAiEbookGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateEbook);

export const useAiComicGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateComic);

export const useAiMindmapGenerate = () => useAiGenerateMutation(AiGenerateAPI.generateMindmap);

export const AiGenerateService = {
  useAiGenerateHealth,
  useAiImageAssets,
  useAiVocabularyList,
  useAiVocabularySearch,
  useAiVocabularyDetail,
  useAiJobList,
  useAiJobDetail,
  useAiImageGenerate,
  useAiVideoGenerate,
  useAiAudioGenerate,
  useAiStoryGenerate,
  useAiDialogueGenerate,
  useAiLessonGenerate,
  useAiFlashcardGenerate,
  useAiEbookGenerate,
  useAiComicGenerate,
  useAiMindmapGenerate,
};
