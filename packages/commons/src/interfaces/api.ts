export interface IRequestMutation {
  callback?: (res: any) => void;
  errors?: (error: any) => void;
}

export interface IResponseMutation {
  onSubmit: (variables: any) => void;
  isSuccess: boolean;
  isLoading: boolean;
}

export type TParamsApi = {
  [key: string]: any;
};

export interface ResponseGetApi<T = any> {
  current_page?: number;
  data: T;
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  next_page_url?: string;
  path?: string;
  per_page?: number;
  prev_page_url?: string;
  to?: number;
  total?: number;
}
type ResponseOf<T> = T extends T[] ? ResponseGetApi<T> : T;

export type ResponseApi<T> = {
  metadata: { limit: any; page: any; total: any };
  code: number;
  data: ResponseOf<T> | any;
  errors: any;
  msg: string;
  message: string;
  success: boolean;
};
