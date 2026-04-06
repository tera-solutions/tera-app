export interface listPayload {
  params?: any;
}

export interface detailPayload {
  id: string;
}

export interface createPayload {
  params: any;
  callback?: (data?: any) => void;
}

export interface updatePayload {
  id: string;
  params: any;
  callback?: (data?: any) => void;
}

export interface deletePayload {
  id: string;
  callback?: (data?: any) => void;
}
