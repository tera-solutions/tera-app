import { parseValue } from '@tera/common/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import DB from '../../database';

export const useGeneralConfig = <T = any>(
  key: string,
  version?: number,
): number | undefined => {
  return useLiveQuery(async () => {
    const query = DB.generals.toCollection();
    const records = await query
      .filter((rows) => {
        return (
          (!key || rows.key === key) && (!version || rows.version === version)
        );
      })
      .toArray();
    if (records.length > 0 && records[0]?.value) {
      return parseValue(records[0]?.value);
    }
    return null;
  }, [key, version]);
};
