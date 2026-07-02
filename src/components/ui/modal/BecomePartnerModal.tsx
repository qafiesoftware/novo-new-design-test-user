"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBecomePartner } from "@/features/partner/ib-register/hooks/ib-register.hooks";
import FormMessage from "@/common/UI/FormMessage";

interface BecomePartnerModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface BecomePartnerResponse {
  status: number;
  result: string;
}

const BecomePartnerModal: React.FC<BecomePartnerModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [accepted, setAccepted] = useState<boolean>(false);

  const { mutate, isPending, message } = useBecomePartner((data: BecomePartnerResponse) => {
    if (data?.status === 200) {
      setTimeout(() => {
        router.push("/partners/partner");
        onClose();
      }, 500);
    }

    if (data?.status === 202) {
      setTimeout(() => {
        router.push("/dashboard");
        onClose();
      }, 500);
    }
  });

  const handleSubmit = () => {
    mutate({
      term_accept: accepted ? 1 : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Become a Partner
        </h2>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Accept Terms & Conditions to continue.
        </p>

        {/* Checkbox */}
        <div className="mb-4 flex items-start gap-2">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            I accept Terms & Conditions
          </label>
        </div>

        <p className="mb-6 text-xs text-gray-500">
          By clicking continue, you agree to all policies and terms.
        </p>

        {/* message show here  */}
        <FormMessage message={message} />
        <br />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!accepted || isPending}
            className={`rounded px-4 py-2 text-white transition ${
              accepted ? "bg-[#465FFF] hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"
            }`}
          >
            {isPending ? "Processing..." : "Become Partner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomePartnerModal;
