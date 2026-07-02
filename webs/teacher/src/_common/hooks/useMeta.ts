import { useStores } from "@tera/stores/useStores";

export interface MetaOption {
  key: string;
  value: string;
  label: string;
  color?: string;
  backgroundColor?: string;
}

export interface MetaTab {
  key: string;
  label: string;
}

/**
 * Access the shared enum metadata (status/type/etc.) loaded once from
 * `/auth/metadata` and cached in the global store. Prefer this over hardcoded
 * status/type constants.
 */
export const useMeta = () => {
  const { globalStore } = useStores();

  const getOptions = (name: string): MetaOption[] => globalStore.getOptions(name);

  return {
    getOptions,
    getItem: (name: string, value?: string | null): MetaOption | undefined =>
      globalStore.getMetaItem(name, value),
    getLabel: (name: string, value?: string | null): string =>
      globalStore.getMetaLabel(name, value),
    /** Build filter tabs from a metadata list, prefixed with an "all" tab. */
    getTabs: (name: string, allLabel = "Tất cả"): MetaTab[] => [
      { key: "all", label: allLabel },
      ...getOptions(name).map((o) => ({ key: o.value, label: o.label })),
    ],
  };
};
