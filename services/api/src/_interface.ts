// ==========================
// BASE ENTITY
// ==========================
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// ==========================
// API RESPONSE WRAPPER
// ==========================
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// ==========================
// PAGINATION
// ==========================
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ==========================
// LIST / QUERY PARAMS
// ==========================
export interface ListParams<TFilter = any> {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: TFilter;
}

// ==========================
// CRUD PARAMS
// ==========================
export interface DetailPayload {
  id: string | number;
}

export interface CreatePayload<T = any> {
  params: T;
}

export interface UpdatePayload<T = any> {
  id: string | number;
  params: Partial<T>;
}

export interface DeletePayload {
  id: string | number;
}

export interface ExportPayload<T = any> {
  params: T;
}

// ==========================
// FILTER SYSTEM (ADVANCED QUERY)
// ==========================
export interface FilterOperator<T = any> {
  eq?: T;
  neq?: T;
  in?: T[];
  nin?: T[];
  like?: string;
  between?: [T, T];
}

export interface QueryFilter<T = any> {
  [field: string]: T | FilterOperator<T>;
}

// ==========================
// ERROR STRUCTURE
// ==========================
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ==========================
// HTTP CLIENT (DRIVER LAYER)
// ==========================
export interface HttpClient {
  get<T = any>(url: string, params?: any): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>>;
  delete<T = any>(url: string): Promise<ApiResponse<T>>;
}

// ==========================
// BASE API SERVICE CONTRACT
// ==========================
export interface BaseApiService<T, CreateDTO = any, UpdateDTO = any> {
  list(params?: ListParams): Promise<PaginatedResponse<T> | T[]>;
  detail(id: string | number): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: string | number, data: UpdateDTO): Promise<T>;
  delete(id: string | number): Promise<void>;
}

// ==========================
// DOMAIN EXTENSION (OPTIONAL)
// ==========================
export interface DomainApiService<T> extends BaseApiService<T> {
  restore?(id: string | number): Promise<void>;
  bulkDelete?(ids: (string | number)[]): Promise<void>;
  export?(params?: any): Promise<Blob>;
}

// ==========================
// REQUEST CONTEXT (AUTH / TENANT)
// ==========================
export interface RequestContext {
  token?: string;
  tenantId?: string;
  userId?: string;
  locale?: string;
}

// ==========================
// GENERIC ID TYPE (OPTIONAL CONSISTENCY)
// ==========================
export type ID = string | number;

// ==========================
// LIST
// ==========================
export interface ListPayload<TFilter = any> {
  params?: ListParams<TFilter>;
}

// ==========================
// DETAIL
// ==========================
export interface DetailPayload {
  id: string | number;
}

// ==========================
// CREATE
// ==========================
export interface CreatePayload<T = any> {
  params: T;
}

// ==========================
// UPDATE
// ==========================
export interface UpdatePayload<T = any> {
  id: string | number;
  params: Partial<T>;
}

// ==========================
// DELETE
// ==========================
export interface DeletePayload {
  id: string | number;
}
