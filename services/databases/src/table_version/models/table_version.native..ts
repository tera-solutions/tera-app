import { Model } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";
import moment from "moment";

export default class TableVersion extends Model {
  static table = "table_version_logs";

  @field("table_name") table_name!: string;
  @field("version") version!: number;
  @field("is_dirty") is_dirty!: number;
  @field("last_sync_at") last_sync_at!: number;

  @readonly @date("updated_at") updated_at!: number;
  @readonly @date("created_at") created_at!: number;

  async updateLastSync(timestamp: number, version: number) {
    await this.update((record) => {
      record.last_sync_at = timestamp || moment().unix();
      record.version = version || 0;
      record.is_dirty = 0;
    });
  }
}
