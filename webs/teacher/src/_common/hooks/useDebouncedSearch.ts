import { useEffect, useState } from "react";

/**
 * Local draft state for a search input, committed to the URL/query after a
 * pause in typing so every keystroke doesn't trigger a refetch.
 */
export const useDebouncedSearch = (
  value: string,
  onCommit: (trimmed: string) => void,
  delay = 400,
) => {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = draft.trim();
      if (trimmed !== value) onCommit(trimmed);
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return [draft, setDraft] as const;
};
