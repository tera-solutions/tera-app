import { Model } from '@nozbe/watermelondb';
import {
  date,
  field,
  readonly,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';

export default class BusinessLocation extends Model {
  static table = 'business_locations';

  @field('server_id') server_id!: number;

  @field('location_id') location_id!: string;
  @text('name') name!: string;
  @text('mobile') mobile!: string;
  @text('address') address!: string;
  @text('landmark') landmark!: string;
  @text('ward') ward!: string;
  @text('state') state!: string;
  @text('city') city!: string;
  @text('country') country!: string;

  // Boolean xử lý chính xác 0/1 -> true/false
  @field('is_default') is_default!: number;
  @field('is_new_address') is_new_address!: number;
  @field('is_delete') is_delete!: number;
  @field('is_dirty') is_dirty!: number;
  @date('last_sync_at') last_sync_at?: number;
  @field('version') version!: number;

  @readonly @date('updated_at') updatedAt!: number;
  @readonly @date('created_at') createdAt!: number;

  @writer async markAsDeleted() {
    if (this?.server_id) {
      console.tron(
        `Record với id: ${this.id} | serverID: ${this?.server_id} đã bị xóa mềm.`,
      );
      await this.update((record) => {
        record.is_delete = 1;
      });
    } else {
      console.tron(`Record với id: ${this.id} đã bị xóo khỏi database.`);
      await this.destroyPermanently();
    }
  }
}
