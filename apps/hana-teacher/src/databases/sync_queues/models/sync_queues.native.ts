import { ISyncAction, ISyncStatus, ISyncType } from '@tera/commons/interfaces';
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class SyncQueue extends Model {
  static table = 'sync_queues';

  @field('table_name') table_name!: string;
  @field('record_id') record_id!: string;
  @field('type') type!: ISyncType;
  @field('action') action!: ISyncAction;
  @field('payload') payload!: string;
  @field('retries') retries!: number;
  @field('status') status!: ISyncStatus;

  @readonly @date('updated_at') updatedAt!: number;
  @readonly @date('created_at') createdAt!: number;
}
