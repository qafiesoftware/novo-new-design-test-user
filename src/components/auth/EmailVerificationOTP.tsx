"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useVerifyOtp,
  useResendOtp,
} from "@/features/auth/email-verification/hooks/email-verification.hooks";
import FormMessage from "@/common/UI/FormMessage";

const OTP_LENGTH = 6;

export default function EmailVerificationOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [token, setToken] = useState<string | null>(null);

  const { mutate: verify, isPending: isVerifying, message: verifyMessage } = useVerifyOtp();
  
  const { mutate: resend, isPending: isResending, message } = useResendOtp();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("tempVerifyToken");
    if (!storedToken) {
      router.push("/sign-up");
      return;
    }
    setToken(storedToken);
  }, [router]);

  // Auto focus
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = val ? val[0] : "";
    setOtp(newOtp);
    setError(false);
    if (val && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < OTP_LENGTH) {
      setError(true);
      return;
    }
    if (!token) return;

    verify({ otp: otp.join(""), token });
  };

  const handleResend = () => {
    if (!token) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError(false);
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    resend({ token });
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {"We've sent a 6-digit code to your email address. Enter it below to continue."}
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Verification code<span className="text-error-500">*</span>
            </label>
            <div className="flex gap-2 sm:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`dark:bg-dark-900 shadow-theme-xs focus:ring-brand-500/10 h-11 w-full rounded-lg border bg-transparent text-center text-lg font-semibold text-gray-800 focus:ring-3 focus:outline-hidden dark:text-white/90 ${
                    error
                      ? "border-error-500 focus:border-error-500"
                      : "focus:border-brand-300 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
                  }`}
                />
              ))}
            </div>
            {error && <p className="text-error-500 mt-1.5 text-sm">Please enter complete OTP.</p>}
          </div>

          {verifyMessage && <FormMessage message={verifyMessage} />}
          {message && <FormMessage message={message} />}

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </button>
        </div>

        <div className="mt-5">
          <p className="text-center text-sm text-gray-500 sm:text-start dark:text-gray-400">
            {"Didn't receive the code? "}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend code"}
              </button>
            ) : (
              <span className="text-gray-400">Resend in {timer}s</span>
            )}
          </p>
          <p className="mt-2 text-center text-sm text-gray-500 sm:text-start dark:text-gray-400">
            {"Wrong email? "}
            <Link
              href="/sign-up"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Change email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
