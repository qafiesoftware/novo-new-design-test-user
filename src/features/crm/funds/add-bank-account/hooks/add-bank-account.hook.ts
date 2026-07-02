import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { addUserBankApi, getUserBankDetailsApi } from "../api/add-bank-account.api";

export function useAddUserBank() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: addUserBankApi,

    onSuccess: (data) => {
      if (data?.status === 200) {
        setMessage({
          type: "success",
          text: data?.result || "Bank account added successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: data?.result || "Failed to add bank account",
        });
      }
    },

    onError: () => {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    },
  });

  return {
    ...mutation,
    message,
    setMessage,
  };
}

// get bank details hook
export function useGetUserBankDetails() {
  const query = useQuery({
    queryKey: ["user-bank-details"],
    queryFn: getUserBankDetailsApi,
  });

  return {
    bankDetails: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
