import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgot-password.api";

export function useForgotPassword() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (data) => {
      const responseData = data?.data?.data;
      if (responseData?.status == 200) {
        setMessage({
          type: "success",
          text: responseData?.result || "Reset link sent successfully.",
        });
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "Failed to send reset link. Please try again.",
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

  return { ...mutation, message };
}
