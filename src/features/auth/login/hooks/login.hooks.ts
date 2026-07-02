import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/login.api";

export function useLogin() {
  const router = useRouter();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const apiData = data?.data;

      if (apiData?.status === 200) {
        const authType = Number(apiData?.authType ?? 0);

        if (authType === 0) {
          const token = apiData?.response;
          document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
          localStorage.setItem("UserLogedIn", "true");
          router.push("/");
        } else if (authType === 1) {
          if (apiData?.response?.token) {
            sessionStorage.setItem("tempVerifyToken", apiData.response.token);
          }
          router.push("/email-verify");
        } else {
          localStorage.setItem("UserLogedIn", "true");
          router.push("/");
        }
      } else if (
        apiData?.status === 400 &&
        apiData?.result?.toLowerCase().includes("email is not verify")
      ) {
        if (apiData?.response?.token) {
          sessionStorage.setItem("tempVerifyToken", apiData.response.token);
        }
        router.push("/email-verify");
      } else {
        setMessage({
          type: "error",
          text: apiData?.result || "Login failed",
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
