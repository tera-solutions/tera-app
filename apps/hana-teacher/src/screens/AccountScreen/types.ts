import { LucideIcon } from 'lucide-react-native';

export interface MenuItemType {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  route?: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}