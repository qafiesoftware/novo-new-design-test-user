export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    status: number;
    result: string;
    authType?: number;
    response?: {
      token?: string;
    };
  };
}