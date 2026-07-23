export type SettingsTabKey =
  | "profile"
  | "notification"
  | "general"
  | "appearance"
  | "password"
  | "bank_account"
  | "recurring_invoice"
  | "evaluation_criteria";

export interface SettingRow {
  id: number;
  key: string;
  value: string | null;
  type: string;
  group: string | null;
}

export type SettingValueMap = Record<string, SettingRow | undefined>;
