"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/features/auth/forgot-password/schemas/forgot-password.schema";
import { useForgotPassword } from "@/features/auth/forgot-password/hooks/forgot-password.hooks";
import Link from "next/link";
import FormMessage from "@/common/UI/FormMessage";

export default function ForgetPassword() {
  const { mutate: sendResetLink, isPending, message } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetLink(data.email, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the email address linked to your account, and{" "}
            {"we'll send you a link to reset your password."}
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email<span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
                {errors.email && (
                  <p className="text-error-500 mt-1 text-sm">{errors.email.message}</p>
                )}
              </div>

              {message && <FormMessage message={message} />}

              {/* Button */}
              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              {"Wait, I remember my password... "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
