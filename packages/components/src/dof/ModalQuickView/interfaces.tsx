import { DETAIL_TYPE } from "@tera/commons/hooks/useQuickView";
import { ReactNode } from "react";

export type ModalQuickViewProps = {
  open: boolean;
  detail_id: number;
  detail_type: DETAIL_TYPE;
  onView: () => void;
  onClose: () => void;
  footer: ReactNode;
  permission?: any;
};
