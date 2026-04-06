export default interface BusinessLocation {
  id: string | number;
  client_id?: string;
  server_id: number;
  location_id?: string;
  name?: string;
  mobile?: string;
  address?: string;
  landmark?: string;
  ward?: string;
  state?: string;
  city?: string;
  country?: string;
  is_default?: number;
  is_new_address?: number;
  is_delete?: number;
  is_dirty?: number;
  last_sync_at?: Date;
  version?: number;
  updated_at?: Date;
}
