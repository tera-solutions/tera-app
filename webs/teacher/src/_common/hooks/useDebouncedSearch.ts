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

  // Keep the draft in sync when `value` changes for a reason other than our
  // own commit below (e.g. a "reset filters" button, browser back/forward),
  // so the input doesn't keep showing stale text after an external reset.
  useEffect(() => {
    setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
