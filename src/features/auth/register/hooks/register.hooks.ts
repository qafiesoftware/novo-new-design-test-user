import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCountries, registerUser } from "../api/register.api";
import { RegisterPayload } from "../types/register.types";
import { useState } from "react";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 24 * 60 * 60 * 1000,
  });
}



export function useRegister() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      const responseData = data?.data;
     
      if (responseData?.status === 200) {
        const token = responseData?.response?.token;
        if (token) {
          sessionStorage.setItem("tempVerifyToken", token);
        }
        localStorage.setItem("UserInfo", JSON.stringify(responseData?.response));
        router.push("/email-verify");
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "Registration failed. Please try again.",
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