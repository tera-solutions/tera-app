/**
 * First non-nullish, non-empty value among the candidate keys of `obj`.
 * Each path supports dotted access (e.g. "class_room.name"). Used by the
 * page normalizers to read loosely-shaped API payloads.
 */
export const pick = (obj: any, paths: string[]): any => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
    if (value != null && value !== "") return value;
  }
  return undefined;
};
