export const OBJECT_KEY_CRM = {
  customer: "crm_customer",
  supplier: "crm_supplier",
  consulting_ticket: "crm_consulting_ticket",
  opportunity: "crm_opportunity",
  contact: "crm_contact",
  employee: "crm_employee",
  quote: "crm_quote",
  sale_order: "crm_sale_order",
  sale_order_return: "crm_sale_order_return",
  purchase_request: "crm_purchase_request",
  purchase_order: "crm_purchase_order",
  purchase_order_return: "crm_purchase_order_return",
  product: "crm_product",
  category: "crm_category",
  branch: "crm_branch",
  unit: "crm_unit",
  warehouse: "crm_warehouse",
  dc: "crm_dc",
  task: "crm_task",
  appointment: "crm_appointment",
  call: "crm_call",
  lead: "crm_lead",
  campaign: "crm_campaign",
  member: "crm_member",
  outbound_inspection: "crm_outbound_inspection",
  inbound_inspection: "crm_inbound_inspection",
  config_menu: "sys_config_menu",
  config_status: "sys_config_status",
  config_permission: "sys_config_permission",
  config_mail: "sys_config_mail",
  config_print: "sys_config_print",
  system_page: "sys_manage_page"
};

export const PAGE_KEY_PERMISSION = {
  // SALE
  customer_list: 'sale_customer_view_customer_list',
  customer_create: 'sale_customer_create_customer',
  customer_update: 'sale_customer_update_customer',
  customer_detail: 'sale_customer_view_customer_detail',

  contact_list: 'sale_customer_view_contact_list',
  contact_create: 'sale_customer_create_contact',
  contact_update: 'sale_customer_update_contact',
  contact_detail: 'sale_customer_view_contact_detail',

  quotation_list: 'sale_sale_view_quotation_list',
  quotation_create: 'sale_sale_create_quotation',
  quotation_update: 'sale_sale_update_quotation',
  quotation_detail: 'sale_sale_view_quotation_detail',

  sale_order_list: 'sale_sale_view_sale_order_list',
  sale_order_create: 'sale_sale_create_sale_order',
  sale_order_update: 'sale_sale_update_sale_order',
  sale_order_detail: 'sale_sale_view_sale_order_detail',

  sale_order_return_list: 'sale_sale_view_sale_order_return_list',
  sale_order_return_create: 'sale_sale_create_sale_order_return',
  sale_order_return_update: 'sale_sale_update_sale_order_return',
  sale_order_return_detail: 'sale_sale_view_sale_order_return_detail',

  // PURCHASE
  supplier_list: 'purchase_supplier_view_supplier_list',
  supplier_create: 'purchase_supplier_create_supplier',
  supplier_update: 'purchase_supplier_update_supplier',
  supplier_detail: 'purchase_supplier_view_supplier_detail',

  purchase_request_list: 'purchase_purchase_view_purchase_request_list',
  purchase_request_create: 'purchase_purchase_create_purchase_request',
  purchase_request_update: 'purchase_purchase_update_purchase_request',
  purchase_request_detail: 'purchase_purchase_view_purchase_request_detail',

  purchase_order_list: 'purchase_purchase_view_purchase_order_list',
  purchase_order_create: 'purchase_purchase_create_purchase_order',
  purchase_order_update: 'purchase_purchase_update_purchase_order',
  purchase_order_detail: 'purchase_purchase_view_purchase_order_detail',

  purchase_return_list: 'purchase_purchase_view_purchase_order_return_list',
  purchase_return_create: 'purchase_purchase_create_purchase_order_return',
  purchase_return_update: 'purchase_purchase_update_purchase_order_return',
  purchase_return_detail: 'purchase_purchase_view_purchase_order_return_detail',

  // WAREHOUSE
  product_list: 'wh_product_view_product_list',
  product_create: 'wh_product_create_product',
  product_update: 'wh_product_update_product',
  product_detail: 'wh_product_view_product_detail',
  product_history: 'wh_product_view_product_history_list',

  category_list: 'wh_product_view_category_list',
  brand_list: 'wh_product_view_brand_list',
  unit_list: 'wh_product_view_unit_list',

  outbound_inspection_list: 'wh_warehouse_view_outbound_inspection_list',
  outbound_inspection_detail: 'wh_warehouse_view_outbound_inspection_detail',
  outbound_inspection_confirm: 'wh_warehouse_approve_outbound_inspection',

  inbound_inspection_list: 'wh_warehouse_view_inbound_inspection_list',
  inbound_inspection_detail: 'wh_warehouse_view_inbound_inspection_detail',
  inbound_inspection_confirm: 'wh_warehouse_approve_inbound_inspection',

  dashboard_stock: 'wh_warehouse_view_warehouse_list',
  transfer_stock: 'wh_warehouse_view_warehouse_transfer_list',
  inventory_forecast: 'wh_warehouse_view_warehouse_forecast',
  stock_in_out: 'wh_warehouse_view_warehouse_stock_in_out',

  // LOGISTIC
  delivery_sell_list: 'log_delivery_view_outbound_delivery_list',
  delivery_sell_detail: 'log_delivery_view_outbound_delivery_detail',

  delivery_purchase_list: 'log_delivery_view_inbound_delivery_list',
  delivery_purchase_detail: 'log_delivery_view_inbound_delivery_detail',

  delivery_company_list: 'log_dc_view_dc_list',

  // FINANCE
  cash_receipt_list: 'fin_cashbook_view_cash_receipt_list',
  cash_receipt_create: 'fin_cashbook_create_cash_receipt',
  cash_receipt_update: 'fin_cashbook_update_cash_receipt',

  expense_voucher_list: 'fin_cashbook_view_expense_voucher_list',
  expense_voucher_create: 'fin_cashbook_create_expense_voucher',
  expense_voucher_update: 'fin_cashbook_update_expense_voucher',

  finance_statistic: 'fin_cashbook_view_statistic_list',

  sale_order_confirm_list: 'fin_invoice_view_sale_order_list',
  sale_order_confirm_detail: 'fin_invoice_view_sale_order_detail',
  sale_order_confirm_payment: 'fin_invoice_payment_sale_order',

  sale_order_confirm_return_list: 'fin_invoice_view_sale_order_return_list',
  sale_order_confirm_return_detail: 'fin_invoice_view_sale_order_return_detail',
  sale_order_confirm_return_refund: 'fin_invoice_refund_sale_order_return',

  purchase_order_confirm_list: 'fin_invoice_view_purchase_order_list',
  purchase_order_confirm_detail: 'fin_invoice_view_purchase_order_detail',

  purchase_order_confirm_return_list:
    'fin_invoice_view_purchase_order_return_list',
  purchase_order_confirm_return_detail:
    'fin_invoice_view_purchase_order_return_detail',
  purchase_order_confirm_return_refund:
    'fin_invoice_refund_purchase_order_return',

  fin_debt_view_customer_debt_list: 'fin_debt_view_customer_debt_list',
  fin_debt_view_customer_order_list: 'fin_debt_view_customer_order_list',

  fin_debt_view_supplier_debt_list: 'fin_debt_view_supplier_debt_list',
  fin_debt_view_supplier_order_list: 'fin_debt_view_supplier_order_list',

  // HR
  employee_list: 'hr_hr_view_employee_list',

  // MARKETING
  campaign_list: 'mkt_opportunity_view_campaign_list',
  campaign_create: 'mkt_opportunity_create_campaign',
  campaign_update: 'mkt_opportunity_update_campaign',
  campaign_detail: 'mkt_opportunity_view_campaign_detail',

  group_stage_list: 'mkt_opportunity_view_stage_group_list',
  group_stage_detail: 'mkt_opportunity_view_stage_group_list',
  set_group_stage: 'mkt_opportunity_view_stage_list',

  lead_list: 'mkt_opportunity_view_lead_list',
  lead_create: 'mkt_opportunity_create_lead',
  lead_update: 'mkt_opportunity_update_lead',
  lead_detail: 'mkt_opportunity_view_lead_detail',

  opportunity_list: 'mkt_opportunity_view_opportunity_list',
  opportunity_detail: 'mkt_opportunity_view_opportunity_detail',

  backlog: 'mkt_opportunity_view_opportunity_list',

  email_marketing_list: 'mkt_marketing_view_email_marketing_list',
  email_marketing_detail: 'mkt_marketing_view_email_marketing_detail',
  email_marketing_statistic: 'mkt_marketing_view_email_marketing_statistic',

  // CUSTOMER CARE
  consulting_ticket_list: 'cs_care_view_consulting_ticket_list',
  consulting_ticket_detail: 'cs_care_view_consulting_ticket_detail',

  task_list: 'cs_care_view_task_list',
  task_detail: 'cs_care_view_task_detail',

  call_list: 'cs_care_view_call_list',
  call_detail: 'cs_care_view_call_detail',

  appointment_list: 'cs_care_view_appointment_list',
  appointment_detail: 'cs_care_view_appointment_detail',

  implementer_change_list: 'cs_care_view_change_implementer_list',

  // REPORT
  report_inventory: 'crm_report_view_stock_report_list',
  report_purchase: 'purchase_report_view_purchase_report_list',
  report_sale: 'sale_report_view_sale_report_list',
  report_activity: 'cs_report_view_activity_report_list',
  report_consulting_ticket: 'cs_report_view_consulting_ticket_report_list',
  report_opportunity: 'mkt_report_view_opportunity_report_list',
  report_campaign: 'mkt_report_view_campaign_report_list',

  // --- OPERATION & DASHBOARD ---
  dashboard: 'sys_operation_view_dashboard',
  config_menu: 'sys_operation_view_config_menu',
  config_status: 'sys_operation_view_config_status',
  config_permission: 'sys_operation_view_config_permission',
  config_system: 'sys_operation_view_config_system',

  // --- DATA & CONFIG ---
  config_import_data: 'sys_config_view_import_data',
  config_export_data: 'sys_config_view_export_data',
  config_print: 'sys_config_view_config_print',
  
  // --- MAIL CONFIG & STATISTIC ---
  config_mail: 'sys_mail_view_config_list',
  mail_history: 'sys_mail_view_history_list',
  mail_statistic: 'sys_mail_view_statistic',

  // --- SYSTEM MANAGEMENT ---
  manage_page_list: 'sys_system_view_manage_page_list',
};
