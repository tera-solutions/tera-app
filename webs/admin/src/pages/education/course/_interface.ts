export interface ICourse {
  id?: number;
  code?: string;
  name?: string;
  thumbnail?: string | null;
  duration_minutes?: number | string;
  price_per_lesson?: number | string;
  description?: string | null;
  is_active?: boolean;
  business_id?: number | string;
  business?: { id?: number; name?: string };
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICourseStatistics {
  operational?: {
    total_classes?: number;
    active_classes?: number;
    total_students?: number;
    studying_students?: number;
    reserved_students?: number;
    completed_students?: number;
  };
  financial?: {
    revenue_sales?: number;
    recognized_revenue?: number;
    refunds?: number;
    debt?: number;
    balance?: number;
  };
  rating?: {
    average_rating?: number;
    total_reviews?: number;
    satisfaction_rate?: number;
  };
}

export interface ICourseForm {
  code: string;
  name: string;
  thumbnail?: string;
  duration_minutes?: number | string;
  price_per_lesson?: number | string;
  description?: string;
  is_active?: string;
  business_id?: number | string;
}
