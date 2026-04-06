import DB from '@databases/database.native';
import ITableVersion from '@databases/table_version/models/table_version';
import TableVersion from '@databases/table_version/models/table_version.native.';
import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useTableVersion = <T = any>(
  table_name: string,
): ITableVersion | undefined => {
  const [value, setValue] = useState<ITableVersion | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const conditions = [Q.where('table_name', table_name)];

    const query = DB.instance
      .get<TableVersion>('table_version_logs')
      .query(...conditions);

    const subscription = query
      .observeWithColumns(['version', 'is_dirty'])
      .subscribe((records) => {
        if (records.length > 0) {
          const record = records[0];
          setValue({
            version: record.version,
            is_dirty: record.is_dirty,
          } as ITableVersion);
        } else {
          setValue(undefined);
        }
      });

    return () => subscription.unsubscribe();
  }, [table_name]);

  return value;
};
