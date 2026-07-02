"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/features/auth/register/schemas/register.schema";

import { useRegister } from "@/features/auth/register/hooks/register.hooks";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import CountryDropdown from "./countrydropdown/CountryDropdown";
import { Country } from "@/features/auth/register/types/register.types";
import FormMessage from "@/common/UI/FormMessage";

interface SignUpFormProps {
  partnerCode?: string;
}

export default function SignUpForm({ partnerCode }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const { mutate: register, isPending, message } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      partnercode: "",
      inputchecked: false,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register({
      ...data,
      partnercode: data.partnercode ?? "",
    });
  };

  useEffect(() => {
    if (partnerCode) {
      setValue("partnercode", partnerCode);
    }
  }, [partnerCode, setValue]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setValue("country_id", country.country_id, { shouldValidate: true });
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your details to create an account!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  {...formRegister("first_name")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                />

                {errors.first_name && (
                  <p className="text-error-500 mt-1 text-sm">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  {...formRegister("last_name")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                />
                {errors.last_name && (
                  <p className="text-error-500 mt-1 text-sm">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input type="email" placeholder="Enter your email" {...formRegister("email")} />
                {errors.email && (
                  <p className="text-error-500 mt-1 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    {...formRegister("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-error-500 mt-1 text-sm">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Mobile + Country */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="relative z-10">
                <Label>
                  Country<span className="text-error-500">*</span>
                </Label>
                <input type="hidden" {...formRegister("country_id")} />
                <CountryDropdown value={selectedCountry} onChange={handleCountryChange} />
                {errors.country_id && (
                  <p className="text-error-500 mt-1 text-sm">{errors.country_id.message}</p>
                )}
              </div>
              <div>
                <Label>
                  Mobile Number<span className="text-error-500">*</span>
                </Label>
                <div className="flex">
                  <span className="flex min-w-[70px] items-center justify-center rounded-l-md border bg-gray-50 px-4 py-2.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {selectedCountry ? `+${selectedCountry.country_code}` : "+"}
                  </span>
                  <Input
                    className="w-full rounded-l-none"
                    type="tel"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="Enter your mobile number"
                    {...formRegister("mobileno", {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      },
                    })}
                  />
                </div>
                {errors.mobileno && (
                  <p className="text-error-500 mt-1 text-sm">{errors.mobileno.message}</p>
                )}
              </div>
            </div>
            {/* partner code  */}
            <div className="grid gap-5">
              <div>
                <Label>Partner Code (Optional)</Label>

                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter partner code"
                  readOnly={!!partnerCode}
                  className={!!partnerCode ? "cursor-not-allowed bg-gray-100" : ""}
                  {...formRegister("partnercode", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                />

                {errors.partnercode && (
                  <p className="text-error-500 mt-1 text-sm">{errors.partnercode.message}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3">
              <Controller
                name="inputchecked"
                control={control}
                render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />}
              />

              {/* /pdf/PrivacyPolicy.pdf */}

              <p className="text-sm leading-snug text-gray-500 dark:text-gray-400">
                By creating an account, you agree to the{" "}
                <a
                  href="/pdf/PrivacyPolicy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </a>{" "}
                and to receive economic and marketing communications from Novotrend.
              </p>
            </div>
            {errors.inputchecked && (
              <p className="text-error-500 text-sm">{errors.inputchecked.message}</p>
            )}

            {message && (
              <div className="mt-2">
                <FormMessage message={message} />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
            {"Already have an account? "}
            <Link
              href="/sign-in"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
