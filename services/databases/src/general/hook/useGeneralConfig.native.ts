import { parseValue } from "@tera/commons/utils";
import DB from "@databases/database.native";
import General from "@databases/general/models/general.native";
import { Q } from "@nozbe/watermelondb";
import { useEffect, useState } from "react";

export const useGeneralConfig = <T = any>(
  key: string,
  version?: number,
): T | undefined => {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    const conditions = [Q.where("key", key)];
    if (typeof version === "number") {
      conditions.push(Q.where("version", version));
    }

    const query = DB.instance.get<General>("generals").query(...conditions);

    const subscription = query.observe().subscribe((records) => {
      if (records.length > 0) {
        const parsed = parseValue(records[0].value);
        setValue(parsed);
      } else {
        setValue(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, [key, version]);

  return value;
};
