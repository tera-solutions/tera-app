import { SyncStatus } from '@common/interfaces';
import DB from '@databases/database.native';
import SyncQueue from '@databases/sync_queues/models/sync_queues.native';
import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

export const useSyncQueue = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const conditions = [Q.where('status', SyncStatus.QUEUED)];

    const query = DB.instance
      .get<SyncQueue>('sync_queues')
      .query(...conditions);

    const subscription = query.observeCount().subscribe({
      next: (newCount) => {
        setCount(newCount);
      },
      error: (err) => console.error('SyncQueue observation error:', err),
    });

    // Clean up subscription khi unmount
    return () => subscription.unsubscribe();
  }, []);

  return { count };
};
