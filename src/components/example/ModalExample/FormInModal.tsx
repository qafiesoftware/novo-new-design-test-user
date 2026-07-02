"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { Eye, EyeOff } from "lucide-react";
import { useOpenAccount } from "@/features/crm/account/hooks/account.hooks";
import FormMessage from "@/common/UI/FormMessage";
import {
  OpenAccountFormData,
  openAccountSchema,
} from "@/features/crm/account/schemas/account.schemas";

interface Plan {
  groupid: string;
  groupname: string;
  leverage: string;
}

interface FormInModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function FormInModal({ isOpen, onClose, plan }: FormInModalProps) {
  const [showMainPass, setShowMainPass] = useState(false);
  const [showInvestorPass, setShowInvestorPass] = useState(false);

  const { mutate: openAcc, isPending, message } = useOpenAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpenAccountFormData>({
    resolver: zodResolver(openAccountSchema),
  });

  const onSubmit = (data: OpenAccountFormData) => {
    if (!plan) return;

    openAcc(
      {
        selectgroup: plan.groupid,
        accleverage: plan.leverage,
        nickname: data.nickname,
        mainpassword: data.mainpassword,
        investorpassword: data.investorpassword,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.status === 200) {
            reset();
            onClose();
          }
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[584px] p-5 lg:p-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Add Account</h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {/* Account Type — disabled */}
          <div className="col-span-1">
            <Label>Account Type</Label>
            <Input
              type="text"
              defaultValue={plan ? `${plan.groupname} (${plan.leverage})` : ""}
              disabled
              className="cursor-not-allowed"
            />
          </div>

          {/* Nick Name */}
          <div className="col-span-1">
            <Label>Nick Name</Label>
            <Input type="text" placeholder="Enter nick name" {...register("nickname")} />
            {errors.nickname && (
              <p className="text-error-500 mt-1 text-xs">{errors.nickname.message}</p>
            )}
          </div>

          {/* Main Password — always hidden, no toggle */}
          <div className="relative col-span-1">
            <Label>Main Password</Label>

            <Input
              type={showMainPass ? "text" : "password"}
              placeholder="Enter main password"
              {...register("mainpassword")}
            />

            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowMainPass((prev) => !prev)}
            >
              {showMainPass ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            {errors.mainpassword && (
              <p className="text-error-500 mt-1 text-xs">{errors.mainpassword.message}</p>
            )}
          </div>

          {/* Investor Password — toggle visible */}
          <div className="relative col-span-1">
            <Label>Investor Password</Label>
            <Input
              type={showInvestorPass ? "text" : "password"}
              placeholder="Create investor password"
              {...register("investorpassword")}
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInvestorPass((prev) => !prev)}
            >
              {showInvestorPass ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.investorpassword && (
              <p className="text-error-500 mt-1 text-xs">{errors.investorpassword.message}</p>
            )}
          </div>
        </div>

        {/* API Message */}
        {message && (
          <div className="mt-4">
            <FormMessage message={message} />
          </div>
        )}

        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button size="sm" variant="outline" type="button" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? "Opening..." : "Confirm Open Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}