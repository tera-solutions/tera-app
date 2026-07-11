import type { LucideIcon } from 'lucide-react-native';

export interface MoreItemType {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  url?: string;
}

export interface SectionType {
  id: string;
  title: string;
  items: MoreItemType[];
}
