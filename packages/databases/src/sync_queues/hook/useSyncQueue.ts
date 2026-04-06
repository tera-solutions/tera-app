import DB from '@databases/database';
import { useLiveQuery } from 'dexie-react-hooks';

export const useSyncQueue = () => {
  return useLiveQuery(
    async () => {
      const count = await DB.sync_queues
        .where('status')
        .equals('queue')
        .count();

      return { count: count || 0 };
    },
    [],
    { count: 0 },
  );
};
