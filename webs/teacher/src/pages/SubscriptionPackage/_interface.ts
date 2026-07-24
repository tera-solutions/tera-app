export interface SubscriptionPackageRow {
  id: number;
  name: string;
  type: string;
  price: number | string | null;
  sessions_included: number | null;
  duration_days: number | null;
  applicable_courses: number[] | null;
  status: string;
}
