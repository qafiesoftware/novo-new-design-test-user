import { ApiResponse } from "./../../../../types/api.types";

export interface KycDocument {
  kyc_identity_number: string;
  kyc_date: string;
  kyc_remark: string;
  identity_front_photo: string;
  identity_back_photo: string;
  address_photo: string;
  accepted_date: string;
  doc_type: string;
  address_photo_back: string;
  address_doc_type: string;
  applicant_id: string;
  verification_link: string;
  verification_status: string;
  kyc_status: string;
}
export interface EkycPayload {
  doc_type: string;
  doc_number: string;
  doc_type2: string;
  doc_number2: string;
  doc_front?: File;
  doc_back?: File;
  doc_front2?: File;
  doc_back2?: File;
}

export type EkycResponse = ApiResponse<KycDocument[]>;

// personal details
export interface UserProfileData {
  first_name: string;
  last_name: string;
  birthdate: string;
  user_bio: string;
  user_reg_code: string;
  user_reg_date: string;
  user_mobile: string;
  user_country: string;
  user_img: string;
  contryname: string;
}
export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  dob: string;
  bio: string;
  mobileno?: string | number;
  user_img?: File;
}

export type UpdateProfileResponse = ApiResponse<UserProfileData>;
export type UserProfileResponse = ApiResponse<UserProfileData>;

// update-password
export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export type UpdatePasswordResponse = ApiResponse<UpdatePasswordPayload>;
