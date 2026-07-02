import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { becomePartnerAPI } from "../api/ib-register.api";

type MessageType = {
  type: "success" | "error" | "info";
  text: string;
} | null;

type ApiErrorResponse = {
  data: BecomePartnerResponse;
};

type BecomePartnerResponse = {
  status: number;
  result: string;
  response: unknown[];
};

export const useBecomePartner = (onSuccessCallback?: (data: BecomePartnerResponse) => void) => {
  const [message, setMessage] = useState<MessageType>(null);

  const mutation = useMutation({
    mutationFn: becomePartnerAPI,

    onSuccess: (data) => {
      const res = data as BecomePartnerResponse;

      if (res?.status === 200) {
        setMessage({
          type: "success",
          text: res?.result || "Success",
        });
      } else if (res?.status === 202) {
        setMessage({
          type: "info",
          text: res?.result || "Pending request",
        });
      } else if (res?.status === 400) {
        setMessage({
          type: "error",
          text: res?.result || "Already a partner",
        });
      } else {
        setMessage({
          type: "error",
          text: res?.result || "Unexpected response",
        });
      }

      onSuccessCallback?.(res);
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errData = error?.response?.data?.data as BecomePartnerResponse | undefined;

      if (errData?.status === 400) {
        setMessage({
          type: "error",
          text: errData?.result || "Already a partner",
        });
      } else {
        setMessage({
          type: "error",
          text: errData?.result || "Something went wrong",
        });
      }
    },
  });

  return {
    ...mutation,
    message,
  };
};
