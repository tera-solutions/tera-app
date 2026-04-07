import { CustomerObjectType } from '@modules/sale/Customer/_interface';
import { Model } from '@nozbe/watermelondb';
import {
  date,
  field,
  json,
  readonly,
  writer,
} from '@nozbe/watermelondb/decorators';

export default class Customer extends Model {
  static table = 'customers';

  @field('server_id') server_id!: number;
  @field('code') code!: string;
  @field('business_name') business_name!: string;
  @field('phone') phone!: string;
  @field('avatar_url') avatar_url!: string;
  @field('email') email!: string;
  @field('address') address!: string;
  @field('tax') tax!: string;
  @field('object') object!: CustomerObjectType;
  @field('debt_limit') debt_limit!: number;
  @field('debt_period') debt_period!: number;
  @json('raw_data', (json) => json || {}) raw_data!: any;

  @field('is_delete') is_delete!: number;
  @field('is_dirty') is_dirty!: number;

  @readonly @date('updated_at') updatedAt!: number;
  @readonly @date('created_at') createdAt!: number;

  /**
   * Getter để UI Web/Mobile truy cập data nhanh không cần JSON.parse thủ công
   */
  get details() {
    try {
      return JSON.parse(this.raw_data || '{}');
    } catch (e) {
      return {};
    }
  }

  /**
   * Logic xóa mềm/xóa vĩnh viễn đồng nhất cho cả Web và Native
   */
  @writer async markAsDeleted() {
    if (this?.server_id) {
      // Record đã có trên server -> Xóa mềm để sync
      await this.update((record) => {
        record.is_delete = 1;
        // Cập nhật raw_data nếu cần đồng bộ flag delete lên server
        try {
          const currentData = JSON.parse(record.raw_data || '{}');
          record.raw_data = JSON.stringify({ ...currentData, is_delete: 1 });
        } catch (e) {}
      });
      console.log(
        `[Web/Native] Soft deleted: ${this.id} (ServerID: ${this.server_id})`,
      );
    } else {
      // Record local chưa sync -> Xóa hẳn
      await this.destroyPermanently();
      console.log(`[Web/Native] Permanently deleted: ${this.id}`);
    }
  }
}
