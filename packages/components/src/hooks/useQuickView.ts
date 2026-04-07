import React from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "./useStores";

export type DETAIL_TYPE =
  | "purchase_request"
  | "purchase"
  | "sell"
  | "product"
  | "supplier"
  | "price_quote"
  | "purchase_return"
  | "sell_return"
  | "contact"
  | "customer"
  | "appointment"
  | "customer_board"
  | "task"
  | "call"
  | "consulting_ticket"
  | "lead"
  | "opportunity";

const url = {
  purchase_request: "/purchase/purchase-request/detail",
  purchase: "/purchase/purchase-management/detail",
  sell: "/sale/sale-order/detail",
  price_quote: "/sale/price-quotation/detail",
  sell_return: "/sale/sale-order-return/detail",
  product: "/warehouse/product-management/list",
  supplier: "/purchase/supplier/detail",
  customer: "/sale/customer/detail",
  customer_board: "/sale/customer/detail",
  contact: "/sale/contact/detail",
  purchase_return: "/purchase/purchase-return/detail",
  appointment: "/customer-care/appointment/update",
  task: "/customer-care/task/detail",
  call: "/customer-care/call/detail",
  consulting_ticket: "/customer-care/consulting-ticket/detail",
  lead: "/marketing/lead-management/detail",
  opportunity: "/marketing/opportunity-management/detail",
};

export interface useQuickViewProps {
  detail_type: DETAIL_TYPE;
  detail_id: string | number;
  onClose?: () => void;
  onView?: () => void;
  footer?: React.ReactNode;
  permission_detail?: any;
}

function useQuickView() {
  const {
    quickViewStore: { setOpen, setClose },
  } = useStores();
  const navigate = useNavigate();

  const redirectDetails = (detail_type: DETAIL_TYPE, detail_id) => {
    switch (detail_type) {
      case "purchase_request":
        return navigate(`${url.purchase_request}/${detail_id}`);
      case "purchase":
        return navigate(`${url.purchase}/${detail_id}`);
      case "sell":
        return navigate(`${url.sell}/${detail_id}`);
      case "price_quote":
        return navigate(`${url.price_quote}/${detail_id}`);
      case "sell_return":
        return navigate(`${url.sell_return}/${detail_id}`);
      case "product":
        return navigate(`${url.product}/${detail_id}`);
      case "supplier":
        return navigate(`${url.supplier}/${detail_id}`);
      case "customer":
        return navigate(`${url.customer}/${detail_id}`);
      case "customer_board":
        return navigate(`${url.customer_board}/${detail_id}`);
      case "contact":
        return navigate(`${url.contact}/${detail_id}`);
      case "purchase_return":
        return navigate(`${url.purchase_return}/${detail_id}`);
      case "appointment":
        return navigate(`${url.appointment}/${detail_id}`);
      case "task":
        return navigate(`${url.task}/${detail_id}`);
      case "call":
        return navigate(`${url.call}/${detail_id}`);
      case "consulting_ticket":
        return navigate(`${url.consulting_ticket}/${detail_id}`);
      case "lead":
        return navigate(`${url.lead}/${detail_id}`);
      case "opportunity":
        return navigate(`${url.purchase_request}/${detail_id}`);
    }
  };

  const quickView = (values: useQuickViewProps) => {
    setOpen(values);
  };

  return { quickView, redirectDetails, setClose };
}

export default useQuickView;
