export interface Country {
  country_id: string;
  country_name: string;
  country_code: string;
}

export interface CountryListResponse {
  data: {
    response: Country[];
  };
}

// Register payload
export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country_id: string;
  mobileno: string;
  partnercode?: string;
  inputchecked: boolean;
}

// Register API response

export interface RegisterResponse {
  data: {
    status: number;
    result: string;
    response: {
      token: string;
    };
  };
}