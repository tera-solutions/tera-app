import { useLiveQuery } from 'dexie-react-hooks';
import DB from '../../database';
import TableVersion from '../models/table_version';

export const useTableVersion = <T = any>(
  table_name: string,
): TableVersion | undefined => {
  return useLiveQuery(async () => {
    // Logic query tương đương Q.where trong Watermelon
    const log = await DB.table_version_logs
      .where('table_name')
      .equals(table_name)
      .first();
    console.log(table_name, log);

    return log;
  }, [table_name]);
};
