import { EXPORTING_KEYS } from "../constants";

export type ItemCode = keyof typeof EXPORTING_KEYS;

export interface ImportFile {
  file: string;
  overwrite: boolean;
}
