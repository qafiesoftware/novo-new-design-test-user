export interface OtpVerifyPayload {
  otp: string;
  token: string;
}

export interface OtpVerifyResponse {
  data: {
    status: number;
    result: string;
    response: unknown;
  };
}

export interface ResendOtpPayload {
  token: string;
}

export interface ResendOtpResponse {
  data: {
    status: number;
    result: string;
  };
}