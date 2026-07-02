// "use client";
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Eye, EyeOff } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   ChangePasswordFormData,
//   changePasswordSchema,
//   UpdateNicknameFormData,
//   updateNicknameSchema,
// } from "@/features/crm/account/schemas/account.schemas";
// import { useQueryClient } from "@tanstack/react-query";
// import { useChangePassword, useUpdateNickname } from "@/features/crm/account/hooks/account.hooks";
// import FormMessage from "@/common/UI/FormMessage";
// import { useDashboardStats } from "@/features/crm/dashboard/hooks/dashboard.hooks";

// interface AccountModalProps {
//   type: "password" | "nickname" | null;
//   onClose: () => void;
//   mt5id: string;
//   nickname?: string;
//   mainPasswordStatus?: string | number;
// }

// export default function AccountModal({ type, onClose, mt5id, nickname }: AccountModalProps) {
//   const { user } = useDashboardStats();

//   const currentAccount = user?.mt5accounts?.find((item) => String(item?.accno) === String(mt5id));

//   const mainPasswordStatus = currentAccount?.main_password_status;
//   const [visible, setVisible] = useState(false);

//   const [passwordType, setPasswordType] = useState<"main" | "investor" | "both">("main");
//   const [showMainPass, setShowMainPass] = useState(false);
//   const [showInvestorPass, setShowInvestorPass] = useState(false);

//   const [canChangePassword, setCanChangePassword] = useState(true);

//   // Local message state — to pass FormMessage
//   const [localMessage, setLocalMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   useEffect(() => {
//     if (!localMessage?.text) return;
//     setVisible(true);
//     const fadeTimer = setTimeout(() => setVisible(false), 3000);
//     const removeTimer = setTimeout(() => setLocalMessage(null), 3500);

//     return () => {
//       clearTimeout(fadeTimer);
//       clearTimeout(removeTimer);
//     };
//   }, [localMessage?.text]);

//   const queryClient = useQueryClient();
//   const { mutate: changePwd, isPending: pwdPending } = useChangePassword();
//   const { mutate: updateNick, isPending: nickPending } = useUpdateNickname();

//   // Password form
//   const {
//     register: pwdRegister,
//     handleSubmit: handlePwdSubmit,
//     reset: resetPwd,
//     formState: { errors: pwdErrors },
//   } = useForm<ChangePasswordFormData>({
//     resolver: zodResolver(changePasswordSchema),
//     defaultValues: { passwordtype: "main" },
//   });

//   // Nickname form
//   const {
//     register: nickRegister,
//     handleSubmit: handleNickSubmit,
//     reset: resetNick,
//     formState: { errors: nickErrors },
//   } = useForm<UpdateNicknameFormData>({
//     resolver: zodResolver(updateNicknameSchema),
//     defaultValues: { nickname: nickname ?? "" },
//   });

//   // Nickname pre-fill
//   useEffect(() => {
//     if (type === "nickname" && nickname) {
//       resetNick({ nickname });
//     }
//   }, [type, nickname, resetNick]);

//   // Modal open hone pe state reset
//   useEffect(() => {
//     if (type) {
//       setCanChangePassword(true);
//       setLocalMessage(null);
//     }
//   }, [type]);

//   useEffect(() => {
//     setCanChangePassword(true);
//     setLocalMessage(null);
//     setPasswordType("main");
//     setShowMainPass(false);
//     setShowInvestorPass(false);
//     resetPwd({ passwordtype: "main" });
//   }, [mt5id]);

//   const handleClose = () => {
//     resetPwd();
//     resetNick();
//     setCanChangePassword(true);
//     setLocalMessage(null);
//     setShowMainPass(false);
//     setShowInvestorPass(false);
//     onClose();
//   };

//   const isMainPasswordPending = passwordType === "main" && String(mainPasswordStatus) === "1";

//   const onPasswordSubmit = (data: ChangePasswordFormData) => {
//     setLocalMessage(null);

//     changePwd(
//       {
//         passwordtype: data.passwordtype,
//         mt5id,
//         mainpassword: data.mainpassword,
//         investorpassword: data.investorpassword,
//       },
//       {
//         onSuccess: (res) => {
//           const status = res?.data?.status;
//           const resultMsg: string = res?.data?.result ?? "";
//           const canChange: boolean = Boolean(res?.data?.response?.can_change_password ?? true);

//           setCanChangePassword(canChange);

//           if (status === 200) {
//             queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
//             setLocalMessage({ type: "success", text: resultMsg });

//             if (canChange) {
//               resetPwd();
//               setShowMainPass(false);
//               setShowInvestorPass(false);
//               setTimeout(() => handleClose(), 2000);
//             }
//           } else {
//             const errorMsg = resultMsg.includes("Capital")
//               ? "Password must include uppercase, lowercase, numbers, and special characters."
//               : resultMsg || "Failed to change password.";

//             setLocalMessage({ type: "error", text: errorMsg });
//           }
//         },
//         onError: () => {
//           setLocalMessage({
//             type: "error",
//             text: "Something went wrong. Please try again.",
//           });
//         },
//       }
//     );
//   };

//   const onNicknameSubmit = (data: UpdateNicknameFormData) => {
//     setLocalMessage(null);

//     updateNick(
//       { mt5id, nickname: data.nickname },
//       {
//         onSuccess: (res) => {
//           const status = res?.data?.status;
//           const resultMsg: string = res?.data?.result ?? "";

//           if (status === 200) {
//             queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
//             setLocalMessage({
//               type: "success",
//               text: resultMsg || "Nickname updated successfully",
//             });
//             setTimeout(() => handleClose(), 2000);
//           } else {
//             setLocalMessage({
//               type: "error",
//               text: resultMsg || "Failed to update nickname.",
//             });
//           }
//         },
//         onError: () => {
//           setLocalMessage({
//             type: "error",
//             text: "Something went wrong!",
//           });
//         },
//       }
//     );
//   };

//   if (!type) return null;

//   return (
//     <div className="fixed inset-0 z-[1] flex items-center justify-center bg-gray-400/50 p-4 backdrop-blur-[32px]">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0 }}
//         className="w-full max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 dark:text-white"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             {type === "password" ? "Change Trading Password" : "Update Your Nick Name"}
//           </h2>
//           <button
//             type="button"
//             onClick={handleClose}
//             className="text-xl text-gray-500 hover:text-red-500"
//           >
//             ✕
//           </button>
//         </div>

//         {/* MT5 ID — common */}
//         <div>
//           <label className="text-sm font-medium dark:text-gray-400">MT5 ID</label>
//           <input
//             type="text"
//             value={mt5id}
//             readOnly
//             className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 text-gray-500 outline-none dark:border-slate-700 dark:text-slate-400"
//           />
//         </div>

//         {/* Password Form */}
//         {type === "password" ? (
//           <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
//             {/* Password Type */}
//             <div>
//               <label className="text-sm font-medium">Password Type</label>
//               <select
//                 value={passwordType}
//                 {...pwdRegister("passwordtype", {
//                   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
//                     setPasswordType(e.target.value as "main" | "investor" | "both");
//                   },
//                 })}
//                 className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
//               >
//                 <option value="main">Main</option>
//                 <option value="investor">Investor</option>
//               </select>
//             </div>

//             {/* Main Password */}
//             {(passwordType === "main" || passwordType === "both") && (
//               <div>
//                 <label className="text-sm font-medium">Main Password</label>
//                 <div className="relative mt-1">
//                   <input
//                     type={showMainPass ? "text" : "password"}
//                     placeholder="Enter main password"
//                     {...pwdRegister("mainpassword")}
//                     autoComplete="new-password"
//                     disabled={isMainPasswordPending || !canChangePassword}
//                     className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowMainPass((p) => !p)}
//                     disabled={isMainPasswordPending || !canChangePassword}
//                     className="absolute top-2.5 right-3 text-gray-500 disabled:opacity-50"
//                   >
//                     {showMainPass ? <Eye size={18} /> : <EyeOff size={18} />}
//                   </button>
//                 </div>
//                 {pwdErrors.mainpassword && (
//                   <p className="mt-1 text-xs text-red-500">{pwdErrors.mainpassword.message}</p>
//                 )}
//               </div>
//             )}

//             {/* Investor Password */}
//             {(passwordType === "investor" || passwordType === "both") && (
//               <div>
//                 <label className="text-sm font-medium">Investor Password</label>
//                 <div className="relative mt-1">
//                   <input
//                     type={showInvestorPass ? "text" : "password"}
//                     placeholder="Enter investor password"
//                     {...pwdRegister("investorpassword")}
//                     autoComplete="new-password"
//                     disabled={!canChangePassword}
//                     className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowInvestorPass((p) => !p)}
//                     disabled={!canChangePassword}
//                     className="absolute top-2.5 right-3 text-gray-500 disabled:opacity-50"
//                   >
//                     {showInvestorPass ? <Eye size={18} /> : <EyeOff size={18} />}
//                   </button>
//                 </div>
//                 {pwdErrors.investorpassword && (
//                   <p className="mt-1 text-xs text-red-500">{pwdErrors.investorpassword.message}</p>
//                 )}
//               </div>
//             )}

//             {/* Pending approval warning — mainPasswordStatus === "0" */}
//             {isMainPasswordPending && (
//               <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-700 shadow-sm">
//                 A Main Password change request is already pending admin approval. You cannot submit
//                 another request until the current request has been approved.
//               </div>
//             )}

//             {/* API response — animated green/red */}
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                 visible ? "mt-2 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0"
//               }`}
//             >
//               {localMessage?.text && (
//                 <div
//                   className={`inline-block rounded-md px-4 py-2 text-sm shadow-md ${
//                     localMessage.type === "success"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {localMessage.text}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-2 pt-2">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
//               >
//                 Close
//               </button>
//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 type="submit"
//                 disabled={pwdPending || isMainPasswordPending}
//                 className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {pwdPending ? "Updating..." : "Update Password"}
//               </motion.button>
//             </div>
//           </form>
//         ) : (
//           /*  Nickname Form  */
//           <form onSubmit={handleNickSubmit(onNicknameSubmit)} className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Nick Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter nick name"
//                 {...nickRegister("nickname")}
//                 className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               {nickErrors.nickname && (
//                 <p className="mt-1 text-xs text-red-500">{nickErrors.nickname.message}</p>
//               )}
//             </div>

//             {localMessage && (
//               <FormMessage message={{ type: localMessage.type, text: localMessage.text }} />
//             )}

//             <div className="flex justify-end gap-2 pt-2">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
//               >
//                 Close
//               </button>
//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 type="submit"
//                 disabled={nickPending}
//                 className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:opacity-70"
//               >
//                 {nickPending ? "Saving..." : "Save Nick Name"}
//               </motion.button>
//             </div>
//           </form>
//         )}
//       </motion.div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  changePasswordSchema,
  UpdateNicknameFormData,
  updateNicknameSchema,
} from "@/features/crm/account/schemas/account.schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useChangePassword, useUpdateNickname } from "@/features/crm/account/hooks/account.hooks";
import FormMessage from "@/common/UI/FormMessage";
import { useDashboardStats } from "@/features/crm/dashboard/hooks/dashboard.hooks";

interface AccountModalProps {
  type: "password" | "nickname" | null;
  onClose: () => void;
  mt5id: string;
  nickname?: string;
  mainPasswordStatus?: string | number;
}

export default function AccountModal({ type, onClose, mt5id, nickname }: AccountModalProps) {
  const { user } = useDashboardStats();

  const currentAccount = user?.mt5accounts?.find((item) => String(item?.accno) === String(mt5id));
  const mainPasswordStatus = currentAccount?.main_password_status;

  const [visible, setVisible] = useState(false);
  const [passwordType, setPasswordType] = useState<"main" | "investor">("main");
  const [showMainPass, setShowMainPass] = useState(false);
  const [showInvestorPass, setShowInvestorPass] = useState(false);
  const [canChangePassword, setCanChangePassword] = useState(true);
  const [localMessage, setLocalMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!localMessage?.text) return;
    setVisible(true);
    const fadeTimer = setTimeout(() => setVisible(false), 3000);
    const removeTimer = setTimeout(() => setLocalMessage(null), 3500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [localMessage?.text]);

  const queryClient = useQueryClient();
  const { mutate: changePwd, isPending: pwdPending } = useChangePassword();
  const { mutate: updateNick, isPending: nickPending } = useUpdateNickname();

  const {
    register: pwdRegister,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { passwordtype: "main" },
  });

  const {
    register: nickRegister,
    handleSubmit: handleNickSubmit,
    reset: resetNick,
    formState: { errors: nickErrors },
  } = useForm<UpdateNicknameFormData>({
    resolver: zodResolver(updateNicknameSchema),
    defaultValues: { nickname: nickname ?? "" },
  });

  useEffect(() => {
    if (type === "nickname" && nickname) {
      resetNick({ nickname });
    }
  }, [type, nickname, resetNick]);

  useEffect(() => {
    if (type) {
      setCanChangePassword(true);
      setLocalMessage(null);
    }
  }, [type]);

  useEffect(() => {
    setCanChangePassword(true);
    setLocalMessage(null);
    setPasswordType("main");
    setShowMainPass(false);
    setShowInvestorPass(false);
    resetPwd({ passwordtype: "main" });
  }, [mt5id]);

  const handleClose = () => {
    resetPwd();
    resetNick();
    setCanChangePassword(true);
    setLocalMessage(null);
    setShowMainPass(false);
    setShowInvestorPass(false);
    onClose();
  };

  const isMainPasswordPending = passwordType === "main" && String(mainPasswordStatus) === "1";

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    setLocalMessage(null);

    changePwd(
      {
        passwordtype: data.passwordtype,
        mt5id,
        mainpassword: data.mainpassword,
        investorpassword: data.investorpassword,
      },
      {
        onSuccess: (res) => {
          const status = res?.data?.status;
          const resultMsg: string = res?.data?.result ?? "";
          const canChange: boolean = Boolean(res?.data?.response?.can_change_password ?? true);

          setCanChangePassword(canChange);

          if (status === 200) {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
            setLocalMessage({ type: "success", text: resultMsg });
            if (canChange) {
              resetPwd();
              setShowMainPass(false);
              setShowInvestorPass(false);
              setTimeout(() => handleClose(), 2000);
            }
          } else {
            const errorMsg = resultMsg.includes("Capital")
              ? "Password must include uppercase, lowercase, numbers, and special characters."
              : resultMsg || "Failed to change password.";
            setLocalMessage({ type: "error", text: errorMsg });
          }
        },
        onError: () => {
          setLocalMessage({ type: "error", text: "Something went wrong. Please try again." });
        },
      }
    );
  };

  const onNicknameSubmit = (data: UpdateNicknameFormData) => {
    setLocalMessage(null);

    updateNick(
      { mt5id, nickname: data.nickname },
      {
        onSuccess: (res) => {
          const status = res?.data?.status;
          const resultMsg: string = res?.data?.result ?? "";

          if (status === 200) {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
            setLocalMessage({
              type: "success",
              text: resultMsg || "Nickname updated successfully",
            });
            setTimeout(() => handleClose(), 2000);
          } else {
            setLocalMessage({ type: "error", text: resultMsg || "Failed to update nickname." });
          }
        },
        onError: () => {
          setLocalMessage({ type: "error", text: "Something went wrong!" });
        },
      }
    );
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-400/50 p-4 backdrop-blur-[32px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {type === "password" ? "Change Trading Password" : "Update Your Nick Name"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* MT5 ID */}
        <div>
          <label className="text-sm font-medium dark:text-gray-400">MT5 ID</label>
          <input
            type="text"
            value={mt5id}
            readOnly
            className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 text-gray-500 outline-none dark:border-slate-700 dark:text-slate-400"
          />
        </div>

        {/* Password Form */}
        {type === "password" ? (
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            {/* Password Type */}
            <div>
              <label className="text-sm font-medium dark:text-gray-200">Password Type</label>
              <select
                value={passwordType}
                {...pwdRegister("passwordtype", {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                    setPasswordType(e.target.value as "main" | "investor");
                    setShowMainPass(false);
                    setShowInvestorPass(false);
                  },
                })}
                className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
              >
                <option value="main">Main</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            {/* Main Password */}
            {passwordType === "main" && (
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Main Password</label>
                <div className="relative mt-1">
                  <input
                    type={showMainPass ? "text" : "password"}
                    placeholder="Enter main password"
                    {...pwdRegister("mainpassword")}
                    autoComplete="new-password"
                    disabled={isMainPasswordPending || !canChangePassword}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMainPass((p) => !p)}
                    disabled={isMainPasswordPending || !canChangePassword}
                    className="absolute top-2.5 right-3 text-gray-500 disabled:opacity-50 dark:text-gray-400"
                  >
                    {showMainPass ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {pwdErrors.mainpassword && (
                  <p className="mt-1 text-xs text-red-500">{pwdErrors.mainpassword.message}</p>
                )}
              </div>
            )}

            {/* Investor Password */}
            {passwordType === "investor" && (
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Investor Password</label>
                <div className="relative mt-1">
                  <input
                    type={showInvestorPass ? "text" : "password"}
                    placeholder="Enter investor password"
                    {...pwdRegister("investorpassword")}
                    autoComplete="new-password"
                    disabled={!canChangePassword}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInvestorPass((p) => !p)}
                    disabled={!canChangePassword}
                    className="absolute top-2.5 right-3 text-gray-500 disabled:opacity-50 dark:text-gray-400"
                  >
                    {showInvestorPass ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {pwdErrors.investorpassword && (
                  <p className="mt-1 text-xs text-red-500">{pwdErrors.investorpassword.message}</p>
                )}
              </div>
            )}

            {/* Pending warning */}
            {isMainPasswordPending && (
              <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-700 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-400">
                A Main Password change request is already pending admin approval. You cannot submit
                another request until the current request has been approved.
              </div>
            )}

            {/* API response message */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                visible ? "mt-2 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0"
              }`}
            >
              {localMessage?.text && (
                <div
                  className={`inline-block rounded-md px-4 py-2 text-sm shadow-md ${
                    localMessage.type === "success"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {localMessage.text}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={pwdPending || isMainPasswordPending}
                className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pwdPending ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          </form>
        ) : (
          /* Nickname Form */
          <form onSubmit={handleNickSubmit(onNicknameSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-200">Nick Name</label>
              <input
                type="text"
                placeholder="Enter nick name"
                {...nickRegister("nickname")}
                className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:text-gray-200"
              />
              {nickErrors.nickname && (
                <p className="mt-1 text-xs text-red-500">{nickErrors.nickname.message}</p>
              )}
            </div>

            {localMessage && (
              <FormMessage message={{ type: localMessage.type, text: localMessage.text }} />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={nickPending}
                className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:opacity-70"
              >
                {nickPending ? "Saving..." : "Save Nick Name"}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
