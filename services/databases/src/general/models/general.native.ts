import { Model } from "@nozbe/watermelondb";
import { date, field, json, readonly } from "@nozbe/watermelondb/decorators";

export default class General extends Model {
  static table = "generals";

  @field("key") key!: string;
  @json("value", (json) => json || {}) value!: any;
  @field("version") version!: number;

  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("created_at") createdAt!: number;
}
