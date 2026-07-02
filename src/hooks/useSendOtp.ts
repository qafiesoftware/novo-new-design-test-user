import { API_ENDPOINTS } from "@/constants/endpoints";
import { OtpStatus } from "@/features/crm/funds/withdraw-funds/types/withdraw-funds.types";
import api from "@/lib/axios";
import { useState, useCallback, useRef } from "react";

interface SendOtpParams {
  amount: string;
  otp_type: string;
  mt5_id?: string; // optional
  mt5_receiverid?: string; // optional
}

interface UseSendOtpReturn {
  otpStatus: OtpStatus;
  otpSentOnce: boolean; // new
  otpMessage: string;
  otpError: string;
  sendOtp: (params: SendOtpParams) => Promise<void>;
  resetOtp: () => void;
}

const DISMISS_DURATION = {
  success: 3000,
  error: 5000,
};

export function useSendOtp(): UseSendOtpReturn {
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpSentOnce, setOtpSentOnce] = useState(false); // new
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleReset = useCallback(
    (type: "success" | "error") => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        setOtpStatus("idle");
        setOtpMessage("");
        setOtpError("");
      }, DISMISS_DURATION[type]);
    },
    [clearTimer]
  );

  const sendOtp = useCallback(
    async ({ amount, otp_type, mt5_id = "", mt5_receiverid = "" }: SendOtpParams) => {
      clearTimer();
      setOtpStatus("sending");
      setOtpMessage("");
      setOtpError("");

      try {
        const res = await api.post(API_ENDPOINTS.CRM.SEND_OTP, {
          amount,
          otp_type,
          mt5_id, // here
          mt5_receiverid,
        });

        const data = res?.data?.data;

        if (data?.status === 200) {
          setOtpStatus("sent");
          setOtpSentOnce(true);
          setOtpMessage(data?.result || "OTP sent successfully!");
          scheduleReset("success");
        } else {
          setOtpStatus("error");
          setOtpError(data?.result || "Failed to send OTP. Try again.");
          scheduleReset("error");
        }
      } catch {
        setOtpStatus("error");
        setOtpError("Something went wrong. Please try again.");
        scheduleReset("error");
      }
    },
    [clearTimer, scheduleReset]
  );

  const resetOtp = useCallback(() => {
    clearTimer();
    setOtpStatus("idle");
    setOtpSentOnce(false);
    setOtpMessage("");
    setOtpError("");
  }, [clearTimer]);

  return { otpStatus, otpSentOnce, otpMessage, otpError, sendOtp, resetOtp };
}
