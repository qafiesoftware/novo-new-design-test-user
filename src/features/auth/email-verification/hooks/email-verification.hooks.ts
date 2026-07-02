import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resendOtp, verifyOtp } from "../api/email-verification.api";
import { useState } from "react";

export function useVerifyOtp() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      const responseData = data?.data;
      if (responseData?.status === 200) {
        setMessage({
          type: "success",
          text: responseData?.result || "Your account has been created successfully.",
        });
        setTimeout(() => {
          sessionStorage.removeItem("tempVerifyToken");
          router.push("/sign-in");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "OTP verification failed. Please try again.",
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

// Resend OTP
export function useResendOtp() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      const responseData = data?.data;
      if (responseData?.status === 200) {
        setMessage({
          type: "success",
          text: responseData?.result || "OTP resent successfully.",
        });
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "Failed to resend OTP. Please try again.",
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

// export function useResendOtp() {
//   return useMutation({
//     mutationFn: resendOtp,
//     onSuccess: (data) => {
//       const responseData = data?.data;
//       if (responseData?.status === 200) {
//         // success — component mein toast dikhao
//       }
//     },
//   });
// }
