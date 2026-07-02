import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getKyc,
  getUserProfile,
  submitEkyc,
  updateUserPassword,
  updateUserProfile,
} from "../api/user-profile.api";
import {
  EkycPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from "../types/user-profile.types";
import { useLogout } from "@/features/auth/sign-out/hooks/sign-out.hooks";

export function useGetKyc() {
  const query = useQuery({
    queryKey: ["crm", "profile", "kyc"],
    queryFn: getKyc,
  });

  const kycData = query.data?.data?.response;

  return {
    ...query,
    kycData,
    kycStatus: kycData?.[0]?.kyc_status ?? "",
  };
}

export function useSubmitEkyc() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: EkycPayload) => submitEkyc(payload),
    onSuccess: (data) => {
      const res = data?.data;
      if (res?.status === 200) {
        setMessage({ type: "success", text: res?.result || "Documents submitted successfully" });
        // KYC data refetch karo
        queryClient.invalidateQueries({ queryKey: ["crm", "profile", "kyc"] });
      } else {
        setMessage({ type: "error", text: res?.result || "Submission failed" });
      }
    },
    onError: () => {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    },
  });

  return { ...mutation, message };
}

// Profile update:

export function useGetUserProfile() {
  const query = useQuery({
    queryKey: ["crm", "profile", "details"],
    queryFn: getUserProfile,
  });

  const profileData = query.data?.data?.response;

  return {
    ...query,
    profileData,
  };
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfile(payload),

    onSuccess: (data) => {
      const res = data?.data;

      if (res?.status === 200) {
        setMessage({
          type: "success",
          text: res?.result || "Profile updated successfully",
        });

        queryClient.invalidateQueries({
          queryKey: ["crm", "profile", "details"],
        });
      } else {
        setMessage({
          type: "error",
          text: res?.result || "Profile update failed",
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

  return {
    ...mutation,
    message,
  };
}

// password update/ reset - profile section

// export function useUpdateUserPassword() {
//   const [message, setMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   const mutation = useMutation({
//     mutationFn: (payload: UpdatePasswordPayload) => updateUserPassword(payload),

//     onSuccess: (data) => {
//       const res = data?.data;

//       if (res?.status === 200) {
//         setMessage({
//           type: "success",
//           text: res?.result || "Password updated successfully",
//         });
//       } else {
//         setMessage({
//           type: "error",
//           text: res?.result || "Password update failed",
//         });
//       }
//     },

//     onError: () => {
//       setMessage({
//         type: "error",
//         text: "Something went wrong. Please try again.",
//       });
//     },
//   });

//   return {
//     ...mutation,
//     message,
//   };
// }

export function useUpdateUserPassword() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { handleLogout } = useLogout();

  const mutation = useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => updateUserPassword(payload),

    onSuccess: (data) => {
      const res = data?.data;

      if (res?.status === 200) {
        setMessage({
          type: "success",
          text: "Password updated successfully. Logging out...",
        });

        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: res?.result || "Password update failed",
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

  return {
    ...mutation,
    message,
  };
}
