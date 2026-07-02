import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, getAccountList, openAccount, updateNickname } from "../api/account.api";
import { OpenAccountPayload } from "../types/account.types";

export function useAccountListGroup() {
  const query = useQuery({
    queryKey: ["accList"],
    queryFn: getAccountList,
  });
  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
    result: query.data?.data?.result,
  };
}

export function useOpenAccount() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: OpenAccountPayload) => openAccount(payload),
    onSuccess: (data) => {
      const res = data?.data;
      const isSuccess = res?.status === 200;

      setMessage({
        type: isSuccess ? "success" : "error",
        text: res?.result || (isSuccess ? "Account opened successfully" : "Failed to open account"),
      });

      if (isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["mt5Accounts"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      }
    },
    onError: () => {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    },
  });

  return { ...mutation, message };
}

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: changePassword,
  });
  return mutation;
}

export function useUpdateNickname() {
  const mutation = useMutation({
    mutationFn: updateNickname,
  });
  return mutation;
}
