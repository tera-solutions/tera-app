export interface BusinessLocation {
  id: string;
  server_id?: number,
  business_id?: number;
  location_id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  landmark?: string;
  website?: string;
  is_active: boolean;
  active_text?: { color?: string; text?: string };
  is_default: boolean;
  _raw?: any
}
